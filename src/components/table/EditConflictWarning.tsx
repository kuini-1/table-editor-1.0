"use client";

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, User } from 'lucide-react';
import type { EditingSession } from '@/hooks/useEditingIndicators';

interface EditConflictWarningProps {
  sessions: EditingSession[];
  currentUserId?: string;
  onProceed?: () => void;
  onCancel?: () => void;
}

export function EditConflictWarning({ 
  sessions, 
  currentUserId,
  onProceed,
  onCancel 
}: EditConflictWarningProps) {
  // Filter out current user's sessions
  const otherUsers = sessions.filter(s => s.user_id !== currentUserId);

  if (otherUsers.length === 0) return null;

  const uniqueUsers = Array.from(
    new Map(otherUsers.map(s => [s.user_email, s])).values()
  );

  const userList = uniqueUsers.map(u => u.user_name || u.user_email).join(', ');

  return (
    <Alert variant="destructive" className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold mb-1">Warning: This row is being edited by another user</p>
            <p className="text-sm">
              {uniqueUsers.length === 1 ? (
                <>
                  <User className="inline h-3 w-3 mr-1" />
                  <strong>{userList}</strong> is currently editing this row. 
                  Proceeding may cause conflicts.
                </>
              ) : (
                <>
                  <strong>{uniqueUsers.length} users</strong> ({userList}) are currently editing this row. 
                  Proceeding may cause conflicts.
                </>
              )}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-amber-700 dark:text-amber-300 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

