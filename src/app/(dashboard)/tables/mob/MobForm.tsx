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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the schema from the page file
import { mobSchema } from "./schema";

type MobFormData = z.infer<typeof mobSchema>;

interface MobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialData?: MobFormData;
  onSubmit: (data: MobFormData) => void;
}

export function MobForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: MobFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<MobFormData>({
    resolver: zodResolver(mobSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: MobFormData) => {
    onSubmit(data);
  };

  // Define tabs for the form
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      fields: [
        "tblidx",
        "name",
        "wsznametext",
        "sznametext",
        "szmodel",
        "szillust",
        "bvalidity_able",
        "bshow_name",
      ],
    },
    {
      id: "stats",
      label: "Stats",
      fields: [
        "bylevel",
        "bygrade",
        "dwbasic_lp",
        "wbasic_ep",
        "wbasic_physical_offence",
        "wbasic_energy_offence",
        "wbasic_physical_defence",
        "wbasic_energy_defence",
        "wbasicstr",
        "wbasiccon",
        "wbasicfoc",
        "wbasicdex",
        "wbasicsol",
        "wbasiceng",
      ],
    },
    {
      id: "combat",
      label: "Combat",
      fields: [
        "bybattle_attribute",
        "wattack_speed_rate",
        "byattack_type",
        "fattack_range",
        "wattack_rate",
        "wdodge_rate",
        "wblock_rate",
        "wcurse_success_rate",
        "wcurse_tolerance_rate",
        "wbasic_aggro_point",
        "byattack_animation_quantity",
        "wattackcooltime",
      ],
    },
    {
      id: "movement",
      label: "Movement",
      fields: [
        "fwalk_speed_origin",
        "fwalk_speed",
        "frun_speed_origin",
        "frun_speed",
        "fradius_x",
        "fradius_z",
        "fradius",
        "ffly_height",
        "fscale",
      ],
    },
    {
      id: "perception",
      label: "Perception",
      fields: [
        "wsight_range",
        "wscan_range",
        "byvisible_sight_range",
        "wsightangle",
        "szcamera_bone_name",
      ],
    },
    {
      id: "defense",
      label: "Defense",
      fields: [
        "wstomachachedefence",
        "wpoisondefence",
        "wbleeddefence",
        "wburndefence",
        "dwimmunity_bit_flag",
      ],
    },
    {
      id: "regen",
      label: "Regeneration",
      fields: [
        "wlp_regeneration",
        "wep_regeneration",
      ],
    },
    {
      id: "drops",
      label: "Drops",
      fields: [
        "dwdrop_zenny",
        "fdrop_zenny_rate",
        "dwexp",
        "drop_item_tblidx",
        "dropquesttblidx",
        "idxbigbag1",
        "bydroprate1",
        "bytrycount1",
        "idxbigbag2",
        "bydroprate2",
        "bytrycount2",
        "idxbigbag3",
        "bydroprate3",
        "bytrycount3",
        "bisdragonballdrop",
        "frewardexprate",
        "frewardzennyrate",
      ],
    },
    {
      id: "ai",
      label: "AI & Behavior",
      fields: [
        "dwai_bit_flag",
        "bspawn_animation",
        "dwdialoggroup",
        "dwallianceidx",
        "waggromaxcount",
        "dwnpcattributeflag",
        "dwmobgroup",
        "wmob_kind",
        "bymob_type",
        "bsize",
        "wtmqpoint",
        "wmonsterclass",
        "wuserace",
      ],
    },
    {
      id: "settings",
      label: "Settings",
      fields: [
        "dwformulaoffset",
        "fsettingrate_lp",
        "fsettingrate_lpregen",
        "fsettingrate_phyoffence",
        "fsettingrate_engoffence",
        "fsettingrate_phydefence",
        "fsettingrate_engdefence",
        "fsettingrate_attackrate",
        "fsettingrate_dodgerate",
        "fsettingphyoffencerate",
        "fsettingengoffencerate",
        "fsettingrate_defence_role",
      ],
    },
    {
      id: "skills1",
      label: "Skills 1-3",
      fields: [
        "wuse_skill_time_0",
        "use_skill_tblidx_0",
        "byuse_skill_basis_0",
        "wuse_skill_lp_0",
        "wuse_skill_time_1",
        "use_skill_tblidx_1",
        "byuse_skill_basis_1",
        "wuse_skill_lp_1",
        "wuse_skill_time_2",
        "use_skill_tblidx_2",
        "byuse_skill_basis_2",
        "wuse_skill_lp_2",
      ],
    },
    {
      id: "skills2",
      label: "Skills 4-7",
      fields: [
        "wuse_skill_time_3",
        "use_skill_tblidx_3",
        "byuse_skill_basis_3",
        "wuse_skill_lp_3",
        "wuse_skill_time_4",
        "use_skill_tblidx_4",
        "byuse_skill_basis_4",
        "wuse_skill_lp_4",
        "wuse_skill_time_5",
        "use_skill_tblidx_5",
        "byuse_skill_basis_5",
        "wuse_skill_lp_5",
        "wuse_skill_time_6",
        "use_skill_tblidx_6",
        "byuse_skill_basis_6",
        "wuse_skill_lp_6",
      ],
    },
    {
      id: "other",
      label: "Other",
      fields: [
        "dwunknown",
        "byunknown",
        "byunknown2",
      ],
    },
  ];

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean" }> = {
    tblidx: { label: "ID", type: "number" },
    bvalidity_able: { label: "Valid", type: "boolean" },
    name: { label: "Name", type: "text" },
    wsznametext: { label: "Display Name", type: "text" },
    szmodel: { label: "Model", type: "text" },
    bylevel: { label: "Level", type: "number" },
    bygrade: { label: "Grade", type: "number" },
    dwai_bit_flag: { label: "AI Bit Flag", type: "number" },
    wlp_regeneration: { label: "LP Regeneration", type: "number" },
    wep_regeneration: { label: "EP Regeneration", type: "number" },
    byattack_animation_quantity: { label: "Attack Animation Quantity", type: "number" },
    bybattle_attribute: { label: "Battle Attribute", type: "number" },
    wbasic_physical_offence: { label: "Physical Offense", type: "number" },
    wbasic_energy_offence: { label: "Energy Offense", type: "number" },
    fwalk_speed_origin: { label: "Walk Speed Origin", type: "number" },
    fwalk_speed: { label: "Walk Speed", type: "number" },
    frun_speed_origin: { label: "Run Speed Origin", type: "number" },
    frun_speed: { label: "Run Speed", type: "number" },
    fradius_x: { label: "Radius X", type: "number" },
    fradius_z: { label: "Radius Z", type: "number" },
    wsight_range: { label: "Sight Range", type: "number" },
    wscan_range: { label: "Scan Range", type: "number" },
    byvisible_sight_range: { label: "Visible Sight Range", type: "number" },
    szcamera_bone_name: { label: "Camera Bone Name", type: "text" },
    wattackcooltime: { label: "Attack Cooltime", type: "number" },
    ffly_height: { label: "Fly Height", type: "number" },
    sznametext: { label: "Name Text", type: "text" },
    bspawn_animation: { label: "Spawn Animation", type: "boolean" },
    dwdialoggroup: { label: "Dialog Group", type: "number" },
    szillust: { label: "Illustration", type: "text" },
    dwallianceidx: { label: "Alliance Index", type: "number" },
    waggromaxcount: { label: "Aggro Max Count", type: "number" },
    dwnpcattributeflag: { label: "NPC Attribute Flag", type: "number" },
    wstomachachedefence: { label: "Stomachache Defense", type: "number" },
    wpoisondefence: { label: "Poison Defense", type: "number" },
    wbleeddefence: { label: "Bleed Defense", type: "number" },
    wburndefence: { label: "Burn Defense", type: "number" },
    dwbasic_lp: { label: "Basic LP", type: "number" },
    wbasic_ep: { label: "Basic EP", type: "number" },
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
    wbasic_aggro_point: { label: "Basic Aggro Point", type: "number" },
    dwmobgroup: { label: "Mob Group", type: "number" },
    wmob_kind: { label: "Mob Kind", type: "number" },
    dwdrop_zenny: { label: "Drop Zenny", type: "number" },
    fdrop_zenny_rate: { label: "Drop Zenny Rate", type: "number" },
    dwexp: { label: "Experience", type: "number" },
    bymob_type: { label: "Mob Type", type: "number" },
    drop_item_tblidx: { label: "Drop Item Table ID", type: "number" },
    bsize: { label: "Size", type: "boolean" },
    wtmqpoint: { label: "TMQ Point", type: "number" },
    dropquesttblidx: { label: "Drop Quest Table ID", type: "number" },
    idxbigbag1: { label: "Big Bag 1 ID", type: "number" },
    bydroprate1: { label: "Drop Rate 1", type: "number" },
    bytrycount1: { label: "Try Count 1", type: "number" },
    idxbigbag2: { label: "Big Bag 2 ID", type: "number" },
    bydroprate2: { label: "Drop Rate 2", type: "number" },
    bytrycount2: { label: "Try Count 2", type: "number" },
    idxbigbag3: { label: "Big Bag 3 ID", type: "number" },
    bydroprate3: { label: "Drop Rate 3", type: "number" },
    bytrycount3: { label: "Try Count 3", type: "number" },
    dwunknown: { label: "Unknown 1", type: "number" },
    byunknown: { label: "Unknown 2", type: "number" },
    byunknown2: { label: "Unknown 3", type: "number" },
    bshow_name: { label: "Show Name", type: "boolean" },
    wsightangle: { label: "Sight Angle", type: "number" },
    dwimmunity_bit_flag: { label: "Immunity Bit Flag", type: "number" },
    bisdragonballdrop: { label: "Dragon Ball Drop", type: "boolean" },
    wmonsterclass: { label: "Monster Class", type: "number" },
    wuserace: { label: "Use Race", type: "number" },
    frewardexprate: { label: "Reward EXP Rate", type: "number" },
    frewardzennyrate: { label: "Reward Zenny Rate", type: "number" },
    dwformulaoffset: { label: "Formula Offset", type: "number" },
    fsettingrate_lp: { label: "Setting Rate LP", type: "number" },
    fsettingrate_lpregen: { label: "Setting Rate LP Regen", type: "number" },
    fsettingrate_phyoffence: { label: "Setting Rate Physical Offense", type: "number" },
    fsettingrate_engoffence: { label: "Setting Rate Energy Offense", type: "number" },
    fsettingrate_phydefence: { label: "Setting Rate Physical Defense", type: "number" },
    fsettingrate_engdefence: { label: "Setting Rate Energy Defense", type: "number" },
    fsettingrate_attackrate: { label: "Setting Rate Attack Rate", type: "number" },
    fsettingrate_dodgerate: { label: "Setting Rate Dodge Rate", type: "number" },
    fsettingphyoffencerate: { label: "Setting Physical Offense Rate", type: "number" },
    fsettingengoffencerate: { label: "Setting Energy Offense Rate", type: "number" },
    fsettingrate_defence_role: { label: "Setting Rate Defense Role", type: "number" },
    wuse_skill_time_0: { label: "Skill 1 Time", type: "number" },
    use_skill_tblidx_0: { label: "Skill 1 ID", type: "number" },
    byuse_skill_basis_0: { label: "Skill 1 Basis", type: "number" },
    wuse_skill_lp_0: { label: "Skill 1 LP", type: "number" },
    wuse_skill_time_1: { label: "Skill 2 Time", type: "number" },
    use_skill_tblidx_1: { label: "Skill 2 ID", type: "number" },
    byuse_skill_basis_1: { label: "Skill 2 Basis", type: "number" },
    wuse_skill_lp_1: { label: "Skill 2 LP", type: "number" },
    wuse_skill_time_2: { label: "Skill 3 Time", type: "number" },
    use_skill_tblidx_2: { label: "Skill 3 ID", type: "number" },
    byuse_skill_basis_2: { label: "Skill 3 Basis", type: "number" },
    wuse_skill_lp_2: { label: "Skill 3 LP", type: "number" },
    wuse_skill_time_3: { label: "Skill 4 Time", type: "number" },
    use_skill_tblidx_3: { label: "Skill 4 ID", type: "number" },
    byuse_skill_basis_3: { label: "Skill 4 Basis", type: "number" },
    wuse_skill_lp_3: { label: "Skill 4 LP", type: "number" },
    wuse_skill_time_4: { label: "Skill 5 Time", type: "number" },
    use_skill_tblidx_4: { label: "Skill 5 ID", type: "number" },
    byuse_skill_basis_4: { label: "Skill 5 Basis", type: "number" },
    wuse_skill_lp_4: { label: "Skill 5 LP", type: "number" },
    wuse_skill_time_5: { label: "Skill 6 Time", type: "number" },
    use_skill_tblidx_5: { label: "Skill 6 ID", type: "number" },
    byuse_skill_basis_5: { label: "Skill 6 Basis", type: "number" },
    wuse_skill_lp_5: { label: "Skill 6 LP", type: "number" },
    wuse_skill_time_6: { label: "Skill 7 Time", type: "number" },
    use_skill_tblidx_6: { label: "Skill 7 ID", type: "number" },
    byuse_skill_basis_6: { label: "Skill 7 Basis", type: "number" },
    wuse_skill_lp_6: { label: "Skill 7 LP", type: "number" },
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
          name={field as keyof MobFormData}
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
        name={field as keyof MobFormData}
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
              <div className="grid grid-rows-2 gap-1 mb-4">
                <TabsList className="grid grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1">
                  {tabs.slice(0, 6).map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsList className="grid grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1">
                  {tabs.slice(6).map((tab) => (
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
                <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {tab.fields?.map((field) => renderField(field))}
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