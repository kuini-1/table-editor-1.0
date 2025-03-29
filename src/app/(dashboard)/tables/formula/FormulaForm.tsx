'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FormMode } from '@/components/table/ModularForm';
import { newFormulaSchema, type FormulaFormData, type FormulaRow } from './schema';

interface FormulaFormProps {
  initialData?: FormulaRow | null;
  onSubmit: (data: FormulaFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormulaForm({
  initialData,
  onSubmit,
}: FormulaFormProps) {
  const form = useForm<FormulaFormData>({
    resolver: zodResolver(newFormulaSchema),
    defaultValues: initialData || {
      id: undefined,
      table_id: null,
      created_at: null,
      updated_at: null,
      tblidx: null,
      bvalidity_able: null,
      afrate_0: null,
      afrate_1: null,
      afrate_2: null,
      afrate_3: null,
    },
  });

  const fieldConfig = {
    tblidx: { label: 'TBLIDX', type: 'number' as const },
    bvalidity_able: { label: 'Valid', type: 'boolean' as const },
    afrate_0: { label: 'Rate 0', type: 'number' as const },
    afrate_1: { label: 'Rate 1', type: 'number' as const },
    afrate_2: { label: 'Rate 2', type: 'number' as const },
    afrate_3: { label: 'Rate 3', type: 'number' as const },
  };

  const renderField = (field: keyof typeof fieldConfig) => {
    const config = fieldConfig[field];
    
    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {config.label}
              </FormLabel>
              <div className="flex items-center h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={Boolean(formField.value)}
                    onCheckedChange={formField.onChange}
                    className="h-5 w-5 rounded-md border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                </FormControl>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {formField.value ? 'Yes' : 'No'}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={field}
        control={form.control}
        name={field}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                type={config.type}
                name={formField.name}
                value={String(formField.value ?? '')}
                onChange={formField.onChange}
                className="h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      sections: [
        {
          label: "Basic Information",
          fields: ["tblidx", "bvalidity_able"]
        }
      ]
    },
    {
      id: "rates",
      label: "Rates",
      sections: [
        {
          label: "Rate Settings",
          fields: ["afrate_0", "afrate_1", "afrate_2", "afrate_3"]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-2 mb-4">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {tab.sections.map((section) => (
                    <div key={section.label} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {section.label}
                      </h3>
                      <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                          {section.fields.map((field) => renderField(field as keyof typeof fieldConfig))}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 