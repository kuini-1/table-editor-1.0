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

import { slotMachineSchema } from "./schema";

type SlotMachineFormData = z.infer<typeof slotMachineSchema>;

interface SlotMachineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: SlotMachineFormData;
  onSubmit: (data: SlotMachineFormData) => void;
}

export function SlotMachineForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: SlotMachineFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<SlotMachineFormData>({
    resolver: zodResolver(slotMachineSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: SlotMachineFormData) => {
    onSubmit(data);
  };

  // Define tabs for the form
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      fields: [
        "tblidx",
        "dwname",
        "wsznametext",
        "szfile_name",
        "bycoin",
        "bonoff",
        "bytype",
        "wfirstwincoin",
      ],
    },
    {
      id: "items",
      label: "Items",
      itemSets: [
        {
          label: "Item 0",
          fields: ["aitemtblidx_0", "bystack_0", "wquantity_0"],
        },
        {
          label: "Item 1",
          fields: ["aitemtblidx_1", "bystack_1", "wquantity_1"],
        },
        {
          label: "Item 2",
          fields: ["aitemtblidx_2", "bystack_2", "wquantity_2"],
        },
        {
          label: "Item 3",
          fields: ["aitemtblidx_3", "bystack_3", "wquantity_3"],
        },
        {
          label: "Item 4",
          fields: ["aitemtblidx_4", "bystack_4", "wquantity_4"],
        },
        {
          label: "Item 5",
          fields: ["aitemtblidx_5", "bystack_5", "wquantity_5"],
        },
        {
          label: "Item 6",
          fields: ["aitemtblidx_6", "bystack_6", "wquantity_6"],
        },
        {
          label: "Item 7",
          fields: ["aitemtblidx_7", "bystack_7", "wquantity_7"],
        },
        {
          label: "Item 8",
          fields: ["aitemtblidx_8", "bystack_8", "wquantity_8"],
        },
        {
          label: "Item 9",
          fields: ["aitemtblidx_9", "bystack_9", "wquantity_9"],
        }
      ],
    }
  ];

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" }> = {
    tblidx: { label: "ID", type: "number" },
    dwname: { label: "Name", type: "text" },
    wsznametext: { label: "Display Name", type: "text" },
    szfile_name: { label: "File Name", type: "text" },
    bycoin: { label: "Coin", type: "number" },
    bonoff: { label: "On/Off", type: "number" },
    bytype: { label: "Type", type: "number" },
    wfirstwincoin: { label: "First Win Coin", type: "number" },
    aitemtblidx_0: { label: "Item 0 ID", type: "number" },
    bystack_0: { label: "Item 0 Stack", type: "number" },
    wquantity_0: { label: "Item 0 Quantity", type: "number" },
    aitemtblidx_1: { label: "Item 1 ID", type: "number" },
    bystack_1: { label: "Item 1 Stack", type: "number" },
    wquantity_1: { label: "Item 1 Quantity", type: "number" },
    aitemtblidx_2: { label: "Item 2 ID", type: "number" },
    bystack_2: { label: "Item 2 Stack", type: "number" },
    wquantity_2: { label: "Item 2 Quantity", type: "number" },
    aitemtblidx_3: { label: "Item 3 ID", type: "number" },
    bystack_3: { label: "Item 3 Stack", type: "number" },
    wquantity_3: { label: "Item 3 Quantity", type: "number" },
    aitemtblidx_4: { label: "Item 4 ID", type: "number" },
    bystack_4: { label: "Item 4 Stack", type: "number" },
    wquantity_4: { label: "Item 4 Quantity", type: "number" },
    aitemtblidx_5: { label: "Item 5 ID", type: "number" },
    bystack_5: { label: "Item 5 Stack", type: "number" },
    wquantity_5: { label: "Item 5 Quantity", type: "number" },
    aitemtblidx_6: { label: "Item 6 ID", type: "number" },
    bystack_6: { label: "Item 6 Stack", type: "number" },
    wquantity_6: { label: "Item 6 Quantity", type: "number" },
    aitemtblidx_7: { label: "Item 7 ID", type: "number" },
    bystack_7: { label: "Item 7 Stack", type: "number" },
    wquantity_7: { label: "Item 7 Quantity", type: "number" },
    aitemtblidx_8: { label: "Item 8 ID", type: "number" },
    bystack_8: { label: "Item 8 Stack", type: "number" },
    wquantity_8: { label: "Item 8 Quantity", type: "number" },
    aitemtblidx_9: { label: "Item 9 ID", type: "number" },
    bystack_9: { label: "Item 9 Stack", type: "number" },
    wquantity_9: { label: "Item 9 Quantity", type: "number" },
  };

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field];
    if (!config) return null;

    return (
      <FormField
        key={field}
        control={form.control}
        name={field as keyof SlotMachineFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                {...formField}
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

  // Function to render an item set
  const renderItemSet = (itemSet: { label: string; fields: string[] }) => {
    return (
      <div key={itemSet.label} className="space-y-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {itemSet.label}
        </h3>
        <div className="grid grid-cols-3 gap-4">
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
                  {tab.itemSets ? (
                    tab.itemSets.map((itemSet) => renderItemSet(itemSet))
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {tab.fields?.map((field) => renderField(field))}
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