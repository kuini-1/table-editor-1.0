// Bandwidth limits in bytes
export const BANDWIDTH_LIMITS = {
  TRIAL: 50 * 1024 * 1024, // 50MB
  BASIC: 10 * 1024 * 1024 * 1024, // 10GB
  PRO: 50 * 1024 * 1024 * 1024, // 50GB
  DEFAULT: 50 * 1024 * 1024, // 50MB (default for users without subscription)
} as const;

/**
 * Get Supabase service client for server-side operations
 * Only works on server, returns null on client
 */
async function getServiceClient() {
  if (typeof window !== 'undefined') {
    return null; // Client-side, can't use service client
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      return null;
    }

    return createClient(supabaseUrl, serviceRoleKey);
  } catch {
    return null;
  }
}

// Cache for bandwidth info (5-minute TTL)
interface BandwidthCache {
  used: number;
  limit: number;
  timestamp: number;
}

const BANDWIDTH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const bandwidthCache = new Map<string, BandwidthCache>();

// Batch bandwidth updates to reduce API calls
const pendingUpdates = new Map<string, number>(); // userId -> total pending bytes
const BATCH_UPDATE_INTERVAL = 2000; // 2 seconds
const MIN_BYTES_TO_TRACK = 1024; // Only track operations larger than 1KB
let batchUpdateTimer: NodeJS.Timeout | null = null;


// Throttle bandwidth info fetches
const fetchPromises = new Map<string, Promise<{ used: number; limit: number }>>();

/**
 * Get current bandwidth usage and limit for a user
 * Uses direct database access on server, API endpoint on client
 * Throttled to prevent excessive API calls
 */
export async function getBandwidthInfo(userId: string): Promise<{
  used: number;
  limit: number;
}> {
  // Check cache first
  const cached = bandwidthCache.get(userId);
  if (cached && Date.now() - cached.timestamp < BANDWIDTH_CACHE_TTL) {
    return { used: cached.used, limit: cached.limit };
  }

  // If there's already a fetch in progress, reuse it
  const existingFetch = fetchPromises.get(userId);
  if (existingFetch) {
    return existingFetch;
  }

  // Create new fetch promise
  const fetchPromise = (async () => {
    try {
      // On server, use direct database access
      const serviceClient = await getServiceClient();
      if (serviceClient) {
        const { data: profile, error } = await serviceClient
          .from('profiles')
          .select('current_month_bandwidth_used, monthly_bandwidth_limit, subscription_status')
          .eq('id', userId)
          .single();

        if (error || !profile) {
          throw new Error('Failed to fetch bandwidth info from database');
        }

        // Calculate limit based on subscription status
        let limit = profile.monthly_bandwidth_limit || BANDWIDTH_LIMITS.DEFAULT;
        if (profile.subscription_status === 'trialing') {
          limit = BANDWIDTH_LIMITS.TRIAL;
        }

        const used = profile.current_month_bandwidth_used || 0;

        // Update cache
        bandwidthCache.set(userId, { used, limit, timestamp: Date.now() });

        // Remove from pending fetches
        fetchPromises.delete(userId);

        return { used, limit };
      }

      // On client, use API endpoint
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/bandwidth`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch bandwidth info');
      }

      const { used, limit } = await response.json();

      // Update cache
      bandwidthCache.set(userId, { used, limit, timestamp: Date.now() });

      // Remove from pending fetches
      fetchPromises.delete(userId);

      return { used, limit };
    } catch (error) {
      console.error('Error fetching bandwidth info:', error);
      // Remove from pending fetches
      fetchPromises.delete(userId);
      // Return default values on error
      const defaultLimit = BANDWIDTH_LIMITS.DEFAULT;
      return { used: 0, limit: defaultLimit };
    }
  })();

  // Store the promise
  fetchPromises.set(userId, fetchPromise);

  return fetchPromise;
}

/**
 * Check if a request would exceed bandwidth limit
 */
export async function checkBandwidthLimit(
  userId: string,
  estimatedSize: number
): Promise<{ allowed: boolean; error?: string }> {
  const { used, limit } = await getBandwidthInfo(userId);

  const newUsage = used + estimatedSize;

  if (newUsage > limit) {
    const usedGB = (used / (1024 * 1024 * 1024)).toFixed(2);
    const limitGB = (limit / (1024 * 1024 * 1024)).toFixed(2);
    const limitMB = (limit / (1024 * 1024)).toFixed(0);

    // Use MB for trial, GB for others
    const limitDisplay = limit < 100 * 1024 * 1024 
      ? `${limitMB} MB` 
      : `${limitGB} GB`;

    return {
      allowed: false,
      error: `Bandwidth limit exceeded. You have used ${usedGB} GB of your ${limitDisplay} monthly limit. Please upgrade your plan to continue.`,
    };
  }

  return { allowed: true };
}

/**
 * Get the base URL for API calls
 * Works in both browser and server environments
 */
function getApiBaseUrl(): string {
  // In browser, use relative URL
  if (typeof window !== 'undefined') {
    return '';
  }
  
  // On server, try to get from environment variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to localhost (for local development)
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

/**
 * Flush pending bandwidth updates
 * Uses direct database access on server, API endpoint on client
 */
async function flushBandwidthUpdates(): Promise<void> {
  if (pendingUpdates.size === 0) {
    return;
  }

  const updates = Array.from(pendingUpdates.entries());
  pendingUpdates.clear();

  // Process each user's updates
  for (const [userId, totalBytes] of updates) {
    if (totalBytes <= 0) continue;

    try {
      // On server, use direct database access
      const serviceClient = await getServiceClient();
      if (serviceClient) {
        // Try to use RPC function first
        const { error: rpcError } = await serviceClient.rpc('increment_bandwidth_usage', {
          p_user_id: userId,
          p_bytes: totalBytes,
        });

        if (rpcError) {
          // Fallback to manual update
          const { data: profile, error: profileError } = await serviceClient
            .from('profiles')
            .select('current_month_bandwidth_used')
            .eq('id', userId)
            .single();

          if (profileError) {
            console.error('Error fetching profile for bandwidth update:', profileError);
            continue;
          }

          if (profile) {
            const currentUsed = profile.current_month_bandwidth_used || 0;
            const { error: updateError } = await serviceClient
              .from('profiles')
              .update({
                current_month_bandwidth_used: currentUsed + totalBytes,
              })
              .eq('id', userId);

            if (updateError) {
              console.error('Error updating bandwidth:', updateError);
              continue;
            }
          }
        }

        // Invalidate cache
        bandwidthCache.delete(userId);
        continue;
      }

      // On client, use API endpoint
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/bandwidth`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bytes: totalBytes }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error tracking bandwidth via API:', error);
      } else {
        // Invalidate cache
        bandwidthCache.delete(userId);
      }
    } catch (error) {
      console.error('Unexpected error tracking bandwidth:', error);
    }
  }
}

/**
 * Track bandwidth usage by incrementing the user's usage counter
 * Uses batched updates to reduce API calls
 */
export async function trackBandwidthUsage(
  userId: string,
  actualSize: number
): Promise<void> {
  if (actualSize <= 0) {
    return; // Don't track zero or negative sizes
  }

  // Skip tracking for very small operations to reduce noise
  if (actualSize < MIN_BYTES_TO_TRACK) {
    return;
  }

  // Add to pending updates
  const currentPending = pendingUpdates.get(userId) || 0;
  pendingUpdates.set(userId, currentPending + actualSize);

  // Schedule batch update if not already scheduled
  if (!batchUpdateTimer) {
    batchUpdateTimer = setTimeout(() => {
      batchUpdateTimer = null;
      flushBandwidthUpdates().catch((err) => {
        console.error('Error flushing bandwidth updates:', err);
      });
    }, BATCH_UPDATE_INTERVAL);
  }
}

/**
 * Clear bandwidth cache for a user (useful after subscription changes)
 */
export function clearBandwidthCache(userId: string): void {
  bandwidthCache.delete(userId);
}

/**
 * Estimate response size for a Supabase query
 * This is approximate and based on common patterns
 */
export function estimateResponseSize(
  rowCount: number,
  averageRowSize: number = 1024 // Default 1KB per row
): number {
  return rowCount * averageRowSize;
}

/**
 * Get actual response size from response data
 */
export function getResponseSize(data: unknown): number {
  if (data === null || data === undefined) {
    return 0;
  }

  try {
    // For arrays, estimate based on JSON stringification
    if (Array.isArray(data)) {
      const jsonString = JSON.stringify(data);
      // Use Buffer in Node.js, Blob in browser
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(jsonString, 'utf8');
      } else if (typeof Blob !== 'undefined') {
        return new Blob([jsonString]).size;
      } else {
        // Fallback estimation
        return jsonString.length * 2; // Rough estimate: 2 bytes per char for UTF-8
      }
    }

    // For objects, estimate based on JSON stringification
    if (typeof data === 'object') {
      const jsonString = JSON.stringify(data);
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(jsonString, 'utf8');
      } else if (typeof Blob !== 'undefined') {
        return new Blob([jsonString]).size;
      } else {
        return jsonString.length * 2;
      }
    }

    // For strings, use actual byte length
    if (typeof data === 'string') {
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(data, 'utf8');
      } else if (typeof Blob !== 'undefined') {
        return new Blob([data]).size;
      } else {
        return data.length * 2; // Rough estimate
      }
    }

    // For other types, use a small default
    return 100; // 100 bytes default
  } catch (error) {
    console.error('Error calculating response size:', error);
    // Fallback estimation
    if (Array.isArray(data)) {
      return data.length * 1024; // ~1KB per item
    }
    return 1024; // Default 1KB
  }
}

