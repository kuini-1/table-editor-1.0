"use client";

import { useState, useEffect, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}: HlsItemFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null);

  // Reset scroll when tab changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }
  }, [activeTab]);

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
  const allTabs = [
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

  // Quick view sections
  const quickViewSections = [
    {
      title: "Basic Information",
      fields: ["tblidx", "wszname", "wszcjiproductid", "szicon_name", "whlsitemtype"]
    },
    {
      title: "Sale Settings",
      fields: ["bonsale", "byselltype", "dwcash", "bydiscount"]
    }
  ];

  // Filter tabs to only include those with valid fields
  const validFieldKeys = new Set(Object.keys(fieldConfig));
  
  // Get all fields that are in quick view to exclude them from tabs
  const quickViewFieldKeys = new Set<string>();
  quickViewSections.forEach(section => {
    section.fields.forEach(field => quickViewFieldKeys.add(field));
  });
  
  const tabs = allTabs
    .map(tab => {
      if (tab.sections) {
        // Filter sections to exclude fields that are in quick view
        const filteredSections = tab.sections
          .map(section => {
            const filteredFields = section.fields.filter(
              field => validFieldKeys.has(field) && !quickViewFieldKeys.has(field)
            );
            if (filteredFields.length === 0) return null;
            return { ...section, fields: filteredFields };
          })
          .filter((section): section is typeof tab.sections[0] => section !== null);
        
        // Only include tab if it has at least one valid section
        if (filteredSections.length === 0) return null;
        return { ...tab, sections: filteredSections };
      } else if (tab.itemSets) {
        // Filter itemSets to only include those with at least one valid field
        const validItemSets = tab.itemSets.filter(itemSet =>
          itemSet.fields.some(field => validFieldKeys.has(field))
        );
        // Only include tab if it has at least one valid itemSet
        if (validItemSets.length === 0) return null;
        return { ...tab, itemSets: validItemSets };
      }
      return null;
    })
    .filter((tab): tab is typeof allTabs[0] => tab !== null);

  // Reset activeTab if it's no longer valid
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

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
    // Filter out fields that don't exist in fieldConfig
    const validFields = section.fields.filter(field => validFieldKeys.has(field));
    if (validFields.length === 0) return null;
    
    return (
      <div key={section.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {section.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {validFields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  // Function to render an item set
  const renderItemSet = (itemSet: { label: string; fields: string[] }) => {
    // Filter out fields that don't exist in fieldConfig
    const validFields = itemSet.fields.filter(field => validFieldKeys.has(field));
    if (validFields.length === 0) return null;
    
    return (
      <div key={itemSet.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {itemSet.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {validFields.map((field) => renderField(field))}
        </div>
      </div>
    );
  };

  // Render field in compact mode for quick view
  const renderFieldCompact = (field: string) => {
    const config = fieldConfig[field as keyof typeof fieldConfig];
    if (!config) return null;

    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field as keyof HlsItemFormData}
          render={({ field: formField }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {config.label}
              </FormLabel>
              <div className="flex items-center h-10 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={!!formField.value}
                    onCheckedChange={formField.onChange}
                    className="h-4 w-4 rounded-md border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  />
                </FormControl>
                <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                  {formField.value ? 'Yes' : 'No'}
                </span>
              </div>
              <FormMessage className="text-xs" />
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
          <FormItem className="space-y-1">
            <FormLabel className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                type={config.type === 'number' ? 'number' : 'text'}
                name={formField.name}
                value={String(formField.value ?? '')}
                onChange={formField.onChange}
                className="h-10 text-sm px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-0 transition-all duration-200"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden flex">
            {/* Left Column - Quick View Panel */}
            <div className="w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick View</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Frequently used fields</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {quickViewSections.map((section, idx) => {
                    const sectionFields = section.fields.filter(field => validFieldKeys.has(field));
                    if (sectionFields.length === 0) return null;
                    return (
                      <Card key={idx} className="border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {sectionFields.map((field) => renderFieldCompact(field))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Right Column - Detailed Editing with Tabs */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
                {/* Sticky tabs list */}
                <div className="sticky top-0 z-10 px-6 pt-2 pb-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <TabsList className="grid grid-cols-2 w-full bg-gray-100 dark:bg-gray-800 p-1">
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
                </div>

                {/* Scrollable tab content */}
                <ScrollArea ref={scrollAreaRef} className="flex-1">
                  <div className="px-6 py-2">
                    {tabs.map((tab) => (
                      <TabsContent key={tab.id} value={tab.id} className="mt-2 space-y-4">
                        {tab.sections ? (
                          tab.sections.map((section) => renderSection(section)).filter(Boolean)
                        ) : tab.itemSets ? (
                          tab.itemSets.map((itemSet) => renderItemSet(itemSet)).filter(Boolean)
                        ) : null}
                      </TabsContent>
                    ))}
                  </div>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
} 