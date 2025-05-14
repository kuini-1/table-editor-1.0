"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { merchantSchema } from "./schema";

type MerchantFormData = z.infer<typeof merchantSchema>;

interface MerchantFormProps {
  initialData?: MerchantFormData;
  onSubmit: (data: MerchantFormData) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "duplicate";
  tableId: string;
}

export default function MerchantForm({
  initialData,
  onSubmit,
  tableId,
}: MerchantFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: MerchantFormData) => {
    onSubmit(data);
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" }> = {
    tblidx: { label: "ID", type: "number" },
    wsznametext: { label: "Name", type: "text" },
    bysell_type: { label: "Sell Type", type: "number" },
    tab_name: { label: "Tab Name", type: "text" },
    dwneedmileage: { label: "Need Mileage", type: "number" },
    aitem_tblidx_0: { label: "Item ID", type: "number" },
    aneeditemtblidx_0: { label: "Need Item ID", type: "number" },
    abyneeditemstack_0: { label: "Need Item Stack", type: "number" },
    adwneedzenny_0: { label: "Need Zenny", type: "number" },
    aitem_tblidx_1: { label: "Item ID", type: "number" },
    aneeditemtblidx_1: { label: "Need Item ID", type: "number" },
    abyneeditemstack_1: { label: "Need Item Stack", type: "number" },
    adwneedzenny_1: { label: "Need Zenny", type: "number" },
    aitem_tblidx_2: { label: "Item ID", type: "number" },
    aneeditemtblidx_2: { label: "Need Item ID", type: "number" },
    abyneeditemstack_2: { label: "Need Item Stack", type: "number" },
    adwneedzenny_2: { label: "Need Zenny", type: "number" },
    aitem_tblidx_3: { label: "Item ID", type: "number" },
    aneeditemtblidx_3: { label: "Need Item ID", type: "number" },
    abyneeditemstack_3: { label: "Need Item Stack", type: "number" },
    adwneedzenny_3: { label: "Need Zenny", type: "number" },
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
            "wsznametext",
            "bysell_type",
            "tab_name",
            "dwneedmileage"
          ]
        }
      ]
    },
    {
      id: "items",
      label: "Item Bundles",
      itemSets: [
        {
          label: "Item Bundle 1",
          fields: [
            "aitem_tblidx_0",
            "aneeditemtblidx_0",
            "abyneeditemstack_0",
            "adwneedzenny_0"
          ]
        },
        {
          label: "Item Bundle 2",
          fields: [
            "aitem_tblidx_1",
            "aneeditemtblidx_1",
            "abyneeditemstack_1",
            "adwneedzenny_1"
          ]
        },
        {
          label: "Item Bundle 3",
          fields: [
            "aitem_tblidx_2",
            "aneeditemtblidx_2",
            "abyneeditemstack_2",
            "adwneedzenny_2"
          ]
        },
        {
          label: "Item Bundle 4",
          fields: [
            "aitem_tblidx_3",
            "aneeditemtblidx_3",
            "abyneeditemstack_3",
            "adwneedzenny_3"
          ]
        }
      ]
    }
  ];

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig];
    if (!config) return null;

    return (
      <FormField
        key={field}
        control={form.control}
        name={field as keyof MerchantFormData}
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

  const basicTab = tabs.find(tab => tab.id === "basic");
  const itemsTab = tabs.find(tab => tab.id === "items");

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6"
            data-testid={`merchant-form-${tableId}`}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="items">Item Bundles</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                {basicTab?.sections?.map((section) => renderSection(section))}
              </TabsContent>
              <TabsContent value="items" className="space-y-4">
                {itemsTab?.itemSets?.map((itemSet) => renderItemSet(itemSet))}
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 