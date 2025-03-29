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
import type { FormMode } from '@/components/table/ModularForm';
import { itemMixExpSchema, type ItemMixExpFormData } from './schema';

interface ItemMixExpFormProps {
  initialData?: ItemMixExpFormData;
  onSubmit: (data: ItemMixExpFormData) => void;
  onCancel: () => void;
  mode: FormMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemMixExpForm({
  initialData,
  onSubmit,
}: ItemMixExpFormProps) {
  const form = useForm<ItemMixExpFormData>({
    resolver: zodResolver(itemMixExpSchema),
    defaultValues: initialData || {
      tblidx: null,
      dwneedexp: null,
      byunknown: null,
    },
  });

  const fieldConfig = {
    tblidx: { label: 'TBLIDX', type: 'number' as const },
    dwneedexp: { label: 'Need EXP', type: 'number' as const },
    byunknown: { label: 'Unknown', type: 'number' as const },
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

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(fieldConfig).map((field) => renderField(field as keyof typeof fieldConfig))}
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 