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
import { worldSchema } from './schema';

type WorldFormData = z.infer<typeof worldSchema>;

interface WorldFormProps {
  initialData?: WorldFormData;
  onSubmit: (data: WorldFormData) => void;
  onCancel: () => void;
  mode: 'add' | 'edit' | 'duplicate';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CoordinateGroup {
  base: string;
  label: string;
}

interface FormSection {
  label: string;
  fields?: string[];
  coordinates?: CoordinateGroup[];
}

interface TabDefinition {
  id: string;
  label: string;
  sections: FormSection[];
}

export function WorldForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
  open,
  onOpenChange,
}: WorldFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<WorldFormData>({
    resolver: zodResolver(worldSchema),
    defaultValues: initialData || {},
  });

  // Define field labels and types
  const fieldConfig: Record<string, { label: string; type: "text" | "number" | "boolean" }> = {
    tblidx: { label: "ID", type: "number" },
    szname: { label: "Name", type: "text" },
    wszname: { label: "Wide Name", type: "text" },
    bdynamic: { label: "Dynamic", type: "boolean" },
    ncreatecount: { label: "Create Count", type: "number" },
    dwdynamiccreatecountsharegroup: { label: "Dynamic Create Count Share Group", type: "number" },
    bydoortype: { label: "Door Type", type: "number" },
    dwdestroytimeinmillisec: { label: "Destroy Time (ms)", type: "number" },
    wszmobspawn_table_name: { label: "Mob Spawn Table", type: "text" },
    wsznpcspawn_table_name: { label: "NPC Spawn Table", type: "text" },
    wszobjspawn_table_name: { label: "Object Spawn Table", type: "text" },
    vstart_x: { label: "Start X", type: "number" },
    vstart_y: { label: "Start Y", type: "number" },
    vstart_z: { label: "Start Z", type: "number" },
    vend_x: { label: "End X", type: "number" },
    vend_y: { label: "End Y", type: "number" },
    vend_z: { label: "End Z", type: "number" },
    vstandardloc_x: { label: "Standard X", type: "number" },
    vstandardloc_y: { label: "Standard Y", type: "number" },
    vstandardloc_z: { label: "Standard Z", type: "number" },
    vbattlestartloc_x: { label: "Battle Start X", type: "number" },
    vbattlestartloc_y: { label: "Battle Start Y", type: "number" },
    vbattlestartloc_z: { label: "Battle Start Z", type: "number" },
    vbattleendloc_x: { label: "Battle End X", type: "number" },
    vbattleendloc_y: { label: "Battle End Y", type: "number" },
    vbattleendloc_z: { label: "Battle End Z", type: "number" },
    vbattlestart2loc_x: { label: "Battle Start 2 X", type: "number" },
    vbattlestart2loc_y: { label: "Battle Start 2 Y", type: "number" },
    vbattlestart2loc_z: { label: "Battle Start 2 Z", type: "number" },
    vbattleend2loc_x: { label: "Battle End 2 X", type: "number" },
    vbattleend2loc_y: { label: "Battle End 2 Y", type: "number" },
    vbattleend2loc_z: { label: "Battle End 2 Z", type: "number" },
    voutsidebattlestartloc_x: { label: "Outside Battle Start X", type: "number" },
    voutsidebattlestartloc_y: { label: "Outside Battle Start Y", type: "number" },
    voutsidebattlestartloc_z: { label: "Outside Battle Start Z", type: "number" },
    voutsidebattleendloc_x: { label: "Outside Battle End X", type: "number" },
    voutsidebattleendloc_y: { label: "Outside Battle End Y", type: "number" },
    voutsidebattleendloc_z: { label: "Outside Battle End Z", type: "number" },
    vspectatorstartloc_x: { label: "Spectator Start X", type: "number" },
    vspectatorstartloc_y: { label: "Spectator Start Y", type: "number" },
    vspectatorstartloc_z: { label: "Spectator Start Z", type: "number" },
    vspectatorendloc_x: { label: "Spectator End X", type: "number" },
    vspectatorendloc_y: { label: "Spectator End Y", type: "number" },
    vspectatorendloc_z: { label: "Spectator End Z", type: "number" },
    vdefaultloc_x: { label: "Default X", type: "number" },
    vdefaultloc_y: { label: "Default Y", type: "number" },
    vdefaultloc_z: { label: "Default Z", type: "number" },
    vdefaultdir_x: { label: "Default Direction X", type: "number" },
    vdefaultdir_y: { label: "Default Direction Y", type: "number" },
    vdefaultdir_z: { label: "Default Direction Z", type: "number" },
    vstart1loc_x: { label: "Start 1 X", type: "number" },
    vstart1loc_y: { label: "Start 1 Y", type: "number" },
    vstart1loc_z: { label: "Start 1 Z", type: "number" },
    vstart1dir_x: { label: "Start 1 Direction X", type: "number" },
    vstart1dir_y: { label: "Start 1 Direction Y", type: "number" },
    vstart1dir_z: { label: "Start 1 Direction Z", type: "number" },
    vstart2loc_x: { label: "Start 2 X", type: "number" },
    vstart2loc_y: { label: "Start 2 Y", type: "number" },
    vstart2loc_z: { label: "Start 2 Z", type: "number" },
    vstart2dir_x: { label: "Start 2 Direction X", type: "number" },
    vstart2dir_y: { label: "Start 2 Direction Y", type: "number" },
    vstart2dir_z: { label: "Start 2 Direction Z", type: "number" },
    vwaitingpoint1loc_x: { label: "Waiting Point 1 X", type: "number" },
    vwaitingpoint1loc_y: { label: "Waiting Point 1 Y", type: "number" },
    vwaitingpoint1loc_z: { label: "Waiting Point 1 Z", type: "number" },
    vwaitingpoint1dir_x: { label: "Waiting Point 1 Direction X", type: "number" },
    vwaitingpoint1dir_y: { label: "Waiting Point 1 Direction Y", type: "number" },
    vwaitingpoint1dir_z: { label: "Waiting Point 1 Direction Z", type: "number" },
    vwaitingpoint2loc_x: { label: "Waiting Point 2 X", type: "number" },
    vwaitingpoint2loc_y: { label: "Waiting Point 2 Y", type: "number" },
    vwaitingpoint2loc_z: { label: "Waiting Point 2 Z", type: "number" },
    vwaitingpoint2dir_x: { label: "Waiting Point 2 Direction X", type: "number" },
    vwaitingpoint2dir_y: { label: "Waiting Point 2 Direction Y", type: "number" },
    vwaitingpoint2dir_z: { label: "Waiting Point 2 Direction Z", type: "number" },
    fsplitsize: { label: "Split Size", type: "number" },
    bnight_able: { label: "Night Enabled", type: "boolean" },
    bystatic_time: { label: "Static Time", type: "number" },
    wfuncflag: { label: "Function Flag", type: "number" },
    byworldruletype: { label: "World Rule Type", type: "number" },
    worldruletbldx: { label: "World Rule Table ID", type: "number" },
    outworldtblidx: { label: "Outworld Table ID", type: "number" },
    outworldloc_x: { label: "Outworld X", type: "number" },
    outworldloc_y: { label: "Outworld Y", type: "number" },
    outworldloc_z: { label: "Outworld Z", type: "number" },
    outworlddir_x: { label: "Outworld Direction X", type: "number" },
    outworlddir_y: { label: "Outworld Direction Y", type: "number" },
    outworlddir_z: { label: "Outworld Direction Z", type: "number" },
    wszresourcefolder: { label: "Resource Folder", type: "text" },
    fbgmresttime: { label: "BGM Rest Time", type: "number" },
    dwworldresourceid: { label: "World Resource ID", type: "number" },
    ffreecamera_height: { label: "Free Camera Height", type: "number" },
    wszenterresourceflash: { label: "Enter Resource Flash", type: "text" },
    wszleaveresourceflash: { label: "Leave Resource Flash", type: "text" },
    wpslinkindex: { label: "PS Link Index", type: "number" },
    bystartpointrange: { label: "Start Point Range", type: "number" },
    dwprohibition_bit_flag: { label: "Prohibition Bit Flag", type: "number" },
    abydragonballhaverate_0: { label: "Dragon Ball Have Rate 0", type: "number" },
    abydragonballdroprate_0: { label: "Dragon Ball Drop Rate 0", type: "number" },
    abydragonballhaverate_1: { label: "Dragon Ball Have Rate 1", type: "number" },
    abydragonballdroprate_1: { label: "Dragon Ball Drop Rate 1", type: "number" },
    abydragonballhaverate_2: { label: "Dragon Ball Have Rate 2", type: "number" },
    abydragonballdroprate_2: { label: "Dragon Ball Drop Rate 2", type: "number" },
    abydragonballhaverate_3: { label: "Dragon Ball Have Rate 3", type: "number" },
    abydragonballdroprate_3: { label: "Dragon Ball Drop Rate 3", type: "number" },
    abydragonballhaverate_4: { label: "Dragon Ball Have Rate 4", type: "number" },
    abydragonballdroprate_4: { label: "Dragon Ball Drop Rate 4", type: "number" },
  };

  // Define tabs with their sections
  const tabs: TabDefinition[] = [
    {
      id: "basic",
      label: "Basic Info",
      sections: [
        {
          label: "Basic Information",
          fields: ["tblidx", "szname", "wszname", "bdynamic", "ncreatecount", "dwdynamiccreatecountsharegroup"]
        },
        {
          label: "Door Settings",
          fields: ["bydoortype", "dwdestroytimeinmillisec"]
        },
        {
          label: "Spawn Tables",
          fields: ["wszmobspawn_table_name", "wsznpcspawn_table_name", "wszobjspawn_table_name"]
        }
      ]
    },
    {
      id: "locations",
      label: "Locations",
      sections: [
        {
          label: "Start/End Locations",
          coordinates: [
            { base: "vstart", label: "Start Position" },
            { base: "vend", label: "End Position" },
          ]
        },
        {
          label: "Standard Location",
          coordinates: [
            { base: "vstandardloc", label: "Standard Position" },
          ]
        }
      ]
    },
    {
      id: "battle",
      label: "Battle",
      sections: [
        {
          label: "Battle Start/End",
          coordinates: [
            { base: "vbattlestartloc", label: "Battle Start" },
            { base: "vbattleendloc", label: "Battle End" },
          ]
        },
        {
          label: "Battle Start/End 2",
          coordinates: [
            { base: "vbattlestart2loc", label: "Battle Start 2" },
            { base: "vbattleend2loc", label: "Battle End 2" },
          ]
        },
        {
          label: "Outside Battle",
          coordinates: [
            { base: "voutsidebattlestartloc", label: "Outside Battle Start" },
            { base: "voutsidebattleendloc", label: "Outside Battle End" },
          ]
        }
      ]
    },
    {
      id: "spectator",
      label: "Spectator",
      sections: [
        {
          label: "Spectator Locations",
          coordinates: [
            { base: "vspectatorstartloc", label: "Spectator Start" },
            { base: "vspectatorendloc", label: "Spectator End" },
          ]
        }
      ]
    },
    {
      id: "positions",
      label: "Positions",
      sections: [
        {
          label: "Default Position",
          coordinates: [
            { base: "vdefaultloc", label: "Default Position" },
            { base: "vdefaultdir", label: "Default Direction" },
          ]
        },
        {
          label: "Start Position 1",
          coordinates: [
            { base: "vstart1loc", label: "Start 1 Position" },
            { base: "vstart1dir", label: "Start 1 Direction" },
          ]
        },
        {
          label: "Start Position 2",
          coordinates: [
            { base: "vstart2loc", label: "Start 2 Position" },
            { base: "vstart2dir", label: "Start 2 Direction" },
          ]
        }
      ]
    },
    {
      id: "waiting",
      label: "Waiting",
      sections: [
        {
          label: "Waiting Point 1",
          coordinates: [
            { base: "vwaitingpoint1loc", label: "Waiting Point 1 Position" },
            { base: "vwaitingpoint1dir", label: "Waiting Point 1 Direction" },
          ]
        },
        {
          label: "Waiting Point 2",
          coordinates: [
            { base: "vwaitingpoint2loc", label: "Waiting Point 2 Position" },
            { base: "vwaitingpoint2dir", label: "Waiting Point 2 Direction" },
          ]
        }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      sections: [
        {
          label: "World Settings",
          fields: [
            "fsplitsize", "bnight_able", "bystatic_time",
            "wfuncflag", "byworldruletype", "worldruletbldx"
          ]
        },
        {
          label: "Outworld Settings",
          fields: ["outworldtblidx"],
          coordinates: [
            { base: "outworldloc", label: "Outworld Position" },
            { base: "outworlddir", label: "Outworld Direction" },
          ]
        }
      ]
    },
    {
      id: "resources",
      label: "Resources",
      sections: [
        {
          label: "Resource Settings",
          fields: [
            "wszresourcefolder", "fbgmresttime", "dwworldresourceid",
            "ffreecamera_height", "wszenterresourceflash", "wszleaveresourceflash"
          ]
        },
        {
          label: "Additional Settings",
          fields: [
            "wpslinkindex", "bystartpointrange", "dwprohibition_bit_flag"
          ]
        }
      ]
    },
    {
      id: "dragonballs",
      label: "Dragon Balls",
      sections: [
        {
          label: "Dragon Ball Rates",
          fields: [
            "abydragonballhaverate_0", "abydragonballdroprate_0",
            "abydragonballhaverate_1", "abydragonballdroprate_1",
            "abydragonballhaverate_2", "abydragonballdroprate_2",
            "abydragonballhaverate_3", "abydragonballdroprate_3",
            "abydragonballhaverate_4", "abydragonballdroprate_4"
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
          name={field as keyof WorldFormData}
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
        name={field as keyof WorldFormData}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config.label}
            </FormLabel>
            <FormControl>
              <Input
                name={formField.name}
                value={formField.value?.toString() ?? ''}
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

  // Function to render a coordinate group (x, y, z)
  const renderCoordinateGroup = (baseField: string, label: string) => {
    const fields = [`${baseField}_x`, `${baseField}_y`, `${baseField}_z`];
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h4>
        <div className="grid grid-cols-3 gap-4">
          {fields.map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as keyof WorldFormData}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-600 dark:text-gray-400">
                    {field.endsWith('_x') ? 'X' : field.endsWith('_y') ? 'Y' : 'Z'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      name={formField.name}
                      value={formField.value?.toString() ?? ''}
                      onChange={formField.onChange}
                      type="number"
                      className="h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="grid grid-rows-2 gap-1 mb-4">
                <TabsList className="grid grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1">
                  {tabs.slice(0, 5).map((tab) => (
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
                  {tabs.slice(5).map((tab) => (
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
                        <div className="space-y-6">
                          {section.fields && (
                            <div className="grid grid-cols-2 gap-4">
                              {section.fields.map((field) => renderField(field))}
                            </div>
                          )}
                          {section.coordinates && (
                            <div className="space-y-6">
                              {section.coordinates.map((coord) => (
                                renderCoordinateGroup(coord.base, coord.label)
                              ))}
                            </div>
                          )}
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