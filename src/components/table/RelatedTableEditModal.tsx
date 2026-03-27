"use client";

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { fetchRelatedTableRow, updateRelatedTableRow } from '@/lib/fetchRelatedTableRow';
import { getFormComponentForTableType, hasFormComponentForTableType } from '@/lib/tableFormComponents';
import { ModularForm } from './ModularForm';
import type { RelatedTableFieldConfig } from '@/lib/relatedTableConfig';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';

interface RelatedTableEditModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when modal should close
   */
  onClose: () => void;
  
  /**
   * The configuration for this related table field
   */
  config: RelatedTableFieldConfig;
  
  /**
   * The ID of the row to edit (from the field value)
   */
  rowId: string | number;
  
  /**
   * The table ID for the related table
   */
  relatedTableId: string;
  
  /**
   * Callback when row is saved
   */
  onSave?: (updatedData: Record<string, unknown>) => void;
}

/**
 * Modal component for editing a row from a related table.
 * This modal loads the row data and displays it in a form for editing.
 */
export function RelatedTableEditModal({
  isOpen,
  onClose,
  config,
  rowId,
  relatedTableId,
  onSave,
}: RelatedTableEditModalProps) {
  console.log('=== RELATEDTABLEEDITMODAL RENDER ===', { isOpen, rowId, config: config.relatedTableType });
  
  const { userProfile, fetchUserProfile } = useStore();
  const [rowData, setRowData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [correctTableId, setCorrectTableId] = useState<string>(relatedTableId);
  const correctTableIdRef = useRef<string | null>(null); // Cache the correct table_id per table type
  const formWrapperRef = useRef<HTMLDivElement>(null);
  
  // Global cache for table_id lookups (shared across all instances)
  const tableIdCacheRef = useRef<Map<string, { tableId: string; timestamp: number }>>(new Map());
  const TABLE_ID_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Get the correct table_id for the related table (using store's userProfile to avoid duplicate API calls)
  useEffect(() => {
    if (isOpen && config.relatedTableType) {
      // Check global cache first
      const cached = tableIdCacheRef.current.get(config.relatedTableType);
      if (cached && Date.now() - cached.timestamp < TABLE_ID_CACHE_DURATION) {
        console.log('=== USING GLOBAL CACHED TABLE_ID ===', cached.tableId);
        correctTableIdRef.current = cached.tableId;
        setCorrectTableId(cached.tableId);
        return;
      }
      
      // Use instance cache if available
      if (correctTableIdRef.current) {
        console.log('=== USING INSTANCE CACHED TABLE_ID ===', correctTableIdRef.current);
        setCorrectTableId(correctTableIdRef.current);
        return;
      }
      
      const getCorrectTableId = async () => {
        try {
          // Use userProfile from store if available (avoids duplicate user/profile API calls)
          let ownerId: string | null = null;
          
          if (userProfile?.data) {
            // Get owner_id from cached userProfile
            if (userProfile.data.role === 'owner' && userProfile.data.owners?.[0]?.id) {
              ownerId = userProfile.data.owners[0].id;
            } else if (userProfile.data.role === 'sub_owner' && userProfile.data.sub_owners?.[0] && 'owner_id' in userProfile.data.sub_owners[0]) {
              ownerId = (userProfile.data.sub_owners[0] as { owner_id: string }).owner_id;
            }
          }
          
          // If we don't have userProfile, fetch it (but it's cached in the store)
          if (!ownerId) {
            await fetchUserProfile();
            const updatedProfile = useStore.getState().userProfile;
            if (updatedProfile?.data) {
              if (updatedProfile.data.role === 'owner' && updatedProfile.data.owners?.[0]?.id) {
                ownerId = updatedProfile.data.owners[0].id;
              } else if (updatedProfile.data.role === 'sub_owner' && updatedProfile.data.sub_owners?.[0] && 'owner_id' in updatedProfile.data.sub_owners[0]) {
                ownerId = (updatedProfile.data.sub_owners[0] as { owner_id: string }).owner_id;
              }
            }
          }
          
          if (ownerId) {
            // Only fetch tables (this is the only API call we need to make)
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: table } = await supabase
              .from('tables')
              .select('id')
              .eq('owner_id', ownerId)
              .eq('type', config.relatedTableType)
              .single();
            
            if (table) {
              console.log('=== FOUND CORRECT TABLE_ID ===', table.id);
              // Cache in both instance and global cache
              correctTableIdRef.current = table.id;
              tableIdCacheRef.current.set(config.relatedTableType, {
                tableId: table.id,
                timestamp: Date.now()
              });
              setCorrectTableId(table.id);
            }
          }
        } catch (err) {
          console.error('Error getting correct table_id:', err);
        }
      };
      
      getCorrectTableId();
    }
  }, [isOpen, config.relatedTableType, userProfile, fetchUserProfile, TABLE_ID_CACHE_DURATION]);
  
  // Sync internal state with prop
  useEffect(() => {
    console.log('=== SYNCING INTERNAL STATE ===', { isOpen });
    if (isOpen) {
      setInternalIsOpen(true);
    }
  }, [isOpen]);
  
  // Intercept form submission and button clicks at DOM level
  // ONLY when this modal is open and we have rowData
  // IMPORTANT: This interceptor should ONLY affect forms inside this modal
  useEffect(() => {
    // Only set up interceptor when modal is open and we have rowData
    if (!isOpen || !rowData || !internalIsOpen) {
      // Clean up any existing interceptors when modal closes
      if (formWrapperRef.current) {
        const form = formWrapperRef.current.querySelector('form[data-related-table-form]');
        if (form) {
          (form as HTMLFormElement).removeAttribute('data-related-table-form');
        }
      }
      return;
    }
    
    // Wait for form to render (Suspense might delay it)
    const setupInterceptor = () => {
      // Double-check modal is still open
      if (!isOpen || !internalIsOpen) {
        return null;
      }
      
      if (!formWrapperRef.current) {
        console.log('=== FORM INTERCEPTOR: Ref not attached yet ===');
        return null;
      }
      
      // Only look for forms INSIDE our wrapper (not globally)
      const form = formWrapperRef.current.querySelector('form');
      if (!form) {
        console.log('=== FORM NOT FOUND IN WRAPPER ===');
        return null;
      }
      
      // Add a data attribute to identify this as a related table form
      const formElement = form as HTMLFormElement;
      if (formElement.hasAttribute('data-related-table-form')) {
        // Already set up, skip
        return null;
      }
      
      formElement.setAttribute('data-related-table-form', 'true');
      console.log('=== SETTING UP FORM SUBMIT INTERCEPTOR (RELATED TABLE MODAL ONLY) ===');
      
      // Modify form to prevent navigation
      formElement.method = 'post';
      formElement.removeAttribute('action'); // Remove action entirely to prevent navigation
      formElement.setAttribute('data-prevent-navigation', 'true');
      console.log('=== FORM MODIFIED ===', { method: formElement.method, action: formElement.action || '(removed)' });
      
      // Listen for submit button clicks
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        console.log('=== SUBMIT BUTTON FOUND ===');
        
        const handleSubmitClick = () => {
          // Only handle if this is our form
          if (!formElement.hasAttribute('data-related-table-form')) {
            return;
          }
          console.log('=== SUBMIT BUTTON CLICKED (RELATED TABLE) ===');
          console.log('Form action:', formElement.action);
          console.log('Form method:', formElement.method);
          
          // Check if form has validation errors
          if (!formElement.checkValidity()) {
            console.error('=== FORM VALIDATION FAILED (HTML5) ===');
            formElement.reportValidity();
          } else {
            console.log('=== FORM VALIDATION PASSED (HTML5) ===');
          }
        };
        
        submitButton.addEventListener('click', handleSubmitClick, true);
        
        // Also listen for form submit events
        // We need to prevent default to stop navigation, but still trigger react-hook-form
        const handleFormSubmit = (e: SubmitEvent) => {
          // CRITICAL: Only intercept if this is our related table form AND modal is open
          // Check the target to ensure it's our form
          const target = e.target as HTMLFormElement;
          if (!target || target !== formElement || !formElement.hasAttribute('data-related-table-form') || !isOpen || !internalIsOpen) {
            // Let normal form submission proceed - this is NOT a related table form
            console.log('=== FORM SUBMIT EVENT (NOT RELATED TABLE) - ALLOWING NORMAL SUBMISSION ===');
            return;
          }
          
          console.log('=== FORM SUBMIT EVENT FIRED (RELATED TABLE) ===');
          
          // CRITICAL: Prevent default to stop page navigation
          e.preventDefault();
          e.stopPropagation();
          
          console.log('=== PREVENTED DEFAULT FORM SUBMISSION ===');
          
          // Now we need to manually trigger react-hook-form's submit handler
          // React-hook-form attaches its handler to the form's onSubmit
          // We can get the form's current values and call our onSubmit handler directly
          
          // Get all form data
          const formData = new FormData(formElement);
          const formValues: Record<string, unknown> = {};
          formData.forEach((value, key) => {
            formValues[key] = value;
          });
          
          // Also get values from all input fields (for react-hook-form managed fields)
          const inputs = formElement.querySelectorAll('input, select, textarea');
          inputs.forEach((input) => {
            const htmlInput = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            if (htmlInput.name && !formValues[htmlInput.name]) {
              if (htmlInput.type === 'checkbox') {
                formValues[htmlInput.name] = (htmlInput as HTMLInputElement).checked;
              } else if (htmlInput.type === 'number') {
                formValues[htmlInput.name] = htmlInput.value ? Number(htmlInput.value) : null;
              } else {
                formValues[htmlInput.name] = htmlInput.value || null;
              }
            }
          });
          
          console.log('=== MANUALLY TRIGGERING FORM SUBMIT HANDLER ===');
          console.log('Form values keys:', Object.keys(formValues));
          
          // Dispatch a custom event that the component can listen to
          console.log('=== DISPATCHING related-table-submit EVENT ===');
          const customSubmitEvent = new CustomEvent('related-table-submit', {
            detail: formValues,
            bubbles: true,
            cancelable: true
          });
          formElement.dispatchEvent(customSubmitEvent);
          console.log('=== EVENT DISPATCHED ===');
        };
        
        // Listen in capture phase to intercept early, but ONLY on our form
        form.addEventListener('submit', handleFormSubmit, true);
        
        return () => {
          submitButton.removeEventListener('click', handleSubmitClick, true);
          form.removeEventListener('submit', handleFormSubmit, true);
          // Clean up the data attribute when component unmounts
          formElement.removeAttribute('data-related-table-form');
          console.log('=== FORM INTERCEPTOR CLEANED UP ===');
        };
      } else {
        console.log('=== SUBMIT BUTTON NOT FOUND ===');
        console.log('Available buttons:', Array.from(form.querySelectorAll('button')).map(b => ({
          type: b.type,
          text: b.textContent?.trim()
        })));
      }
      return null;
    };
    
    // Try immediately
    let cleanup = setupInterceptor();
    
    // If form not found, try again after delays (Suspense might delay rendering)
    if (!cleanup) {
      const timeouts: NodeJS.Timeout[] = [];
      for (const delay of [100, 300, 500, 1000, 2000]) {
        const timeoutId = setTimeout(() => {
          if (!cleanup && isOpen && internalIsOpen) {
            cleanup = setupInterceptor();
          }
        }, delay);
        timeouts.push(timeoutId);
      }
      
      return () => {
        timeouts.forEach(clearTimeout);
        if (cleanup) cleanup();
      };
    }
    
    return cleanup;
  }, [isOpen, rowData, internalIsOpen]);
  
  // Track if we've already fetched the row data for this rowId to prevent duplicate calls
  const fetchedRowIdRef = useRef<string | number | null>(null);
  const fetchInProgressRef = useRef(false);
  
  // Fetch the row data when modal opens
  useEffect(() => {
    if (isOpen && rowId) {
      // Prevent duplicate fetches for the same rowId
      if (fetchedRowIdRef.current === rowId && rowData) {
        console.log('=== SKIPPING DUPLICATE FETCH ===', { rowId, hasRowData: !!rowData });
        return;
      }
      
      // Prevent concurrent fetches
      if (fetchInProgressRef.current) {
        console.log('=== FETCH ALREADY IN PROGRESS ===');
        return;
      }
      
      setLoading(true);
      setError(null);
      fetchInProgressRef.current = true;
      fetchedRowIdRef.current = rowId;
      
      // Wait for correctTableId to be fetched to avoid duplicate API calls
      const fetchRowData = async () => {
        // Use cached table_id if available, otherwise wait for it
        let tableIdToUse = correctTableIdRef.current || correctTableId;
        
        // If we don't have the cached table_id yet, wait a bit for the useEffect to fetch it
        if (!correctTableIdRef.current && config.relatedTableType) {
          // Wait up to 1 second for the table_id to be fetched
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (correctTableIdRef.current) {
              tableIdToUse = correctTableIdRef.current;
              break;
            }
          }
        }
        
        // Fetch row data - don't pass relatedTableType if we already have the table_id
        // This prevents fetchRelatedTableRow from calling getTableIdForType again (duplicate API calls)
        const data = await fetchRelatedTableRow(
          config.relatedTableName,
          tableIdToUse, // Use the cached/state table_id
          rowId,
          config.relatedTableIdField || 'id',
          correctTableIdRef.current ? undefined : config.relatedTableType // Only fetch if we don't have cached table_id
        );
        
        if (data) {
          setRowData(data as Record<string, unknown>);
        } else {
          setError(`Row with ID ${rowId} not found in ${config.relatedTableName}`);
        }
        setLoading(false);
        fetchInProgressRef.current = false;
      };
      
      fetchRowData().catch((err) => {
        console.error('Error fetching related table row:', err);
        setError(err instanceof Error ? err.message : 'Failed to load row data');
        setLoading(false);
        fetchInProgressRef.current = false;
      });
    } else if (!isOpen) {
      // Reset state when modal closes
      setRowData(null);
      setError(null);
      setLoading(true);
      fetchedRowIdRef.current = null;
      fetchInProgressRef.current = false;
    }
  }, [isOpen, rowId, rowData, correctTableId, config.relatedTableName, config.relatedTableIdField, config.relatedTableType]);
  
  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    console.log('=== RELATED TABLE SUBMIT STARTED ===');
    console.log('Received data keys:', Object.keys(data));
    console.log('Received data sample:', Object.fromEntries(Object.entries(data).slice(0, 5)));
    console.log('Current rowData id:', rowData?.id);
    console.log('Config:', { 
      relatedTableName: config.relatedTableName, 
      relatedTableType: config.relatedTableType 
    });
    
    if (!rowData || !('id' in rowData) || typeof rowData.id !== 'string') {
      console.error('Invalid row data - missing id');
      toast.error('Invalid row data');
      return;
    }
    
      console.log('Setting saving to true');
    setSaving(true);
    
    try {
      // Remove table_id and id from updates (these shouldn't be changed)
      // But keep table_id in the data for validation - we just won't update it
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...dataToUpdate } = data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { table_id: _tableId, ...updates } = dataToUpdate;
      
      console.log('Updates after filtering:', {
        originalKeys: Object.keys(data),
        updateKeys: Object.keys(updates),
        updateCount: Object.keys(updates).length,
        sampleUpdates: Object.fromEntries(Object.entries(updates).slice(0, 5))
      });
      
      // Ensure we have valid updates
      if (Object.keys(updates).length === 0) {
        console.log('No updates to save');
        toast.info('No changes to save');
        setSaving(false);
        return;
      }
      
      // Use the cached correct table_id to avoid duplicate API calls
      let relatedTableIdForUpdate = correctTableIdRef.current || correctTableId;
      
      // If we don't have a cached value, use the one from state (should already be set)
      if (!relatedTableIdForUpdate || relatedTableIdForUpdate === relatedTableId) {
        relatedTableIdForUpdate = correctTableId;
        console.log('Using correctTableId from state:', relatedTableIdForUpdate);
      } else {
        console.log('Using cached table_id:', relatedTableIdForUpdate);
      }
      
      console.log('=== CALLING updateRelatedTableRow ===');
      console.log('Parameters:', {
        tableName: config.relatedTableName,
        rowId: rowData.id,
        tableId: relatedTableIdForUpdate,
        updateKeyCount: Object.keys(updates).length
      });
      
      console.log('=== CALLING updateRelatedTableRow NOW ===');
      const updated = await updateRelatedTableRow(
        config.relatedTableName,
        rowData.id as string,
        updates,
        relatedTableIdForUpdate
      );
      
      console.log('=== updateRelatedTableRow RESULT ===', { 
        updated: !!updated, 
        hasData: updated !== null,
        sampleData: updated ? Object.keys(updated).slice(0, 5) : null
      });
      
      if (updated) {
        console.log('=== ROW UPDATED SUCCESSFULLY ===');
        console.log('Updated data sample:', Object.fromEntries(Object.entries(updated).slice(0, 5)));
        toast.success('Row updated successfully');
        // Update local rowData with the updated data
        setRowData(updated as Record<string, unknown>);
        onSave?.(updated);
        
        // Close the modal after save completes
        console.log('Setting saving to false and closing modal');
        
        // IMPORTANT: Set saving to false FIRST, then close
        // Use a small delay to ensure the save operation is fully complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setSaving(false);
        
        // Now close the modal
        console.log('Closing modal after save');
        setInternalIsOpen(false);
        
        // Small delay before calling onClose to ensure Sheet state updates
        setTimeout(() => {
          console.log('Calling onClose');
          onClose();
        }, 150);
      } else {
        console.error('=== UPDATE FAILED ===');
        console.error('updateRelatedTableRow returned null');
        toast.error('Failed to update row. Please try again.');
        setSaving(false);
      }
    } catch (err) {
      console.error('=== EXCEPTION IN HANDLE SUBMIT ===');
      console.error('Error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update row');
      setSaving(false);
    }
  }, [rowData, config, relatedTableId, correctTableId, onSave, onClose]);
  
  // Get the specific form component for this table type
  const FormComponent = hasFormComponentForTableType(config.relatedTableType)
    ? getFormComponentForTableType(config.relatedTableType)
    : null;
  
  // Fallback: create columns from row data if no specific form component exists
  const columns = rowData && !FormComponent
    ? Object.keys(rowData)
        .filter(key => key !== 'id' && key !== 'table_id')
        .map(key => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: typeof rowData[key] === 'number' ? 'number' as const : 'text' as const,
        }))
    : [];
  
  // Note: handleSheetClose and handleFormOpenChange were removed as they were unused.
  // The Sheet's onOpenChange is handled inline to prevent closing during save operations.
  
  // Wrap the form's onCancel to ensure it only closes this modal
  const handleFormCancel = useCallback(() => {
    console.log('=== FORM CANCEL CALLED ===');
    console.log('Current saving state:', saving);
    if (!saving) {
      console.log('Closing modal via cancel');
      setInternalIsOpen(false);
      // Use a small delay to ensure state updates
      setTimeout(() => {
        console.log('Calling onClose from cancel');
        onClose();
      }, 100);
    } else {
      console.log('BLOCKING cancel - currently saving');
    }
  }, [onClose, saving]);

  return (
    <Sheet 
      open={internalIsOpen} 
      onOpenChange={(open) => {
        console.log('=== SHEET ROOT ONOPENCHANGE ===', { 
          open, 
          saving, 
          internalIsOpen,
          isOpen
        });
        
        if (!open) {
          // User is trying to close
          if (saving) {
            console.log('BLOCKING close - currently saving');
            // Force it to stay open while saving
            setInternalIsOpen(true);
            return;
          }
          
          // Allow closing if not saving
          console.log('Allowing close - not saving');
          setInternalIsOpen(false);
          setTimeout(() => {
            onClose();
          }, 50);
        } else if (open) {
          // Opening
          console.log('Sheet opening - setting internalIsOpen to true');
          setInternalIsOpen(true);
        }
      }}
      modal={true}
    >
      <SheetContent 
        side="right" 
        className="w-[100vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] bg-gray-900 border-gray-800 p-0 flex flex-col max-w-[95vw]"
        style={{ zIndex: 100 }}
        onPointerDownOutside={(e) => {
          console.log('=== ONPOINTERDOWNOUTSIDE ===');
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          console.log('=== ONINTERACTOUTSIDE ===');
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          console.log('=== ONESCAPEKEYDOWN ===');
          e.preventDefault();
        }}
      >
        <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <SheetTitle className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">
            Edit {config.relatedTableType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg m-6">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          
          {!loading && !error && rowData && (
            <>
              {FormComponent ? (
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                }>
                  <div 
                    ref={(div) => {
                      formWrapperRef.current = div;
                      
                      // Listen for manual submit events
                      if (div) {
                        // Wait a bit for form to be rendered (Suspense might delay it)
                        setTimeout(() => {
                          const form = div.querySelector('form');
                          if (form) {
                            console.log('=== SETTING UP EVENT LISTENER FOR related-table-submit ===');
                            const handleManualSubmit = ((e: CustomEvent) => {
                              console.log('=== MANUAL SUBMIT EVENT RECEIVED ===');
                              console.log('Form values keys:', Object.keys(e.detail || {}));
                              
                              // Call our handleSubmit directly
                              setSaving(true);
                              handleSubmit(e.detail).catch((err) => {
                                console.error('Error in manual submit:', err);
                                toast.error('Failed to save: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                setSaving(false);
                              });
                            }) as EventListener;
                            
                            form.addEventListener('related-table-submit', handleManualSubmit);
                            console.log('=== EVENT LISTENER ADDED ===');
                          } else {
                            console.log('=== FORM NOT FOUND IN REF CALLBACK ===');
                          }
                        }, 200);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('=== CLICK STOPPED PROPAGATION ===');
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      // Prevent escape key from closing the modal
                      if (e.key === 'Escape') {
                        e.stopPropagation();
                        console.log('=== ESCAPE KEY BLOCKED ===');
                      }
                    }}
                  >
                    <FormComponent
                      initialData={rowData as Record<string, unknown>}
                      onSubmit={async (data: Record<string, unknown>) => {
                        // Prevent any event propagation that might close parent modal
                        console.log('=== FORM COMPONENT SUBMIT CALLED ===');
                        console.log('Form data keys:', Object.keys(data));
                        console.log('Form data sample:', Object.fromEntries(Object.entries(data).slice(0, 5)));
                        console.log('Current saving state:', saving);
                        console.log('Current internalIsOpen state:', internalIsOpen);
                        
                        // IMPORTANT: This is the handler that should save to the RELATED table
                        // Not the parent table
                        // Set saving immediately to prevent Sheet from closing
                        console.log('Setting saving to true BEFORE handleSubmit');
                        setSaving(true);
                        
                        // Use a small delay to ensure state updates
                        await new Promise(resolve => setTimeout(resolve, 50));
                        
                        try {
                          console.log('About to call handleSubmit');
                          await handleSubmit(data);
                          console.log('handleSubmit completed');
                        } catch (err) {
                          console.error('=== ERROR IN FORM SUBMIT HANDLER ===', err);
                          toast.error('Failed to save: ' + (err instanceof Error ? err.message : 'Unknown error'));
                          setSaving(false);
                        }
                      }}
                      onCancel={() => {
                        console.log('=== FORM CANCEL BUTTON CLICKED ===');
                        // Always allow cancel (unless saving)
                        if (!saving) {
                          console.log('Cancelling form - closing modal');
                          handleFormCancel();
                        } else {
                          console.log('BLOCKING cancel - currently saving');
                        }
                      }}
                      mode="edit"
                      tableId={correctTableId}
                      open={true}
                      onOpenChange={(open: boolean) => {
                        console.log('=== ITEMFORM ONOPENCHANGE ===', { 
                          open, 
                          saving, 
                          internalIsOpen
                        });
                        // If ItemForm is trying to close (via Cancel button), allow it
                        if (!open) {
                          if (saving) {
                            console.log('ItemForm trying to close - BLOCKING (currently saving)');
                            return;
                          }
                          console.log('ItemForm trying to close - ALLOWING (Cancel button clicked)');
                          // Call our cancel handler
                          handleFormCancel();
                        } else if (open) {
                          // Opening - allow it
                          setInternalIsOpen(true);
                        }
                      }}
                    />
                  </div>
                </Suspense>
              ) : (
                <ModularForm
                  columns={columns}
                  initialData={rowData as Partial<{ table_id: string; [key: string]: string | number | boolean | null | undefined }>}
                  onSubmit={(data) => {
                    console.log('=== MODULAR FORM SUBMIT CALLED ===');
                    console.log('Form data:', data);
                    handleSubmit(data);
                  }}
                  onCancel={handleFormCancel}
                  mode="edit"
                  tableId={relatedTableId}
                  showFooter={true}
                  submitLabel="Save Changes"
                  cancelLabel="Cancel"
                />
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

