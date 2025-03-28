'use client';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';

// Import the schema from the page file
import { itemTableSchema } from './schema';

type ItemTableFormData = z.infer<typeof itemTableSchema>;

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: ItemTableFormData;
  onSubmit: (data: ItemTableFormData) => void;
}

export default function ItemForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: ItemFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<ItemTableFormData>({
    resolver: zodResolver(itemTableSchema),
    defaultValues: initialData || {},
  });

  const handleSubmit = (data: ItemTableFormData) => {
    try {
      onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to submit form');
    }
  };

  // Define field labels and types
  const fieldConfig = {
    tblidx: { label: 'ID', type: 'number' as const },
    name: { label: 'Name', type: 'text' as const },
    wsznametext: { label: 'Display Name', type: 'text' as const },
    szicon_name: { label: 'Icon Name', type: 'text' as const },
    bymodel_type: { label: 'Model Type', type: 'number' as const },
    szmodel: { label: 'Model', type: 'text' as const },
    szsub_weapon_act_model: { label: 'Sub Weapon Model', type: 'text' as const },
    byitem_type: { label: 'Item Type', type: 'number' as const },
    byequip_type: { label: 'Equip Type', type: 'number' as const },
    dwequip_slot_type_bit_flag: { label: 'Equip Slot Type', type: 'number' as const },
    wfunction_bit_flag: { label: 'Function Bit Flag', type: 'number' as const },
    bymax_stack: { label: 'Max Stack', type: 'number' as const },
    byrank: { label: 'Rank', type: 'number' as const },
    dwweight: { label: 'Weight', type: 'number' as const },
    dwcost: { label: 'Cost', type: 'number' as const },
    dwsell_price: { label: 'Sell Price', type: 'number' as const },
    bvalidity_able: { label: 'Valid', type: 'boolean' as const },
    note: { label: 'Note', type: 'text' as const },
    bydurability: { label: 'Durability', type: 'number' as const },
    bydurability_count: { label: 'Durability Count', type: 'number' as const },
    bybattle_attribute: { label: 'Battle Attribute', type: 'number' as const },
    wphysical_offence: { label: 'Physical Offense', type: 'number' as const },
    wenergy_offence: { label: 'Energy Offense', type: 'number' as const },
    wphysical_defence: { label: 'Physical Defense', type: 'number' as const },
    wenergy_defence: { label: 'Energy Defense', type: 'number' as const },
    fattack_range_bonus: { label: 'Attack Range Bonus', type: 'number' as const },
    wattack_speed_rate: { label: 'Attack Speed Rate', type: 'number' as const },
    byneed_min_level: { label: 'Min Level', type: 'number' as const },
    byneed_max_level: { label: 'Max Level', type: 'number' as const },
    dwneed_class_bit_flag: { label: 'Class Bit Flag', type: 'number' as const },
    dwneed_gender_bit_flag: { label: 'Gender Bit Flag', type: 'number' as const },
    byclass_special: { label: 'Class Special', type: 'number' as const },
    byrace_special: { label: 'Race Special', type: 'number' as const },
    wneed_str: { label: 'Required STR', type: 'number' as const },
    wneed_con: { label: 'Required CON', type: 'number' as const },
    wneed_foc: { label: 'Required FOC', type: 'number' as const },
    wneed_dex: { label: 'Required DEX', type: 'number' as const },
    wneed_sol: { label: 'Required SOL', type: 'number' as const },
    wneed_eng: { label: 'Required ENG', type: 'number' as const },
    set_item_tblidx: { label: 'Set Item ID', type: 'number' as const },
    bybag_size: { label: 'Bag Size', type: 'number' as const },
    wscouter_watt: { label: 'Scouter WATT', type: 'number' as const },
    dwscouter_maxpower: { label: 'Scouter Max Power', type: 'number' as const },
    byscouter_parts_type1: { label: 'Scouter Parts Type 1', type: 'number' as const },
    byscouter_parts_type2: { label: 'Scouter Parts Type 2', type: 'number' as const },
    byscouter_parts_type3: { label: 'Scouter Parts Type 3', type: 'number' as const },
    byscouter_parts_type4: { label: 'Scouter Parts Type 4', type: 'number' as const },
    use_item_tblidx: { label: 'Use Item ID', type: 'number' as const },
    biscanhaveoption: { label: 'Can Have Option', type: 'boolean' as const },
    item_option_tblidx: { label: 'Item Option ID', type: 'number' as const },
    byitemgroup: { label: 'Item Group', type: 'number' as const },
    charm_tblidx: { label: 'Charm ID', type: 'number' as const },
    wcostumehidebitflag: { label: 'Costume Hide Bit Flag', type: 'number' as const },
    needitemtblidx: { label: 'Need Item ID', type: 'number' as const },
    commonpoint: { label: 'Common Point', type: 'number' as const },
    bycommonpointtype: { label: 'Common Point Type', type: 'number' as const },
    byneedfunction: { label: 'Need Function', type: 'number' as const },
    dwusedurationmax: { label: 'Use Duration Max', type: 'number' as const },
    bydurationtype: { label: 'Duration Type', type: 'number' as const },
    contentstblidx: { label: 'Contents ID', type: 'number' as const },
    dwdurationgroup: { label: 'Duration Group', type: 'number' as const },
    bydroplevel: { label: 'Drop Level', type: 'number' as const },
    enchantratetblidx: { label: 'Enchant Rate ID', type: 'number' as const },
    excellenttblidx: { label: 'Excellent ID', type: 'number' as const },
    raretblidx: { label: 'Rare ID', type: 'number' as const },
    legendarytblidx: { label: 'Legendary ID', type: 'number' as const },
    bcreatesuperiorable: { label: 'Can Create Superior', type: 'boolean' as const },
    bcreateexcellentable: { label: 'Can Create Excellent', type: 'boolean' as const },
    bcreaterareable: { label: 'Can Create Rare', type: 'boolean' as const },
    bcreatelegendaryable: { label: 'Can Create Legendary', type: 'boolean' as const },
    byrestricttype: { label: 'Restrict Type', type: 'number' as const },
    fattack_physical_revision: { label: 'Physical Attack Revision', type: 'number' as const },
    fattack_energy_revision: { label: 'Energy Attack Revision', type: 'number' as const },
    fdefence_physical_revision: { label: 'Physical Defense Revision', type: 'number' as const },
    fdefence_energy_revision: { label: 'Energy Defense Revision', type: 'number' as const },
    bytmptabtype: { label: 'TMP Tab Type', type: 'number' as const },
    biscanrenewal: { label: 'Can Renewal', type: 'boolean' as const },
    wdisassemble_bit_flag: { label: 'Disassemble Bit Flag', type: 'number' as const },
    bydisassemblenormalmin: { label: 'Disassemble Normal Min', type: 'number' as const },
    bydisassemblenormalmax: { label: 'Disassemble Normal Max', type: 'number' as const },
    bydisassembleuppermin: { label: 'Disassemble Upper Min', type: 'number' as const },
    bydisassembleuppermax: { label: 'Disassemble Upper Max', type: 'number' as const },
    bydropvisual: { label: 'Drop Visual', type: 'number' as const },
    byusedisassemble: { label: 'Use Disassemble', type: 'number' as const },
  };

  // Define tabs with their sections
  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      sections: [
        {
          label: 'Basic Information',
          fields: [
            'tblidx',
            'name',
            'wsznametext',
            'szicon_name',
            'note'
          ]
        },
        {
          label: 'Model Settings',
          fields: [
            'bymodel_type',
            'szmodel',
            'szsub_weapon_act_model'
          ]
        },
        {
          label: 'Item Properties',
          fields: [
            'byitem_type',
            'byequip_type',
            'dwequip_slot_type_bit_flag',
            'wfunction_bit_flag',
            'bymax_stack',
            'byrank'
          ]
        },
        {
          label: 'Economy',
          fields: [
            'dwweight',
            'dwcost',
            'dwsell_price',
            'bvalidity_able'
          ]
        }
      ]
    },
    {
      id: 'combat',
      label: 'Combat Stats',
      sections: [
        {
          label: 'Durability',
          fields: [
            'bydurability',
            'bydurability_count'
          ]
        },
        {
          label: 'Offensive Stats',
          fields: [
            'bybattle_attribute',
            'wphysical_offence',
            'wenergy_offence',
            'fattack_range_bonus',
            'wattack_speed_rate'
          ]
        },
        {
          label: 'Defensive Stats',
          fields: [
            'wphysical_defence',
            'wenergy_defence'
          ]
        },
        {
          label: 'Stat Revisions',
          fields: [
            'fattack_physical_revision',
            'fattack_energy_revision',
            'fdefence_physical_revision',
            'fdefence_energy_revision'
          ]
        }
      ]
    },
    {
      id: 'requirements',
      label: 'Requirements',
      sections: [
        {
          label: 'Level Requirements',
          fields: [
            'byneed_min_level',
            'byneed_max_level'
          ]
        },
        {
          label: 'Class & Gender',
          fields: [
            'dwneed_class_bit_flag',
            'dwneed_gender_bit_flag',
            'byclass_special',
            'byrace_special'
          ]
        },
        {
          label: 'Stat Requirements',
          fields: [
            'wneed_str',
            'wneed_con',
            'wneed_foc',
            'wneed_dex',
            'wneed_sol',
            'wneed_eng'
          ]
        },
        {
          label: 'Other Requirements',
          fields: [
            'byrestricttype',
            'byneedfunction',
            'needitemtblidx'
          ]
        }
      ]
    },
    {
      id: 'enhancement',
      label: 'Enhancement',
      sections: [
        {
          label: 'Enhancement Options',
          fields: [
            'biscanhaveoption',
            'item_option_tblidx',
            'byitemgroup',
            'charm_tblidx',
            'set_item_tblidx'
          ]
        },
        {
          label: 'Creation Flags',
          fields: [
            'bcreatesuperiorable',
            'bcreateexcellentable',
            'bcreaterareable',
            'bcreatelegendaryable',
            'biscanrenewal'
          ]
        },
        {
          label: 'Enhancement Tables',
          fields: [
            'enchantratetblidx',
            'excellenttblidx',
            'raretblidx',
            'legendarytblidx'
          ]
        }
      ]
    },
    {
      id: 'special',
      label: 'Special',
      sections: [
        {
          label: 'Scouter Settings',
          fields: [
            'wscouter_watt',
            'dwscouter_maxpower',
            'byscouter_parts_type1',
            'byscouter_parts_type2',
            'byscouter_parts_type3',
            'byscouter_parts_type4'
          ]
        },
        {
          label: 'Duration Settings',
          fields: [
            'dwusedurationmax',
            'bydurationtype',
            'dwdurationgroup'
          ]
        },
        {
          label: 'Other Settings',
          fields: [
            'bybag_size',
            'wcostumehidebitflag',
            'commonpoint',
            'bycommonpointtype',
            'contentstblidx',
            'use_item_tblidx',
            'bytmptabtype'
          ]
        }
      ]
    },
    {
      id: 'disassembly',
      label: 'Disassembly',
      sections: [
        {
          label: 'Disassembly Settings',
          fields: [
            'wdisassemble_bit_flag',
            'byusedisassemble',
            'bydroplevel'
          ]
        },
        {
          label: 'Normal Disassembly',
          fields: [
            'bydisassemblenormalmin',
            'bydisassemblenormalmax'
          ]
        },
        {
          label: 'Upper Disassembly',
          fields: [
            'bydisassembleuppermin',
            'bydisassembleuppermax',
            'bydropvisual'
          ]
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
          name={field as keyof ItemTableFormData}
          render={({ field: formField }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {config.label}
              </FormLabel>
              <div className="flex items-center h-12 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200">
                <FormControl>
                  <Checkbox
                    checked={Boolean(formField.value)}
                    onCheckedChange={(checked) => formField.onChange(checked)}
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
        name={field as keyof ItemTableFormData}
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
      <div key={section.label} className="mb-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {section.label}
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {section.fields.map((field) => renderField(field))}
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
              <TabsList className="grid grid-cols-6 mb-4">
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