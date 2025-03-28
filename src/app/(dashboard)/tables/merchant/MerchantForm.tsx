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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

// Import the schema from the page file
import { merchantSchema } from './schema';

type MerchantFormData = z.infer<typeof merchantSchema>;

interface MerchantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: MerchantFormData;
  onSubmit: (data: MerchantFormData) => void;
}

export default function MerchantForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: MerchantFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: MerchantFormData) => {
    try {
      onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to submit form');
    }
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: 'text' | 'number' }> = {
    tblidx: { label: 'ID', type: 'number' },
    wsznametext: { label: 'Name', type: 'text' },
    bysell_type: { label: 'Sell Type', type: 'number' },
    tab_name: { label: 'Tab Name', type: 'text' },
    dwneedmileage: { label: 'Need Mileage', type: 'number' },
    aitem_tblidx_0: { label: 'Item ID', type: 'number' },
    aneeditemtblidx_0: { label: 'Required Item ID', type: 'number' },
    abyneeditemstack_0: { label: 'Required Item Stack', type: 'number' },
    adwneedzenny_0: { label: 'Required Zenny', type: 'number' },
    aitem_tblidx_1: { label: 'Item ID', type: 'number' },
    aneeditemtblidx_1: { label: 'Required Item ID', type: 'number' },
    abyneeditemstack_1: { label: 'Required Item Stack', type: 'number' },
    adwneedzenny_1: { label: 'Required Zenny', type: 'number' },
    aitem_tblidx_2: { label: 'Item ID', type: 'number' },
    aneeditemtblidx_2: { label: 'Required Item ID', type: 'number' },
    abyneeditemstack_2: { label: 'Required Item Stack', type: 'number' },
    adwneedzenny_2: { label: 'Required Zenny', type: 'number' },
    aitem_tblidx_3: { label: 'Item ID', type: 'number' },
    aneeditemtblidx_3: { label: 'Required Item ID', type: 'number' },
    abyneeditemstack_3: { label: 'Required Item Stack', type: 'number' },
    adwneedzenny_3: { label: 'Required Zenny', type: 'number' },
  };

  // Define tabs with their sections
  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      sections: [
        {
          label: 'Basic Information',
          fields: [
            'tblidx',
            'wsznametext',
            'bysell_type',
            'tab_name',
            'dwneedmileage'
          ]
        }
      ]
    },
    {
      id: 'items',
      label: 'Items',
      sections: [
        {
          label: 'Item Set 1',
          fields: [
            'aitem_tblidx_0',
            'aneeditemtblidx_0',
            'abyneeditemstack_0',
            'adwneedzenny_0'
          ]
        },
        {
          label: 'Item Set 2',
          fields: [
            'aitem_tblidx_1',
            'aneeditemtblidx_1',
            'abyneeditemstack_1',
            'adwneedzenny_1'
          ]
        },
        {
          label: 'Item Set 3',
          fields: [
            'aitem_tblidx_2',
            'aneeditemtblidx_2',
            'abyneeditemstack_2',
            'adwneedzenny_2'
          ]
        },
        {
          label: 'Item Set 4',
          fields: [
            'aitem_tblidx_3',
            'aneeditemtblidx_3',
            'abyneeditemstack_3',
            'adwneedzenny_3'
          ]
        }
      ]
    }
  ];

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig];
    if (!config) return null;

    return (
      <FormField
        key={field}
        control={form.control}
        name={field as keyof MerchantFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                {...formField}
                name={String(formField.name)}
                value={formField.value || ''}
                type={config.type}
                className="h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // Function to render a section
  const renderSection = (section: { label: string; fields: string[] }) => {
    return (
      <div key={section.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {section.label}
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {section.fields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-20">
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
                  {tab.sections && (
                    <div className="space-y-6">
                      {tab.sections.map((section) => renderSection(section))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
      
      <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex gap-4 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white dark:text-white hover:from-purple-700 hover:to-indigo-700"
          >
            {mode === 'add' ? 'Add Merchant' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
} 