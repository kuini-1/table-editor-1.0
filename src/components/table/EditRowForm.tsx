import React from 'react';
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
import { RotateCcw } from "lucide-react";
import { RelatedTableEditButton } from "./RelatedTableEditButton";
import { getRelatedTableConfig } from "@/lib/relatedTableConfig";

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number';
  validation?: z.ZodTypeAny;
}

interface BaseFormData {
  table_id: string;
  [key: string]: string | number;
}

interface EditRowFormProps<T extends BaseFormData> {
  columns: Column[];
  initialData: T;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  tableId: string;
  tableType?: string; // Optional: table type for related table configuration
}

export function EditRowForm<T extends BaseFormData>({
  columns,
  initialData,
  onSubmit,
  onCancel,
  tableId,
  tableType,
}: EditRowFormProps<T>) {
  // Create a dynamic schema based on columns
  const schemaObject: { [key: string]: z.ZodTypeAny } = {
    table_id: z.string().uuid(),
  };

  columns.forEach(column => {
    if (column.validation) {
      schemaObject[column.key] = column.validation;
    } else if (column.type === 'number') {
      schemaObject[column.key] = z.coerce.number().min(0, 'Must be a positive number');
    } else {
      schemaObject[column.key] = z.string();
    }
  });

  const schema = z.object(schemaObject);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...initialData,
    },
    shouldUnregister: false,
  });

  // Store original values for reset functionality
  const originalValuesRef = React.useRef<Partial<FormData>>(initialData || {});

  // Normalize value for comparison (treat null, undefined, and empty string as equivalent)
  const normalizeValueForComparison = (value: unknown): string | number | null => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return value as string | number;
  };

  const handleSubmit = (data: FormData) => {
    onSubmit(data as T);
    // Update original values after successful submit
    originalValuesRef.current = { ...data };
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 h-full flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-1 bg-blue-500 rounded-full" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit Row
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 pl-10">
            Update the values below to modify this row.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto -mx-6">
          <FormField
            control={form.control}
            name="table_id"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          <ScrollArea className="h-[calc(100vh-12rem)] px-6">
            <div className="grid grid-cols-2 gap-4">
              {columns.map(column => (
                <FormField
                  key={column.key}
                  control={form.control}
                  name={column.key}
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="absolute -top-2 left-3 px-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900">
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
                            placeholder={`Enter ${column.label.toLowerCase()}`}
                                  className={`h-11 pt-2 bg-transparent border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all duration-200 ${rightPadding}`}
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
                      <FormMessage className="text-xs absolute -bottom-5" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-900/50"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
} 