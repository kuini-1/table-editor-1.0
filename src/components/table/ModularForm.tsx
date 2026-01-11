import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useRef, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { RelatedTableEditButton } from "./RelatedTableEditButton";
import { getRelatedTableConfig } from "@/lib/relatedTableConfig";

export type FormMode = 'add' | 'edit' | 'duplicate';

// Update the Column interface to include the 'boolean' type
export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
  validation?: z.ZodTypeAny;
}

interface BaseFormData {
  table_id?: string | null | undefined;
  [key: string]: string | number | boolean | null | undefined;
}

export interface FormSection {
  id: string;
  title: string;
  description: string;
  columns: string[];
}

export interface FormTab {
  id: string;
  label: string;
  sections: FormSection[];
}

export interface QuickViewSection {
  title: string;
  columns: string[];
}

interface ModularFormProps<T extends BaseFormData> {
  columns: Column[];
  sections?: FormSection[];
  tabs?: FormTab[];
  quickViewSections?: QuickViewSection[];
  quickStats?: Array<{ label: string; column: string; color?: string; formatValue?: (value: unknown) => string }>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
  tableType?: string; // Optional: table type for related table configuration
  title?: string;
  description?: string;
  showFooter?: boolean;
  submitLabel?: string | ((mode: FormMode) => string);
  cancelLabel?: string;
  customSchema?: z.ZodType<T, z.ZodTypeDef, unknown>;
  defaultTab?: string;
  compactFieldHeight?: boolean;
  enableQuickView?: boolean;
}

export function ModularForm<T extends BaseFormData>({
  columns,
  sections,
  tabs,
  quickViewSections,
  quickStats, // Keep for backward compatibility but not used
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
  tableType,
  showFooter = true,
  submitLabel,
  cancelLabel = 'Cancel',
  customSchema,
  defaultTab,
  compactFieldHeight = false,
  enableQuickView = true,
}: ModularFormProps<T>) {
  // Suppress unused variable warning for quickStats (kept for backward compatibility)
  void quickStats;
  // Use custom schema if provided, otherwise create dynamic schema
  const schema = customSchema || (() => {
    const schemaObject: { [key: string]: z.ZodTypeAny } = {
      table_id: z.string().uuid(),
    };

    columns.forEach(column => {
      if (column.type === 'number') {
        schemaObject[column.key] = z.coerce.number().min(0, 'Must be a positive number').nullable().optional();
      } else if (column.type === 'boolean') {
        schemaObject[column.key] = z.boolean().default(false).nullable().optional();
      } else {
        // Allow null, undefined, or string - transform null/undefined to empty string for validation
        schemaObject[column.key] = z.preprocess(
          (val) => val === null || val === undefined ? '' : val,
          z.string()
        ).nullable().optional();
      }
    });

    return z.object(schemaObject);
  })();
  
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      table_id: tableId,
      ...(initialData || {}),
    },
    shouldUnregister: false,
  });

  // Store original values for reset functionality
  const originalValuesRef = useRef<Partial<FormData>>(initialData || {});

  // Log form errors for debugging
  useEffect(() => {
    const subscription = form.watch((value, { type }) => {
      if (type === 'change') {
        const errors = form.formState.errors;
        if (Object.keys(errors).length > 0) {
          console.log('=== FORM ERRORS ===', errors);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Normalize value for comparison (treat null, undefined, and empty string as equivalent)
  const normalizeValueForComparison = (value: unknown): string | number | null => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return value as string | number;
  };

  const handleSubmit = (data: FormData) => {
    console.log('=== ModularForm handleSubmit called ===', { 
      dataKeys: Object.keys(data),
      mode,
      tableId 
    });
    try {
      onSubmit(data as T);
      // Update original values after successful submit
      originalValuesRef.current = { ...data };
      console.log('=== ModularForm onSubmit completed successfully ===');
    } catch (error) {
      console.error('=== ModularForm onSubmit error ===', error);
      throw error;
    }
  };

  // Render field in compact mode for quick view
  const renderFieldCompact = (column: Column) => {
    if (column.type === 'boolean') {
      return (
        <FormField
          key={column.key}
          control={form.control}
          name={column.key}
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {column.label}
              </FormLabel>
              <div className="flex items-center h-10 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    className="h-4 w-4 rounded-md border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                </FormControl>
                <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                  {field.value ? 'Yes' : 'No'}
                </span>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={column.key}
        control={form.control}
        name={column.key}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {column.label}
            </FormLabel>
            <FormControl>
              <div className="relative group">
                {(() => {
                  // Check if this field has a related table configuration
                  const relatedTableConfig = tableType ? getRelatedTableConfig(tableType, column.key) : undefined;
                  const hasRelatedTable = !!relatedTableConfig;
                  const hasValue = field.value !== null && field.value !== undefined && field.value !== '';
                  
                  // Check if reset button should be shown
                  const originalValue = originalValuesRef.current[column.key as keyof FormData];
                  const currentValue = field.value;
                  const hasChanged = normalizeValueForComparison(originalValue) !== normalizeValueForComparison(currentValue);
                  const showResetButton = hasChanged;
                  
                  // Calculate padding based on which buttons are actually visible
                  let rightPadding = 'pr-8'; // Default padding
                  if (hasRelatedTable && hasValue && showResetButton) {
                    rightPadding = 'pr-20'; // Both buttons visible
                  } else if (hasRelatedTable && hasValue) {
                    rightPadding = 'pr-10'; // Only related table button
                  } else if (showResetButton) {
                    rightPadding = 'pr-10'; // Only reset button
                  }
                  
                  return (
                    <>
                <Input 
                  type={column.type === 'number' ? 'number' : 'text'} 
                  name={field.name}
                  value={String(field.value ?? '')}
                  onChange={(e) => {
                    if (column.type === 'number') {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      form.setValue(column.key as Path<FormData>, value as FormData[Path<FormData>], {
                        shouldDirty: true,
                        shouldValidate: false,
                        shouldTouch: true,
                      });
                    } else {
                      const value = e.target.value;
                      form.setValue(column.key as Path<FormData>, value as FormData[Path<FormData>], {
                        shouldDirty: true,
                        shouldValidate: false,
                        shouldTouch: true,
                      });
                    }
                  }}
                        className={`h-10 text-sm px-3 ${rightPadding} bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 transition-all duration-200`}
                />
                      
                      {/* Related table edit button */}
                      {hasRelatedTable && hasValue && relatedTableConfig && (
                        <RelatedTableEditButton
                          config={relatedTableConfig}
                          value={field.value as string | number}
                          relatedTableId={tableId}
                        />
                      )}
                      
                      {/* Reset button */}
                      {showResetButton && (
                        <button
                          type="button"
                          onClick={() => {
                            form.setValue(column.key as Path<FormData>, originalValue as FormData[Path<FormData>], {
                              shouldDirty: true,
                              shouldValidate: false,
                              shouldTouch: true,
                            });
                          }}
                          className={`absolute ${hasRelatedTable && hasValue ? 'right-10' : 'right-2'} top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                          title="Reset to original value"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    );
  };

  const renderField = (column: Column) => {
    const heightClass = compactFieldHeight ? 'h-10 text-sm' : 'h-12';
    const labelClass = compactFieldHeight ? 'text-xs' : 'text-sm';
    
    if (column.type === 'boolean') {
      return (
        <FormField
          key={column.key}
          control={form.control}
          name={column.key}
          render={({ field }) => (
            <FormItem className={compactFieldHeight ? 'space-y-1' : 'space-y-2'}>
              <FormLabel className={`${labelClass} font-medium text-gray-700 dark:text-gray-300`}>
                {column.label}
              </FormLabel>
              <div className={`flex items-center ${heightClass} px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200`}>
                <FormControl>
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    className={`${compactFieldHeight ? 'h-4 w-4' : 'h-5 w-5'} rounded-md border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500`}
                  />
                </FormControl>
                <span className={`ml-2 ${labelClass} text-gray-700 dark:text-gray-300`}>
                  {field.value ? 'Yes' : 'No'}
                </span>
              </div>
              <FormMessage className={compactFieldHeight ? 'text-xs' : ''} />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={column.key}
        control={form.control}
        name={column.key}
        render={({ field }) => (
          <FormItem className={compactFieldHeight ? 'space-y-1' : 'space-y-2'}>
            <FormLabel className={`${labelClass} font-medium text-gray-700 dark:text-gray-300`}>
              {column.label}
            </FormLabel>
            <FormControl>
              <div className="relative group">
                {(() => {
                  // Check if this field has a related table configuration
                  const relatedTableConfig = tableType ? getRelatedTableConfig(tableType, column.key) : undefined;
                  const hasRelatedTable = !!relatedTableConfig;
                  const hasValue = field.value !== null && field.value !== undefined && field.value !== '';
                  
                  // Check if reset button should be shown
                  const originalValue = originalValuesRef.current[column.key as keyof FormData];
                  const currentValue = field.value;
                  const hasChanged = normalizeValueForComparison(originalValue) !== normalizeValueForComparison(currentValue);
                  const showResetButton = hasChanged;
                  
                  // Calculate padding based on which buttons are actually visible
                  let rightPadding = 'pr-8'; // Default padding
                  if (hasRelatedTable && hasValue && showResetButton) {
                    rightPadding = 'pr-20'; // Both buttons visible
                  } else if (hasRelatedTable && hasValue) {
                    rightPadding = 'pr-10'; // Only related table button
                  } else if (showResetButton) {
                    rightPadding = 'pr-10'; // Only reset button
                  }
                  
                  return (
                    <>
                <Input 
                  type={column.type === 'number' ? 'number' : 'text'} 
                  name={field.name}
                  value={String(field.value ?? '')}
                  onChange={(e) => {
                    if (column.type === 'number') {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      form.setValue(column.key as Path<FormData>, value as FormData[Path<FormData>], {
                        shouldDirty: true,
                        shouldValidate: false,
                        shouldTouch: true,
                      });
                    } else {
                      const value = e.target.value;
                      form.setValue(column.key as Path<FormData>, value as FormData[Path<FormData>], {
                        shouldDirty: true,
                        shouldValidate: false,
                        shouldTouch: true,
                      });
                    }
                  }}
                        className={`${heightClass} px-3 ${rightPadding} bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 transition-all duration-200`}
                />
                      
                      {/* Related table edit button */}
                      {hasRelatedTable && hasValue && relatedTableConfig && (
                        <RelatedTableEditButton
                          config={relatedTableConfig}
                          value={field.value as string | number}
                          relatedTableId={tableId}
                        />
                      )}
                      
                      {/* Reset button */}
                      {showResetButton && (
                        <button
                          type="button"
                          onClick={() => {
                            form.setValue(column.key as Path<FormData>, originalValue as FormData[Path<FormData>], {
                              shouldDirty: true,
                              shouldValidate: false,
                              shouldTouch: true,
                            });
                          }}
                          className={`absolute ${hasRelatedTable && hasValue ? 'right-10' : 'right-2'} top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                          title="Reset to original value"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </FormControl>
            <FormMessage className={compactFieldHeight ? 'text-xs' : ''} />
          </FormItem>
        )}
      />
    );
  };

  const renderSections = (sectionsToRender: FormSection[]) => (
    sectionsToRender.map(section => (
      <Card key={section.id} className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
          {section.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {columns
              .filter(col => section.columns.includes(col.key))
              .map(renderField)}
          </div>
        </CardContent>
      </Card>
    ))
  );

  // Filter tabs to only include those with at least one section that has valid columns
  const filteredTabs = useMemo(() => {
    if (!tabs) return undefined;
    
    const validColumnKeys = new Set(columns.map(col => col.key));
    
    return tabs
      .map(tab => {
        // Filter sections to only include those with at least one valid column
        const validSections = tab.sections.filter(section => 
          section.columns.some(colKey => validColumnKeys.has(colKey))
        );
        
        // Only include tab if it has at least one valid section
        if (validSections.length === 0) return null;
        
        return {
          ...tab,
          sections: validSections
        };
      })
      .filter((tab): tab is FormTab => tab !== null);
  }, [tabs, columns]);

  // Auto-generate quick view sections from first section if not provided
  const autoQuickViewSections = useMemo(() => {
    if (quickViewSections && quickViewSections.length > 0) return quickViewSections;
    
    // If sections exist, use the first section for quick view
    if (sections && sections.length > 0 && sections[0].columns.length > 0) {
      return [{
        title: sections[0].title || 'Quick View',
        columns: sections[0].columns.slice(0, Math.min(8, sections[0].columns.length)) // Limit to 8 fields
      }];
    }
    
    // If tabs exist, use the first tab's first section
    if (filteredTabs && filteredTabs.length > 0) {
      const firstTab = filteredTabs[0];
      if (firstTab.sections && firstTab.sections.length > 0 && firstTab.sections[0].columns.length > 0) {
        const firstSection = firstTab.sections[0];
        return [{
          title: firstSection.title || 'Quick View',
          columns: firstSection.columns.slice(0, Math.min(8, firstSection.columns.length))
        }];
      }
    }
    
    // If no sections/tabs but columns exist, use first 8 columns
    if (columns && columns.length > 0) {
      return [{
        title: 'Quick View',
        columns: columns.slice(0, Math.min(8, columns.length)).map(col => col.key)
      }];
    }
    
    return [];
  }, [quickViewSections, sections, filteredTabs, columns]);

  // Get all columns that are in quick view sections to exclude them from tabs
  const quickViewColumnKeys = useMemo(() => {
    const keys = new Set<string>();
    autoQuickViewSections.forEach(section => {
      section.columns.forEach(colKey => keys.add(colKey));
    });
    return keys;
  }, [autoQuickViewSections]);

  // Filter tabs again to exclude columns that are in quick view
  const finalFilteredTabs = useMemo(() => {
    if (!filteredTabs || quickViewColumnKeys.size === 0) return filteredTabs;
    
    return filteredTabs
      .map(tab => {
        // Filter sections to exclude columns that are in quick view
        const filteredSections = tab.sections
          .map(section => {
            // Filter out columns that are in quick view
            const filteredColumns = section.columns.filter(
              colKey => !quickViewColumnKeys.has(colKey)
            );
            
            // Only include section if it has at least one column after filtering
            if (filteredColumns.length === 0) return null;
            
            return {
              ...section,
              columns: filteredColumns
            };
          })
          .filter((section): section is FormSection => section !== null);
        
        // Only include tab if it has at least one valid section
        if (filteredSections.length === 0) return null;
        
        return {
          ...tab,
          sections: filteredSections
        };
      })
      .filter((tab): tab is FormTab => tab !== null);
  }, [filteredTabs, quickViewColumnKeys]);

  // Always show quick view if enabled and we have sections
  const hasQuickView = enableQuickView && autoQuickViewSections.length > 0;

  // Ref for scroll area to reset scroll on tab change
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null);
  const initialTabValue = defaultTab && finalFilteredTabs?.some(t => t.id === defaultTab) 
    ? defaultTab 
    : finalFilteredTabs?.[0]?.id || '';
  const [activeTabValue, setActiveTabValue] = useState<string>(initialTabValue);

  // Update active tab when finalFilteredTabs changes (e.g., on initial load)
  useEffect(() => {
    if (finalFilteredTabs && finalFilteredTabs.length > 0) {
      const validTab = defaultTab && finalFilteredTabs.some(t => t.id === defaultTab)
        ? defaultTab
        : finalFilteredTabs[0].id;
      setActiveTabValue(prev => prev !== validTab ? validTab : prev);
    }
  }, [finalFilteredTabs, defaultTab]);

  // Reset scroll when tab changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }
  }, [activeTabValue]);

  return (
    <Form {...form}>
      <form 
        onSubmit={(e) => {
          console.log('=== FORM ONSUBMIT EVENT FIRED ===', { mode, tableId });
          console.log('=== FORM STATE BEFORE SUBMIT ===', {
            isValid: form.formState.isValid,
            errors: form.formState.errors,
            values: form.getValues()
          });
          
          // Use react-hook-form's handleSubmit with error callback
          form.handleSubmit(
            handleSubmit,
            (errors) => {
              console.error('=== REACT-HOOK-FORM VALIDATION FAILED ===', errors);
              console.error('=== FORM ERRORS DETAILS ===', form.formState.errors);
            }
          )(e);
        }} 
        className="flex flex-col h-full"
      >
        <FormField
          control={form.control}
          name="table_id"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />

        {/* Main Content Area - Two Column Layout if quickViewSections exist */}
        <div className="flex-1 min-h-0 overflow-hidden flex">
          {/* Left Column - Quick View Panel */}
          {hasQuickView && (
            <div className="w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick View</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Frequently used fields</p>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 space-y-4">
                  {autoQuickViewSections.map((section, idx) => {
                    const sectionColumns = columns.filter(col => section.columns.includes(col.key));
                    return (
                      <Card key={idx} className="border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {sectionColumns.map(col => renderFieldCompact(col))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Right Column - Detailed Editing with Tabs or Sections */}
          <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${hasQuickView ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-900'}`}>
            {finalFilteredTabs && finalFilteredTabs.length > 0 ? (
              <Tabs 
                value={activeTabValue} 
                onValueChange={setActiveTabValue}
                className="flex flex-col flex-1 min-h-0 overflow-hidden"
              >
                {/* Sticky tabs list */}
                <div className={`sticky top-0 z-10 px-6 pt-3 pb-2 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 ${hasQuickView ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-900'}`}>
                  <TabsList className={`w-full bg-gray-100 dark:bg-gray-800 p-1 h-auto ${finalFilteredTabs.length <= 3 ? 'grid grid-cols-3' : finalFilteredTabs.length <= 5 ? 'grid grid-cols-5' : 'grid grid-cols-6'}`}>
                    {finalFilteredTabs.map(tab => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 py-2 text-sm"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Scrollable tab content */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
                  <div className="px-6 py-4">
                    {finalFilteredTabs.map(tab => (
                      <TabsContent key={tab.id} value={tab.id} className="space-y-4 mt-0">
                        {renderSections(tab.sections)}
                      </TabsContent>
                    ))}
                  </div>
                </ScrollArea>
              </Tabs>
            ) : (
              <ScrollArea className="flex-1 min-h-0">
                <div className="px-6 py-4">
                  {/* Render sections if they exist */}
                  {sections && (
                    <div className="space-y-4">
                      {renderSections(sections)}
                    </div>
                  )}

                  {/* Fallback to simple grid if no sections */}
                  {!sections && (
                    <Card className="border-gray-200 dark:border-gray-700">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          {columns.map(renderField)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {showFooter && (
          <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-sm">
            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white"
                onClick={(e) => {
                  console.log('=== SUBMIT BUTTON CLICKED ===', { mode, tableId });
                  // Check form validity
                  const formElement = e.currentTarget.closest('form');
                  if (formElement) {
                    const isValid = formElement.checkValidity();
                    console.log('=== FORM VALIDITY CHECK ===', { isValid });
                    if (!isValid) {
                      console.error('=== FORM VALIDATION FAILED ===');
                      formElement.reportValidity();
                    } else {
                      console.log('=== FORM IS VALID, PROCEEDING WITH SUBMISSION ===');
                    }
                  }
                }}
              >
                {submitLabel 
                  ? (typeof submitLabel === 'function' ? submitLabel(mode) : submitLabel)
                  : (mode === 'add' ? 'Add Entry' : mode === 'edit' ? 'Save Changes' : 'Duplicate Entry')
                }
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
} 