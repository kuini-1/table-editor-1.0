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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FormMode } from '@/components/table/ModularForm';
import { itemEnchantSchema, type ItemEnchantFormData } from './schema';

interface ItemEnchantFormProps {
  initialData?: ItemEnchantFormData;
  onSubmit: (data: ItemEnchantFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemEnchantForm({
  initialData,
  onSubmit,
}: ItemEnchantFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ItemEnchantFormData>({
    resolver: zodResolver(itemEnchantSchema),
    defaultValues: initialData || {
      id: '',
      table_id: null,
      created_at: null,
      updated_at: null,
      tblidx: null,
      wszname: null,
      setblidx: null,
      bsetype: null,
      byrvtype: null,
      byexclidx: null,
      byminlevel: null,
      bymaxlevel: null,
      byfrequency: null,
      wenchant_value: null,
      bykind: null,
      dwequip: null,
      bygroupno: null,
      wmaxvalue: null,
      bissuperior: null,
      bisexcellent: null,
      bisrare: null,
      bislegendary: null,
    },
  });

  const fieldConfig = {
    // Basic Info
    tblidx: { label: 'TBLIDX', type: 'number' as const },
    wszname: { label: 'Name', type: 'text' as const },
    setblidx: { label: 'Set Table IDX', type: 'number' as const },
    bsetype: { label: 'Set Type', type: 'boolean' as const },
    
    // Level and Type Settings
    byrvtype: { label: 'RV Type', type: 'number' as const },
    byexclidx: { label: 'Exclusive IDX', type: 'number' as const },
    byminlevel: { label: 'Min Level', type: 'number' as const },
    bymaxlevel: { label: 'Max Level', type: 'number' as const },
    
    // Enchant Settings
    byfrequency: { label: 'Frequency', type: 'number' as const },
    wenchant_value: { label: 'Enchant Value', type: 'number' as const },
    bykind: { label: 'Kind', type: 'number' as const },
    dwequip: { label: 'Equipment', type: 'number' as const },
    bygroupno: { label: 'Group No', type: 'number' as const },
    wmaxvalue: { label: 'Max Value', type: 'number' as const },
    
    // Item Flags
    bissuperior: { label: 'Is Superior', type: 'boolean' as const },
    bisexcellent: { label: 'Is Excellent', type: 'boolean' as const },
    bisrare: { label: 'Is Rare', type: 'boolean' as const },
    bislegendary: { label: 'Is Legendary', type: 'boolean' as const },
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
          fields: ["tblidx", "wszname", "setblidx", "bsetype"]
        }
      ]
    },
    {
      id: "level",
      label: "Level & Type",
      sections: [
        {
          label: "Level Range",
          fields: ["byminlevel", "bymaxlevel"]
        },
        {
          label: "Type Settings",
          fields: ["byrvtype", "byexclidx"]
        }
      ]
    },
    {
      id: "enchant",
      label: "Enchant",
      sections: [
        {
          label: "Enchant Settings",
          fields: ["byfrequency", "wenchant_value", "bykind", "dwequip", "bygroupno", "wmaxvalue"]
        }
      ]
    },
    {
      id: "flags",
      label: "Flags",
      sections: [
        {
          label: "Item Flags",
          fields: ["bissuperior", "bisexcellent", "bisrare", "bislegendary"]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
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
                  {tab.sections?.map((section) => (
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