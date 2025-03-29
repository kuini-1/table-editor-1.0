import { useForm } from 'react-hook-form';
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

export type FormMode = 'add' | 'edit' | 'duplicate';

// Update the Column interface to include the 'boolean' type
export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'boolean';
  validation?: z.ZodTypeAny;
}

interface BaseFormData {
  table_id: string;
  [key: string]: string | number | boolean;
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

interface ModularFormProps<T extends BaseFormData> {
  columns: Column[];
  sections?: FormSection[];
  tabs?: FormTab[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  mode: FormMode;
  tableId: string;
  title?: string;
  description?: string;
  showFooter?: boolean;
}

export function ModularForm<T extends BaseFormData>({
  columns,
  sections,
  tabs,
  initialData,
  onSubmit,
  onCancel,
  mode,
  tableId,
  showFooter = true,
}: ModularFormProps<T>) {
  // Create a dynamic schema based on columns
  const schemaObject: { [key: string]: z.ZodTypeAny } = {
    table_id: z.string().uuid(),
  };

  columns.forEach(column => {
    if (column.type === 'number') {
      schemaObject[column.key] = z.coerce.number().min(0, 'Must be a positive number');
    } else if (column.type === 'boolean') {
      schemaObject[column.key] = z.boolean().default(false);
    } else {
      schemaObject[column.key] = z.string();
    }
  });

  const schema = z.object(schemaObject);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      table_id: tableId,
      ...(initialData || {}),
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as T);
  };

  const renderField = (column: Column) => {
    if (column.type === 'boolean') {
      return (
        <FormField
          key={column.key}
          control={form.control}
          name={column.key}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {column.label}
              </FormLabel>
              <div className="flex items-center h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5 rounded-md border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                </FormControl>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {field.value ? 'Yes' : 'No'}
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
        key={column.key}
        control={form.control}
        name={column.key}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {column.label}
            </FormLabel>
            <FormControl>
              <Input 
                type={column.type === 'number' ? 'number' : 'text'} 
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                placeholder={`Enter ${column.label.toLowerCase()}`}
                className="h-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none transition-all duration-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderSections = (sectionsToRender: FormSection[]) => (
    sectionsToRender.map(section => (
      <div key={section.id} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{section.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{section.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {columns
            .filter(col => section.columns.includes(col.key))
            .map(renderField)}
        </div>
      </div>
    ))
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full bg-white dark:bg-gray-900">
        <div className="flex-1 overflow-hidden">
          <FormField
            control={form.control}
            name="table_id"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Render sections first if they exist */}
              {sections && (
                <div className="space-y-6">
                  {renderSections(sections)}
                </div>
              )}

              {/* Then render tabs if they exist */}
              {tabs && (
                <Tabs defaultValue={tabs[0].id} className="space-y-6">
                  <TabsList className="w-full justify-start bg-gray-100 dark:bg-gray-800 p-1">
                    {tabs.map(tab => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {tabs.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                      {renderSections(tab.sections)}
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {/* Fallback to simple grid if no sections or tabs */}
              {!sections && !tabs && (
                <div className="grid grid-cols-2 gap-6">
                  {columns.map(renderField)}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {showFooter && (
          <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white dark:text-white hover:from-purple-700 hover:to-indigo-700"
              >
                {mode === 'add' ? 'Create Entry' : mode === 'edit' ? 'Save Changes' : 'Duplicate Entry'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
} 