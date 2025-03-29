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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FormMode } from '@/components/table/ModularForm';
import { itemGroupListSchema, type ItemGroupListFormData } from './schema';

interface ItemGroupListFormProps {
  initialData?: ItemGroupListFormData;
  onSubmit: (data: ItemGroupListFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemGroupListForm({
  initialData,
  onSubmit,
}: ItemGroupListFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ItemGroupListFormData>({
    resolver: zodResolver(itemGroupListSchema),
    defaultValues: initialData || {
      tblidx: null,
      wszname: null,
      bylevel: null,
      bytry_count: null,
      mob_index: null,
      dwmob_type: null,
      dwworld_rule_type: null,
      dwinterval: null,
      dwsuperior: null,
      dwexcellent: null,
      dwrare: null,
      dwlegendary: null,
      dwno_drop: null,
      dwzenny: null,
      dwitembagcount: null,
      dwtotalprob: null,
      ...Object.fromEntries([...Array(20)].flatMap((_, i) => [
        [`aitembag_${i}`, null],
        [`adwprob_${i}`, null],
      ])),
    },
  });

  const fieldConfig = {
    // Basic Info
    tblidx: { label: 'TBLIDX', type: 'number' as const },
    wszname: { label: 'Name', type: 'text' as const },
    bylevel: { label: 'Level', type: 'number' as const },
    bytry_count: { label: 'Try Count', type: 'number' as const },
    
    // Mob Settings
    mob_index: { label: 'Mob Index', type: 'number' as const },
    dwmob_type: { label: 'Mob Type', type: 'number' as const },
    dwworld_rule_type: { label: 'World Rule Type', type: 'number' as const },
    dwinterval: { label: 'Interval', type: 'number' as const },
    
    // Drop Settings
    dwsuperior: { label: 'Superior', type: 'number' as const },
    dwexcellent: { label: 'Excellent', type: 'number' as const },
    dwrare: { label: 'Rare', type: 'number' as const },
    dwlegendary: { label: 'Legendary', type: 'number' as const },
    dwno_drop: { label: 'No Drop', type: 'number' as const },
    dwzenny: { label: 'Zenny', type: 'number' as const },
    
    // Item Bag Settings
    dwitembagcount: { label: 'Item Bag Count', type: 'number' as const },
    dwtotalprob: { label: 'Total Probability', type: 'number' as const },
    ...Object.fromEntries([...Array(20)].flatMap((_, i) => [
      [`aitembag_${i}`, { label: `Item Bag ${i}`, type: 'number' as const }],
      [`adwprob_${i}`, { label: `Probability ${i}`, type: 'number' as const }],
    ])),
  };

  const renderField = (field: keyof typeof fieldConfig) => {
    const config = fieldConfig[field];
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

  const renderItemBagPair = (index: number) => {
    return (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Item Bag {index}
        </h3>
        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            {renderField(`aitembag_${index}` as keyof typeof fieldConfig)}
            {renderField(`adwprob_${index}` as keyof typeof fieldConfig)}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      sections: [
        {
          label: "Basic Information",
          fields: ["tblidx", "wszname", "bylevel", "bytry_count"]
        }
      ]
    },
    {
      id: "mob",
      label: "Mob Settings",
      sections: [
        {
          label: "Mob Configuration",
          fields: ["mob_index", "dwmob_type", "dwworld_rule_type", "dwinterval"]
        }
      ]
    },
    {
      id: "drop",
      label: "Drop Settings",
      sections: [
        {
          label: "Drop Rates",
          fields: ["dwsuperior", "dwexcellent", "dwrare", "dwlegendary", "dwno_drop", "dwzenny"]
        }
      ]
    },
    {
      id: "itembag",
      label: "Item Bags",
      sections: [
        {
          label: "Item Bag Settings",
          fields: ["dwitembagcount", "dwtotalprob"]
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
                  {tab.id === 'itembag' && (
                    <div className="space-y-6">
                      {[...Array(20)].map((_, index) => renderItemBagPair(index))}
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