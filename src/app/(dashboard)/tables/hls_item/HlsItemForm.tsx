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

import { hlsItemSchema } from "@/app/(dashboard)/tables/hls_item/schema";

type HlsItemFormData = z.infer<typeof hlsItemSchema>;

interface HlsItemFormProps {
  initialData?: HlsItemFormData;
  onSubmit: (data: HlsItemFormData) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "duplicate";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HlsItemForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  open,
  onOpenChange,
}: HlsItemFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<HlsItemFormData>({
    resolver: zodResolver(hlsItemSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: HlsItemFormData) => {
    onSubmit(data);
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean" }> = {
    tblidx: { label: "ID", type: "number" },
    wszname: { label: "Name", type: "text" },
    wszcjiproductid: { label: "Product ID", type: "text" },
    szicon_name: { label: "Icon Name", type: "text" },
    whlsitemtype: { label: "Item Type", type: "number" },
    byhlsdurationtype: { label: "Duration Type", type: "number" },
    dwhlsdurationtime: { label: "Duration Time", type: "number" },
    idxnametext: { label: "Name Text Index", type: "number" },
    idxnotetext: { label: "Note Text Index", type: "number" },
    itemtblidx: { label: "Main Item ID", type: "number" },
    bonsale: { label: "On Sale", type: "boolean" },
    byselltype: { label: "Sell Type", type: "number" },
    dwcash: { label: "Cash", type: "number" },
    bydiscount: { label: "Discount", type: "number" },
    bystackcount: { label: "Stack Count", type: "number" },
    wdisplaybitflag: { label: "Display Bit Flag", type: "number" },
    byquicklink: { label: "Quick Link", type: "number" },
    dwpriority: { label: "Priority", type: "number" },
    bydisplayconsumetype: { label: "Display Consume Type", type: "number" },
    byyadrattype: { label: "Yadrat Type", type: "number" },
    itemtblidx_0: { label: "Item ID", type: "number" },
    bystackcount_0: { label: "Stack Count", type: "number" },
    itemtblidx_1: { label: "Item ID", type: "number" },
    bystackcount_1: { label: "Stack Count", type: "number" },
    itemtblidx_2: { label: "Item ID", type: "number" },
    bystackcount_2: { label: "Stack Count", type: "number" },
    itemtblidx_3: { label: "Item ID", type: "number" },
    bystackcount_3: { label: "Stack Count", type: "number" },
    itemtblidx_4: { label: "Item ID", type: "number" },
    bystackcount_4: { label: "Stack Count", type: "number" },
  };

  // Define tabs with their sections
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      sections: [
        {
          label: "Basic Information",
          fields: [
            "tblidx",
            "wszname",
            "wszcjiproductid",
            "szicon_name",
            "whlsitemtype",
            "byhlsdurationtype",
            "dwhlsdurationtime",
            "idxnametext",
            "idxnotetext"
          ]
        },
        {
          label: "Sale Settings",
          fields: [
            "bonsale",
            "byselltype",
            "dwcash",
            "bydiscount",
            "bystackcount"
          ]
        },
        {
          label: "Display Settings",
          fields: [
            "wdisplaybitflag",
            "byquicklink",
            "dwpriority",
            "bydisplayconsumetype",
            "byyadrattype"
          ]
        }
      ]
    },
    {
      id: "items",
      label: "Item Bundles",
      itemSets: [
        {
          label: "Main Item",
          fields: ["itemtblidx", "bystackcount"]
        },
        {
          label: "Bundle Item 1",
          fields: ["itemtblidx_0", "bystackcount_0"]
        },
        {
          label: "Bundle Item 2",
          fields: ["itemtblidx_1", "bystackcount_1"]
        },
        {
          label: "Bundle Item 3",
          fields: ["itemtblidx_2", "bystackcount_2"]
        },
        {
          label: "Bundle Item 4",
          fields: ["itemtblidx_3", "bystackcount_3"]
        },
        {
          label: "Bundle Item 5",
          fields: ["itemtblidx_4", "bystackcount_4"]
        }
      ]
    }
  ];

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig];
    if (!config) return null;

    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field as keyof HlsItemFormData}
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
        name={field as keyof HlsItemFormData}
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
      <div key={section.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {section.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {section.fields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  // Function to render an item set
  const renderItemSet = (itemSet: { label: string; fields: string[] }) => {
    return (
      <div key={itemSet.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {itemSet.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {itemSet.fields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  {tab.sections ? (
                    tab.sections.map((section) => renderSection(section))
                  ) : tab.itemSets ? (
                    tab.itemSets.map((itemSet) => renderItemSet(itemSet))
                  ) : null}
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 