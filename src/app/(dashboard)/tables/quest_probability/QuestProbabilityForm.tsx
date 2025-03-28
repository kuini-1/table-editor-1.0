'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { questProbabilitySchema, type QuestProbabilityFormData } from './schema';

interface QuestProbabilityFormProps {
  initialData?: QuestProbabilityFormData;
  onSubmit: (data: QuestProbabilityFormData) => void;
  onCancel: () => void;
  mode: 'add' | 'edit' | 'duplicate';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestProbabilityForm({
  initialData,
  onSubmit,
  mode,
}: QuestProbabilityFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<QuestProbabilityFormData>({
    resolver: zodResolver(questProbabilitySchema),
    defaultValues: initialData || {},
  });

  // Define field configurations
  const basicFields = {
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { key: 'tblidx', label: 'TBLIDX', type: 'number' },
          { key: 'wszname', label: 'Name', type: 'text' },
          { key: 'wsznote', label: 'Note', type: 'text' },
        ],
      },
      {
        title: 'Settings',
        fields: [
          { key: 'eusetype', label: 'Use Type', type: 'number' },
          { key: 'byprobabilitytype', label: 'Probability Type', type: 'number' },
          { key: 'ballowblank', label: 'Allow Blank', type: 'boolean' },
          { key: 'bycount', label: 'Count', type: 'number' },
        ],
      },
    ],
  };

  // Create probability sections (one section per probability set)
  const probabilityFields = {
    sections: Array.from({ length: 50 }, (_, index) => ({
      title: `Probability Set ${index}`,
      fields: [
        { key: `bytype_probability_${index}`, label: 'Type', type: 'number' },
        { key: `tblidx_probability_${index}`, label: 'TBLIDX', type: 'number' },
        { key: `dwminvalue_probability_${index}`, label: 'Min Value', type: 'number' },
        { key: `dwmaxvalue_probability_${index}`, label: 'Max Value', type: 'number' },
        { key: `dwrate_probability_${index}`, label: 'Rate', type: 'number' },
      ],
    })),
  };

  const renderField = (field: { key: string; label: string; type: string }) => {
    if (field.type === 'boolean') {
      return (
        <FormField
          key={field.key}
          control={form.control}
          name={field.key as keyof QuestProbabilityFormData}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </FormLabel>
              <div className="flex items-center h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={formField.value as boolean}
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
        key={field.key}
        control={form.control}
        name={field.key as keyof QuestProbabilityFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </FormLabel>
            <FormControl>
              <Input
                type={field.type}
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

  const renderSection = (section: { title: string; fields: any[] }) => {
    return (
      <div key={section.title} className="w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {section.title}
        </h3>
        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => renderField(field))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="probability">Probability</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {basicFields.sections.map(renderSection)}
              </TabsContent>

              <TabsContent value="probability" className="space-y-6">
                {probabilityFields.sections.map(renderSection)}
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 