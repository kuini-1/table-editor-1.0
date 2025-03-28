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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FormMode } from '@/components/table/ModularForm';
import { newDungeonSchema, type DungeonFormData, type DungeonRow } from './schema';

interface DungeonFormProps {
  initialData?: DungeonRow | null;
  onSubmit: (data: DungeonFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DungeonForm({
  initialData,
  onSubmit,
  mode,
}: DungeonFormProps) {
  const form = useForm<DungeonFormData>({
    resolver: zodResolver(newDungeonSchema),
    defaultValues: initialData || {
      id: undefined,
      table_id: null,
      created_at: null,
      updated_at: null,
      tblidx: null,
      bydungeontype: null,
      bymaxmember: null,
      linkworld: null,
      byminlevel: null,
      bymaxlevel: null,
      needitemtblidx: null,
      dwhonorpoint: null,
      wpstblidx: null,
      opencine: null,
      groupidx: null,
    },
  });

  const fieldConfig = {
    tblidx: { label: 'TBLIDX', type: 'number' as const },
    bydungeontype: { label: 'Dungeon Type', type: 'number' as const },
    bymaxmember: { label: 'Max Members', type: 'number' as const },
    linkworld: { label: 'Link World', type: 'number' as const },
    byminlevel: { label: 'Min Level', type: 'number' as const },
    bymaxlevel: { label: 'Max Level', type: 'number' as const },
    needitemtblidx: { label: 'Required Item', type: 'number' as const },
    dwhonorpoint: { label: 'Honor Points', type: 'number' as const },
    wpstblidx: { label: 'WPS ID', type: 'number' as const },
    opencine: { label: 'Open Cinematic', type: 'number' as const },
    groupidx: { label: 'Group Index', type: 'number' as const },
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

  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      sections: [
        {
          label: 'Basic Information',
          fields: ['tblidx', 'bydungeontype', 'bymaxmember', 'linkworld']
        }
      ]
    },
    {
      id: 'requirements',
      label: 'Requirements',
      sections: [
        {
          label: 'Level Requirements',
          fields: ['byminlevel', 'bymaxlevel']
        },
        {
          label: 'Other Requirements',
          fields: ['needitemtblidx']
        }
      ]
    },
    {
      id: 'rewards',
      label: 'Rewards',
      sections: [
        {
          label: 'Reward Settings',
          fields: ['dwhonorpoint']
        }
      ]
    },
    {
      id: 'other',
      label: 'Other',
      sections: [
        {
          label: 'Additional Settings',
          fields: ['wpstblidx', 'opencine', 'groupidx']
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