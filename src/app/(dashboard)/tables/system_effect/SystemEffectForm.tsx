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

import { systemEffectSchema } from "./schema";

type SystemEffectFormData = z.infer<typeof systemEffectSchema>;

interface SystemEffectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: SystemEffectFormData;
  onSubmit: (data: SystemEffectFormData) => void;
}

export default function SystemEffectForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: SystemEffectFormProps) {
  const form = useForm<SystemEffectFormData>({
    resolver: zodResolver(systemEffectSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: SystemEffectFormData) => {
    try {
      onSubmit(data);
      form.reset();
      toast.success(mode === "add" ? "System effect added successfully" : "System effect updated successfully");
    } catch (error) {
      toast.error("Failed to save system effect");
      console.error(error);
    }
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number"; tab: string; section: string }> = {
    tblidx: { label: "ID", type: "number", tab: "basic", section: "Basic Info" },
    wszname: { label: "Name", type: "text", tab: "basic", section: "Basic Info" },
    byeffect_type: { label: "Effect Type", type: "number", tab: "basic", section: "Basic Info" },
    byactive_effect_type: { label: "Active Effect Type", type: "number", tab: "basic", section: "Basic Info" },
    effect_info_text: { label: "Effect Info", type: "text", tab: "basic", section: "Basic Info" },
    keep_effect_name: { label: "Keep Effect Name", type: "text", tab: "effects", section: "Keep Effects" },
    bytarget_effect_position: { label: "Target Effect Position", type: "number", tab: "effects", section: "Keep Effects" },
    wkeep_animation_index: { label: "Keep Animation Index", type: "number", tab: "effects", section: "Keep Effects" },
    szsuccess_effect_name: { label: "Success Effect Name", type: "text", tab: "success", section: "Success Effects" },
    bysuccess_projectile_type: { label: "Success Projectile Type", type: "number", tab: "success", section: "Success Effects" },
    bysuccess_effect_position: { label: "Success Effect Position", type: "number", tab: "success", section: "Success Effects" },
    szsuccess_end_effect_name: { label: "Success End Effect Name", type: "text", tab: "success", section: "End Effects" },
    byend_effect_position: { label: "End Effect Position", type: "number", tab: "success", section: "End Effects" },
  };

  // Function to render a field
  const renderField = (field: string) => {
    const config = fieldConfig[field];
    if (!config) return null;

    return (
      <FormField
        key={field}
        control={form.control}
        name={field as keyof SystemEffectFormData}
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
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="effects">Keep Effects</TabsTrigger>
                <TabsTrigger value="success">Success Effects</TabsTrigger>
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
            {mode === "add" ? "Add System Effect" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
} 