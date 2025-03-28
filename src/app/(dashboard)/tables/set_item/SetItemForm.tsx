"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import the schema from the page file
import { setItemSchema } from "./schema";

type SetItemFormData = z.infer<typeof setItemSchema>;

interface SetItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: SetItemFormData;
  onSubmit: (data: SetItemFormData) => void;
}

export default function SetItemForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: SetItemFormProps) {
  const form = useForm<SetItemFormData>({
    resolver: zodResolver(setItemSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: SetItemFormData) => {
    try {
      onSubmit(data);
      form.reset();
      toast.success(mode === "add" ? "Set item added successfully" : "Set item updated successfully");
    } catch (error) {
      toast.error("Failed to save set item");
      console.error(error);
    }
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean"; tab: string; section: string }> = {
    tblidx: { label: "ID", type: "number", tab: "basic", section: "Basic Info" },
    bvalidity_able: { label: "Validity", type: "boolean", tab: "basic", section: "Basic Info" },
    semisetoption: { label: "Semi Set Option", type: "number", tab: "options", section: "Set Options" },
    fullsetoption: { label: "Full Set Option", type: "number", tab: "options", section: "Set Options" },
    aitemtblidx_0: { label: "Item 1 ID", type: "number", tab: "items", section: "Set Items" },
    aitemtblidx_1: { label: "Item 2 ID", type: "number", tab: "items", section: "Set Items" },
    aitemtblidx_2: { label: "Item 3 ID", type: "number", tab: "items", section: "Set Items" },
  };

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field];
    if (!config) return null;

    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field as keyof SetItemFormData}
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
        name={field as keyof SetItemFormData}
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

  // Group fields by tab and section
  const fieldsByTabAndSection = Object.entries(fieldConfig).reduce((acc, [field, config]) => {
    if (!acc[config.tab]) {
      acc[config.tab] = {};
    }
    if (!acc[config.tab][config.section]) {
      acc[config.tab][config.section] = [];
    }
    acc[config.tab][config.section].push(field);
    return acc;
  }, {} as Record<string, Record<string, string[]>>);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="options">Set Options</TabsTrigger>
                <TabsTrigger value="items">Set Items</TabsTrigger>
              </TabsList>

              {Object.entries(fieldsByTabAndSection).map(([tab, sections]) => (
                <TabsContent key={tab} value={tab} className="space-y-6">
                  {Object.entries(sections).map(([section, fields]) => (
                    <div key={section} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section}</h3>
                      <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                        {fields.map((field) => renderField(field))}
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