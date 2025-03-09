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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import { slotMachineItemSchema } from "./schema";

type SlotMachineItemFormData = z.infer<typeof slotMachineItemSchema>;

interface SlotMachineItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: SlotMachineItemFormData;
  onSubmit: (data: SlotMachineItemFormData) => void;
}

export default function SlotMachineItemForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: SlotMachineItemFormProps) {
  const form = useForm<SlotMachineItemFormData>({
    resolver: zodResolver(slotMachineItemSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: SlotMachineItemFormData) => {
    try {
      onSubmit(data);
      form.reset();
      toast.success(mode === "add" ? "Slot machine item added successfully" : "Slot machine item updated successfully");
    } catch (error) {
      toast.error("Failed to save slot machine item");
      console.error(error);
    }
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean"; tab: string; section: string }> = {
    tblidx: { label: "ID", type: "number", tab: "basic", section: "Basic Info" },
    wsznametext: { label: "Name", type: "text", tab: "basic", section: "Basic Info" },
    bactive: { label: "Active", type: "boolean", tab: "basic", section: "Basic Info" },
    slotmachinetblidx: { label: "Slot Machine ID", type: "number", tab: "details", section: "Item Details" },
    cashitemtblidx: { label: "Cash Item ID", type: "number", tab: "details", section: "Item Details" },
    bystackcount: { label: "Stack Count", type: "number", tab: "details", section: "Item Details" },
    bypercent: { label: "Percent", type: "number", tab: "details", section: "Item Details" },
  };

  // Function to render a field
  const renderField = (field: string) => {
    const config = fieldConfig[field];
    if (!config) return null;

    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field as keyof SlotMachineItemFormData}
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
        name={field as keyof SlotMachineItemFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                {...formField}
                value={String(formField.value ?? '')}
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-20">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Item Details</TabsTrigger>
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
            {mode === "add" ? "Add Slot Machine Item" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
} 