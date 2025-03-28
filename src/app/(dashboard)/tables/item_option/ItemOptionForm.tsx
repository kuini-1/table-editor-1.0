'use client';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import the schema from the page file
import { itemOptionSchema } from './schema';

type ItemOptionFormData = z.infer<typeof itemOptionSchema>;

interface ItemOptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: ItemOptionFormData;
  onSubmit: (data: ItemOptionFormData) => void;
}

export function ItemOptionForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: ItemOptionFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<ItemOptionFormData>({
    resolver: zodResolver(itemOptionSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: ItemOptionFormData) => {
    onSubmit(data);
  };

  // Define field labels and types
  const fieldConfig = {
    tblidx: { label: 'ID', type: 'number' as const },
    wszoption_name: { label: 'Option Name', type: 'text' as const },
    bvalidity_able: { label: 'Validity', type: 'number' as const },
    byoption_rank: { label: 'Option Rank', type: 'number' as const },
    byitem_group: { label: 'Item Group', type: 'number' as const },
    bymaxquality: { label: 'Max Quality', type: 'number' as const },
    byquality: { label: 'Quality', type: 'number' as const },
    byqualityindex: { label: 'Quality Index', type: 'number' as const },
    dwcost: { label: 'Cost', type: 'number' as const },
    bylevel: { label: 'Level', type: 'number' as const },
    activeeffect: { label: 'Active Effect', type: 'number' as const },
    factiverate: { label: 'Active Rate', type: 'number' as const },
    sznote: { label: 'Note', type: 'text' as const },
    system_effect_0: { label: 'System Effect', type: 'text' as const },
    bappliedinpercent_0: { label: 'Applied in Percent', type: 'boolean' as const },
    nvalue_0: { label: 'Value', type: 'number' as const },
    byscouterinfo_0: { label: 'Scouter Info', type: 'number' as const },
    system_effect_1: { label: 'System Effect', type: 'text' as const },
    bappliedinpercent_1: { label: 'Applied in Percent', type: 'boolean' as const },
    nvalue_1: { label: 'Value', type: 'number' as const },
    byscouterinfo_1: { label: 'Scouter Info', type: 'number' as const },
    system_effect_2: { label: 'System Effect', type: 'text' as const },
    bappliedinpercent_2: { label: 'Applied in Percent', type: 'boolean' as const },
    nvalue_2: { label: 'Value', type: 'number' as const },
    byscouterinfo_2: { label: 'Scouter Info', type: 'number' as const },
    system_effect_3: { label: 'System Effect', type: 'text' as const },
    bappliedinpercent_3: { label: 'Applied in Percent', type: 'boolean' as const },
    nvalue_3: { label: 'Value', type: 'number' as const },
    byscouterinfo_3: { label: 'Scouter Info', type: 'number' as const },
  };

  // Define tabs with their sections
  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      fields: [
        'tblidx',
        'wszoption_name',
        'bvalidity_able',
        'byoption_rank',
        'byitem_group',
        'bymaxquality',
        'byquality',
        'byqualityindex',
        'dwcost',
        'bylevel',
        'activeeffect',
        'factiverate',
        'sznote'
      ]
    },
    {
      id: 'effects',
      label: 'System Effects',
      effectSets: [
        {
          label: 'Effect 1',
          fields: ['system_effect_0', 'bappliedinpercent_0', 'nvalue_0', 'byscouterinfo_0']
        },
        {
          label: 'Effect 2',
          fields: ['system_effect_1', 'bappliedinpercent_1', 'nvalue_1', 'byscouterinfo_1']
        },
        {
          label: 'Effect 3',
          fields: ['system_effect_2', 'bappliedinpercent_2', 'nvalue_2', 'byscouterinfo_2']
        },
        {
          label: 'Effect 4',
          fields: ['system_effect_3', 'bappliedinpercent_3', 'nvalue_3', 'byscouterinfo_3']
        }
      ]
    }
  ];

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig];
    if (!config) return null;

    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field as keyof ItemOptionFormData}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {config.label}
              </FormLabel>
              <div className="flex items-center h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={!!formField.value}
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
        name={field as keyof ItemOptionFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                type={config.type === 'number' ? 'number' : 'text'}
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

  // Function to render an effect set
  const renderEffectSet = (effectSet: { label: string; fields: string[] }) => {
    return (
      <div key={effectSet.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {effectSet.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {effectSet.fields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                  {tab.effectSets ? (
                    tab.effectSets.map((effectSet) => renderEffectSet(effectSet))
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {tab.fields.map((field) => renderField(field))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 