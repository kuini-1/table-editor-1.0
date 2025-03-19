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

import { useItemSchema } from "./schema";

type UseItemFormData = z.infer<typeof useItemSchema>;

interface UseItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: UseItemFormData;
  onSubmit: (data: UseItemFormData) => void;
}

export default function UseItemForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: UseItemFormProps) {
  const form = useForm<UseItemFormData>({
    resolver: zodResolver(useItemSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: UseItemFormData) => {
    try {
      onSubmit(data);
      form.reset();
      toast.success(mode === "add" ? "Use item added successfully" : "Use item updated successfully");
    } catch (error) {
      toast.error("Failed to save use item");
      console.error(error);
    }
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean"; tab: string; section: string }> = {
    tblidx: { label: "ID", type: "number", tab: "basic", section: "Basic Info" },
    byuse_item_active_type: { label: "Active Type", type: "number", tab: "basic", section: "Basic Info" },
    bybuff_group: { label: "Buff Group", type: "number", tab: "basic", section: "Basic Info" },
    bybuffkeeptype: { label: "Buff Keep Type", type: "number", tab: "basic", section: "Basic Info" },
    use_info_text: { label: "Info Text", type: "text", tab: "basic", section: "Basic Info" },
    
    dwcool_time_bit_flag: { label: "Cool Time Bit Flag", type: "number", tab: "flags", section: "Flags" },
    wfunction_bit_flag: { label: "Function Bit Flag", type: "number", tab: "flags", section: "Flags" },
    dwuse_restriction_rule_bit_flag: { label: "Use Restriction Rule", type: "number", tab: "flags", section: "Flags" },
    dwuse_allow_rule_bit_flag: { label: "Use Allow Rule", type: "number", tab: "flags", section: "Flags" },
    wneed_state_bit_flag: { label: "Need State Flag", type: "number", tab: "flags", section: "Flags" },
    
    byappoint_target: { label: "Appoint Target", type: "number", tab: "target", section: "Target Settings" },
    byapply_target: { label: "Apply Target", type: "number", tab: "target", section: "Target Settings" },
    dwapply_target_index: { label: "Apply Target Index", type: "number", tab: "target", section: "Target Settings" },
    byapply_target_max: { label: "Apply Target Max", type: "number", tab: "target", section: "Target Settings" },
    byapply_range: { label: "Apply Range", type: "number", tab: "target", section: "Range Settings" },
    byapply_area_size_1: { label: "Area Size 1", type: "number", tab: "target", section: "Range Settings" },
    byapply_area_size_2: { label: "Area Size 2", type: "number", tab: "target", section: "Range Settings" },
    
    dwrequire_lp: { label: "Required LP", type: "number", tab: "requirements", section: "Requirements" },
    wrequire_ep: { label: "Required EP", type: "number", tab: "requirements", section: "Requirements" },
    byrequire_rp_ball: { label: "Required RP Ball", type: "number", tab: "requirements", section: "Requirements" },
    requiredquestid: { label: "Required Quest ID", type: "number", tab: "requirements", section: "Requirements" },
    
    fcasting_time: { label: "Casting Time", type: "number", tab: "timing", section: "Timing" },
    dwcastingtimeinmillisecs: { label: "Casting Time (ms)", type: "number", tab: "timing", section: "Timing" },
    dwcool_time: { label: "Cool Time", type: "number", tab: "timing", section: "Timing" },
    dwcooltimeinmillisecs: { label: "Cool Time (ms)", type: "number", tab: "timing", section: "Timing" },
    dwkeep_time: { label: "Keep Time", type: "number", tab: "timing", section: "Timing" },
    dwkeeptimeinmillisecs: { label: "Keep Time (ms)", type: "number", tab: "timing", section: "Timing" },
    bkeep_effect: { label: "Keep Effect", type: "boolean", tab: "timing", section: "Effects" },
    
    byuse_range_min: { label: "Use Range Min", type: "number", tab: "range", section: "Range" },
    fuse_range_min: { label: "Use Range Min (Float)", type: "number", tab: "range", section: "Range" },
    byuse_range_max: { label: "Use Range Max", type: "number", tab: "range", section: "Range" },
    fuse_range_max: { label: "Use Range Max (Float)", type: "number", tab: "range", section: "Range" },
    
    szcasting_effect: { label: "Casting Effect", type: "text", tab: "effects", section: "Effects" },
    szaction_effect: { label: "Action Effect", type: "text", tab: "effects", section: "Effects" },
    wcasting_animation_start: { label: "Casting Animation Start", type: "number", tab: "effects", section: "Animations" },
    wcasting_animation_loop: { label: "Casting Animation Loop", type: "number", tab: "effects", section: "Animations" },
    waction_animation_index: { label: "Action Animation Index", type: "number", tab: "effects", section: "Animations" },
    waction_loop_animation_index: { label: "Action Loop Animation", type: "number", tab: "effects", section: "Animations" },
    waction_end_animation_index: { label: "Action End Animation", type: "number", tab: "effects", section: "Animations" },
    bycastingeffectposition: { label: "Casting Effect Position", type: "number", tab: "effects", section: "Positions" },
    byactioneffectposition: { label: "Action Effect Position", type: "number", tab: "effects", section: "Positions" },
    
    useworldtblidx: { label: "World Table ID", type: "number", tab: "world", section: "World Settings" },
    fuseloc_x: { label: "Use Location X", type: "number", tab: "world", section: "Location" },
    fuseloc_z: { label: "Use Location Z", type: "number", tab: "world", section: "Location" },
    fuseloc_radius: { label: "Use Location Radius", type: "number", tab: "world", section: "Location" },
    
    asystem_effect_0: { label: "System Effect 1", type: "number", tab: "system", section: "System Effect 1" },
    abysystem_effect_type_0: { label: "Effect Type 1", type: "number", tab: "system", section: "System Effect 1" },
    asystem_effect_value_0: { label: "Effect Value 1", type: "number", tab: "system", section: "System Effect 1" },
    asystem_effect_1: { label: "System Effect 2", type: "number", tab: "system", section: "System Effect 2" },
    abysystem_effect_type_1: { label: "Effect Type 2", type: "number", tab: "system", section: "System Effect 2" },
    asystem_effect_value_1: { label: "Effect Value 2", type: "number", tab: "system", section: "System Effect 2" },
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
          name={field as keyof UseItemFormData}
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
        name={field as keyof UseItemFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                type={config.type === 'number' ? 'number' : 'text'}
                name={formField.name}
                value={formField.value ?? ''}
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
              <TabsList className="grid grid-cols-3 mb-4 bg-muted p-1 rounded-lg">
                <TabsTrigger 
                  value="basic" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="flags" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                >
                  Flags
                </TabsTrigger>
                <TabsTrigger 
                  value="target" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                >
                  Target & Range
                </TabsTrigger>
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