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

// Import the schema from the page file
import { skillSchema } from "./schema";

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: SkillFormData;
  onSubmit: (data: SkillFormData) => void;
}

export default function SkillForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: SkillFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: SkillFormData) => {
    try {
      onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to submit form");
    }
  };

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" }> = {
    tblidx: { label: "ID", type: "number" },
    skill_name: { label: "Skill Name", type: "text" },
    wsznametext: { label: "Display Name", type: "text" },
    szicon_name: { label: "Icon Name", type: "text" },
    note: { label: "Note", type: "text" },
    
    // Class and Type Settings
    byclass_type: { label: "Class Type", type: "number" },
    byskill_class: { label: "Skill Class", type: "number" },
    byskill_type: { label: "Skill Type", type: "number" },
    byskill_active_type: { label: "Active Type", type: "number" },
    byskill_grade: { label: "Skill Grade", type: "number" },
    byskill_group: { label: "Skill Group", type: "number" },
    
    // Requirements
    byrequire_train_level: { label: "Required Level", type: "number" },
    dwrequire_zenny: { label: "Required Zenny", type: "number" },
    wrequiresp: { label: "Required SP", type: "number" },
    dwrequire_lp: { label: "Required LP", type: "number" },
    wrequire_ep: { label: "Required EP", type: "number" },
    dwrequire_vp: { label: "Required VP", type: "number" },
    byrequire_rp_ball: { label: "Required RP Ball", type: "number" },
    
    // Timing Settings
    fcasting_time: { label: "Cast Time", type: "number" },
    dwcastingtimeinmillisecs: { label: "Cast Time (ms)", type: "number" },
    wcool_time: { label: "Cooldown", type: "number" },
    dwcooltimeinmillisecs: { label: "Cooldown (ms)", type: "number" },
    wkeep_time: { label: "Duration", type: "number" },
    dwkeeptimeinmillisecs: { label: "Duration (ms)", type: "number" },
    
    // Target and Range
    byappoint_target: { label: "Appoint Target", type: "number" },
    byapply_target: { label: "Apply Target", type: "number" },
    byapply_target_max: { label: "Max Targets", type: "number" },
    byapply_range: { label: "Apply Range", type: "number" },
    byuse_range_min: { label: "Min Range", type: "number" },
    byuse_range_max: { label: "Max Range", type: "number" },
    
    // Effects
    skill_effect_0: { label: "Effect 1", type: "number" },
    byskill_effect_type_0: { label: "Effect 1 Type", type: "number" },
    askill_effect_value_0: { label: "Effect 1 Value", type: "number" },
    skill_effect_1: { label: "Effect 2", type: "number" },
    byskill_effect_type_1: { label: "Effect 2 Type", type: "number" },
    askill_effect_value_1: { label: "Effect 2 Value", type: "number" },
    
    // RP Effects
    abyrpeffect_0: { label: "RP Effect 1", type: "number" },
    afrpeffectvalue_0: { label: "RP Effect 1 Value", type: "number" },
    abyrpeffect_1: { label: "RP Effect 2", type: "number" },
    afrpeffectvalue_1: { label: "RP Effect 2 Value", type: "number" },
    abyrpeffect_2: { label: "RP Effect 3", type: "number" },
    afrpeffectvalue_2: { label: "RP Effect 3 Value", type: "number" },
    abyrpeffect_3: { label: "RP Effect 4", type: "number" },
    afrpeffectvalue_3: { label: "RP Effect 4 Value", type: "number" },
    abyrpeffect_4: { label: "RP Effect 5", type: "number" },
    afrpeffectvalue_4: { label: "RP Effect 5 Value", type: "number" },
    abyrpeffect_5: { label: "RP Effect 6", type: "number" },
    afrpeffectvalue_5: { label: "RP Effect 6 Value", type: "number" },
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
            "skill_name",
            "wsznametext",
            "szicon_name",
            "note"
          ]
        },
        {
          label: "Class and Type",
          fields: [
            "byclass_type",
            "byskill_class",
            "byskill_type",
            "byskill_active_type",
            "byskill_grade",
            "byskill_group"
          ]
        },
        {
          label: "Requirements",
          fields: [
            "byrequire_train_level",
            "dwrequire_zenny",
            "wrequiresp",
            "dwrequire_lp",
            "wrequire_ep",
            "dwrequire_vp",
            "byrequire_rp_ball"
          ]
        },
        {
          label: "Timing",
          fields: [
            "fcasting_time",
            "dwcastingtimeinmillisecs",
            "wcool_time",
            "dwcooltimeinmillisecs",
            "wkeep_time",
            "dwkeeptimeinmillisecs"
          ]
        }
      ]
    },
    {
      id: "target",
      label: "Target & Range",
      sections: [
        {
          label: "Target Settings",
          fields: [
            "byappoint_target",
            "byapply_target",
            "byapply_target_max"
          ]
        },
        {
          label: "Range Settings",
          fields: [
            "byapply_range",
            "byuse_range_min",
            "byuse_range_max"
          ]
        }
      ]
    },
    {
      id: "skill_effects",
      label: "Skill Effects",
      sections: [
        {
          label: "Effect 1",
          fields: [
            "skill_effect_0",
            "byskill_effect_type_0",
            "askill_effect_value_0"
          ]
        },
        {
          label: "Effect 2",
          fields: [
            "skill_effect_1",
            "byskill_effect_type_1",
            "askill_effect_value_1"
          ]
        }
      ]
    },
    {
      id: "rp_effects",
      label: "RP Effects",
      sections: [
        {
          label: "RP Effect 1",
          fields: [
            "abyrpeffect_0",
            "afrpeffectvalue_0"
          ]
        },
        {
          label: "RP Effect 2",
          fields: [
            "abyrpeffect_1",
            "afrpeffectvalue_1"
          ]
        },
        {
          label: "RP Effect 3",
          fields: [
            "abyrpeffect_2",
            "afrpeffectvalue_2"
          ]
        },
        {
          label: "RP Effect 4",
          fields: [
            "abyrpeffect_3",
            "afrpeffectvalue_3"
          ]
        },
        {
          label: "RP Effect 5",
          fields: [
            "abyrpeffect_4",
            "afrpeffectvalue_4"
          ]
        },
        {
          label: "RP Effect 6",
          fields: [
            "abyrpeffect_5",
            "afrpeffectvalue_5"
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
        name={field as keyof SkillFormData}
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

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
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
                <TabsContent key={tab.id} value={tab.id}>
                  <div className="flex flex-col space-y-6">
                    {tab.sections?.map((section) => (
                      <div key={section.label} className="w-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          {section.label}
                        </h3>
                        <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-4">
                            {section.fields.map((field) => renderField(field))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 