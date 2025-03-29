'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { npcSchema } from './schema';

type NpcFormData = z.infer<typeof npcSchema>;

interface NpcFormProps {
  initialData?: NpcFormData;
  onSubmit: (data: NpcFormData) => void;
  onCancel: () => void;
  mode: 'add' | 'edit' | 'duplicate';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormSection {
  label: string;
  fields: string[];
}

interface TabDefinition {
  id: string;
  label: string;
  sections: FormSection[];
}

export function NpcForm({
  initialData,
  onSubmit,
}: NpcFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<NpcFormData>({
    resolver: zodResolver(npcSchema),
    defaultValues: initialData || {},
  });

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean" }> = {
    tblidx: { label: "ID", type: "number" },
    bvalidity_able: { label: "Valid", type: "boolean" },
    name: { label: "Name ID", type: "number" },
    wsznametext: { label: "Name", type: "text" },
    szmodel: { label: "Model", type: "text" },
    bylevel: { label: "Level", type: "number" },
    bygrade: { label: "Grade", type: "number" },
    dwai_bit_flag: { label: "AI Bit Flag", type: "number" },
    wlp_regeneration: { label: "LP Regen", type: "number" },
    wep_regeneration: { label: "EP Regen", type: "number" },
    byattack_animation_quantity: { label: "Attack Animation Quantity", type: "number" },
    bybattle_attribute: { label: "Battle Attribute", type: "number" },
    wbasic_physical_offence: { label: "Physical Attack", type: "number" },
    wbasic_energy_offence: { label: "Energy Attack", type: "number" },
    fwalk_speed_origin: { label: "Base Walk Speed", type: "number" },
    fwalk_speed: { label: "Walk Speed", type: "number" },
    frun_speed_origin: { label: "Base Run Speed", type: "number" },
    frun_speed: { label: "Run Speed", type: "number" },
    fradius_x: { label: "Radius X", type: "number" },
    fradius_z: { label: "Radius Z", type: "number" },
    wsight_range: { label: "Sight Range", type: "number" },
    wscan_range: { label: "Scan Range", type: "number" },
    byvisible_sight_range: { label: "Visible Sight Range", type: "number" },
    szcamera_bone_name: { label: "Camera Bone", type: "text" },
    wattackcooltime: { label: "Attack Cooldown", type: "number" },
    ffly_height: { label: "Fly Height", type: "number" },
    sznametext: { label: "Display Name", type: "text" },
    bspawn_animation: { label: "Spawn Animation", type: "boolean" },
    dwdialoggroup: { label: "Dialog Group", type: "number" },
    szillust: { label: "Illustration", type: "text" },
    dwallianceidx: { label: "Alliance Index", type: "number" },
    waggromaxcount: { label: "Max Aggro Count", type: "number" },
    dwnpcattributeflag: { label: "NPC Attribute Flag", type: "number" },
    wstomachachedefence: { label: "Stomachache Defense", type: "number" },
    wpoisondefence: { label: "Poison Defense", type: "number" },
    wbleeddefence: { label: "Bleed Defense", type: "number" },
    wburndefence: { label: "Burn Defense", type: "number" },
    dwbasic_lp: { label: "Base LP", type: "number" },
    wbasic_ep: { label: "Base EP", type: "number" },
    wbasic_physical_defence: { label: "Physical Defense", type: "number" },
    wbasic_energy_defence: { label: "Energy Defense", type: "number" },
    wbasicstr: { label: "STR", type: "number" },
    wbasiccon: { label: "CON", type: "number" },
    wbasicfoc: { label: "FOC", type: "number" },
    wbasicdex: { label: "DEX", type: "number" },
    wbasicsol: { label: "SOL", type: "number" },
    wbasiceng: { label: "ENG", type: "number" },
    fscale: { label: "Scale", type: "number" },
    wattack_speed_rate: { label: "Attack Speed Rate", type: "number" },
    byattack_type: { label: "Attack Type", type: "number" },
    fattack_range: { label: "Attack Range", type: "number" },
    wattack_rate: { label: "Attack Rate", type: "number" },
    wdodge_rate: { label: "Dodge Rate", type: "number" },
    wblock_rate: { label: "Block Rate", type: "number" },
    wcurse_success_rate: { label: "Curse Success Rate", type: "number" },
    wcurse_tolerance_rate: { label: "Curse Tolerance Rate", type: "number" },
    fradius: { label: "Radius", type: "number" },
    wbasic_aggro_point: { label: "Base Aggro Point", type: "number" },
    bynpctype: { label: "NPC Type", type: "number" },
    byjob: { label: "Job", type: "number" },
    dwfunc_bit_flag: { label: "Function Bit Flag", type: "number" },
    dialog_script_index: { label: "Dialog Script Index", type: "number" },
    statustransformtblidx: { label: "Status Transform Index", type: "number" },
    contentstblidx: { label: "Contents Index", type: "number" },
    wunknown: { label: "Unknown Value", type: "number" },
    dwunknown2: { label: "Unknown Value 2", type: "number" },
    dwunknown3: { label: "Unknown Value 3", type: "number" },
  };

  // Add skill fields to fieldConfig
  for (let i = 0; i < 7; i++) {
    fieldConfig[`wuse_skill_time_${i}`] = { label: `Skill ${i} Time`, type: "number" };
    fieldConfig[`use_skill_tblidx_${i}`] = { label: `Skill ${i} Index`, type: "number" };
    fieldConfig[`byuse_skill_basis_${i}`] = { label: `Skill ${i} Basis`, type: "number" };
    fieldConfig[`wuse_skill_lp_${i}`] = { label: `Skill ${i} LP`, type: "number" };
  }

  // Add merchant fields to fieldConfig
  for (let i = 0; i < 6; i++) {
    fieldConfig[`amerchant_tblidx_${i}`] = { label: `Merchant Index ${i}`, type: "number" };
  }

  // Define tabs with their sections
  const tabs: TabDefinition[] = [
    {
      id: "basic",
      label: "Basic Info",
      sections: [
        {
          label: "Basic Information",
          fields: ["tblidx", "bvalidity_able", "name", "wsznametext", "szmodel", "bylevel", "bygrade"]
        },
        {
          label: "Display Settings",
          fields: ["sznametext", "bspawn_animation", "szillust", "szcamera_bone_name", "fscale"]
        }
      ]
    },
    {
      id: "stats",
      label: "Stats",
      sections: [
        {
          label: "Base Stats",
          fields: ["dwbasic_lp", "wbasic_ep", "wlp_regeneration", "wep_regeneration"]
        },
        {
          label: "Attributes",
          fields: ["wbasicstr", "wbasiccon", "wbasicfoc", "wbasicdex", "wbasicsol", "wbasiceng"]
        },
        {
          label: "Defense Stats",
          fields: [
            "wbasic_physical_defence", "wbasic_energy_defence",
            "wstomachachedefence", "wpoisondefence", "wbleeddefence", "wburndefence"
          ]
        }
      ]
    },
    {
      id: "combat",
      label: "Combat",
      sections: [
        {
          label: "Attack Settings",
          fields: [
            "wbasic_physical_offence", "wbasic_energy_offence",
            "byattack_type", "byattack_animation_quantity",
            "wattackcooltime", "wattack_speed_rate", "fattack_range"
          ]
        },
        {
          label: "Combat Rates",
          fields: [
            "wattack_rate", "wdodge_rate", "wblock_rate",
            "wcurse_success_rate", "wcurse_tolerance_rate"
          ]
        },
        {
          label: "Battle Properties",
          fields: [
            "bybattle_attribute", "wbasic_aggro_point", "waggromaxcount"
          ]
        }
      ]
    },
    {
      id: "movement",
      label: "Movement",
      sections: [
        {
          label: "Speed Settings",
          fields: [
            "fwalk_speed_origin", "fwalk_speed",
            "frun_speed_origin", "frun_speed",
            "ffly_height"
          ]
        },
        {
          label: "Range Settings",
          fields: [
            "fradius", "fradius_x", "fradius_z",
            "wsight_range", "wscan_range", "byvisible_sight_range"
          ]
        }
      ]
    },
    {
      id: "skills",
      label: "Skills",
      sections: Array.from({ length: 7 }, (_, i) => ({
        label: `Skill ${i}`,
        fields: [
          `wuse_skill_time_${i}`,
          `use_skill_tblidx_${i}`,
          `byuse_skill_basis_${i}`,
          `wuse_skill_lp_${i}`
        ]
      }))
    },
    {
      id: "merchant",
      label: "Merchant",
      sections: [
        {
          label: "Merchant Indices",
          fields: Array.from({ length: 6 }, (_, i) => `amerchant_tblidx_${i}`)
        }
      ]
    },
    {
      id: "flags",
      label: "Flags",
      sections: [
        {
          label: "System Flags",
          fields: [
            "dwai_bit_flag",
            "dwnpcattributeflag",
            "dwfunc_bit_flag"
          ]
        },
        {
          label: "Type Settings",
          fields: [
            "bynpctype",
            "byjob"
          ]
        }
      ]
    },
    {
      id: "other",
      label: "Other",
      sections: [
        {
          label: "Dialog Settings",
          fields: [
            "dwdialoggroup",
            "dialog_script_index"
          ]
        },
        {
          label: "Additional Settings",
          fields: [
            "dwallianceidx",
            "statustransformtblidx",
            "contentstblidx"
          ]
        },
        {
          label: "Unknown Values",
          fields: [
            "wunknown",
            "dwunknown2",
            "dwunknown3"
          ]
        }
      ]
    }
  ];

  // Function to render a field based on its type
  const renderField = (field: string) => {
    const config = fieldConfig[field];
    if (!config) return null;

    if (config.type === 'boolean') {
      return (
        <FormField
          key={field}
          control={form.control}
          name={field as keyof NpcFormData}
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
        name={field as keyof NpcFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                name={formField.name}
                value={String(formField.value ?? '')}
                onChange={formField.onChange}
                type={config.type === 'number' ? 'number' : 'text'}
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="grid grid-rows-2 gap-1 mb-4">
                <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1">
                  {tabs.slice(0, 4).map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1">
                  {tabs.slice(4).map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {tab.sections.map((section) => (
                    <div key={section.label} className="mb-6">
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
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
} 