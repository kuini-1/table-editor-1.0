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

interface EditRowFormProps<T extends BaseFormData> {
  columns: Column[];
  initialData: T;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  tableId: string;
}

export function EditRowForm<T extends BaseFormData>({
  columns,
  initialData,
  onSubmit,
  onCancel,
  tableId,
}: EditRowFormProps<T>) {
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
          <div className="flex items-center space-x-2">
            <div className="h-8 w-1 bg-blue-500 rounded-full" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit Row
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 pl-10">
            Update the values below to modify this row.
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
            <div className="grid grid-cols-2 gap-4">
              {columns.map(column => (
                <FormField
                  key={column.key}
                  control={form.control}
                  name={column.key}
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="absolute -top-2 left-3 px-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900">
                        {column.label}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type={column.type === 'number' ? 'number' : 'text'} 
                          {...field} 
                          value={field.value ?? ''}
                          placeholder={`Enter ${column.label.toLowerCase()}`}
                          className="h-11 pt-2 bg-transparent border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-xs absolute -bottom-5" />
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
              className="flex-1 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-900/50"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
} 