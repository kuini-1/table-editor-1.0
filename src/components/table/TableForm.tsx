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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface TableFormProps<T extends BaseFormData> {
  columns: Column[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  isEdit?: boolean;
  tableId: string;
}

export function TableForm<T extends BaseFormData>({
  columns,
  initialData,
  onSubmit,
  onCancel,
  isEdit,
  tableId,
}: TableFormProps<T>) {
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
      table_id: tableId,
      ...initialData,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as T);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 h-full flex flex-col">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Row' : 'Add New Row'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEdit ? 'Modify the selected row in the table.' : 'Create a new row in the table.'}
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
            <div className="grid grid-cols-2 gap-6">
              {columns.map(column => (
                <FormField
                  key={column.key}
                  control={form.control}
                  name={column.key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{column.label}</FormLabel>
                      <FormControl>
                        <Input 
                          type={column.type === 'number' ? 'number' : 'text'} 
                          {...field} 
                          value={field.value ?? ''}
                          placeholder={`Enter ${column.label.toLowerCase()}`}
                          className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
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
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 dark:shadow-indigo-900/50 transition-all duration-200"
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
} 