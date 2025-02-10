'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Plus, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from 'next/navigation';

// Form schema for validation
const expTableSchema = z.object({
  table_id: z.string().uuid(),
  tblidx: z.coerce.number().min(0, 'Must be a positive number').max(9999999999, 'Cannot exceed 10 digits'),
  dwExp: z.coerce.number().min(0, 'Must be a positive number'),
  dwNeed_Exp: z.coerce.number().min(0, 'Must be a positive number'),
  wStageWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageDrawSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageLoseSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wPerfectWinSolo: z.coerce.number().min(0, 'Must be a positive number'),
  wStageWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wStageDrawTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wStageLoseTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wPerfectWinTeam: z.coerce.number().min(0, 'Must be a positive number'),
  wNormal_Race: z.coerce.number().min(0, 'Must be a positive number'),
  wSuperRace: z.coerce.number().min(0, 'Must be a positive number'),
  dwMobExp: z.coerce.number().min(0, 'Must be a positive number'),
  dwPhyDefenceRef: z.coerce.number().min(0, 'Must be a positive number'),
  dwEngDefenceRef: z.coerce.number().min(0, 'Must be a positive number'),
  dwMobZenny: z.coerce.number().min(0, 'Must be a positive number'),
});

type ExpTableFormData = z.infer<typeof expTableSchema>;

interface ExpTableFormProps {
  initialData?: Partial<ExpTableRow>;
  onSubmit: (data: ExpTableFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  tblidx?: number;
}

function ExpTableForm({ initialData, onSubmit, onCancel, isEdit, tblidx }: ExpTableFormProps) {
  const form = useForm<ExpTableFormData>({
    resolver: zodResolver(expTableSchema),
    defaultValues: {
      table_id: initialData?.table_id || '',
      tblidx: initialData?.tblidx || tblidx || 0,
      dwExp: initialData?.dwExp || 0,
      dwNeed_Exp: initialData?.dwNeed_Exp || 0,
      wStageWinSolo: initialData?.wStageWinSolo || 0,
      wStageDrawSolo: initialData?.wStageDrawSolo || 0,
      wStageLoseSolo: initialData?.wStageLoseSolo || 0,
      wWinSolo: initialData?.wWinSolo || 0,
      wPerfectWinSolo: initialData?.wPerfectWinSolo || 0,
      wStageWinTeam: initialData?.wStageWinTeam || 0,
      wStageDrawTeam: initialData?.wStageDrawTeam || 0,
      wStageLoseTeam: initialData?.wStageLoseTeam || 0,
      wWinTeam: initialData?.wWinTeam || 0,
      wPerfectWinTeam: initialData?.wPerfectWinTeam || 0,
      wNormal_Race: initialData?.wNormal_Race || 0,
      wSuperRace: initialData?.wSuperRace || 0,
      dwMobExp: initialData?.dwMobExp || 0,
      dwPhyDefenceRef: initialData?.dwPhyDefenceRef || 0,
      dwEngDefenceRef: initialData?.dwEngDefenceRef || 0,
      dwMobZenny: initialData?.dwMobZenny || 0,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Hidden table_id field */}
        <FormField
          control={form.control}
          name="table_id"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />

        {/* Basic Info Section */}
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            <Separator className="flex-grow ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="tblidx"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Table ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      placeholder="Enter Table ID"
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dwExp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      placeholder="Enter Experience"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dwNeed_Exp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Required Experience</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      placeholder="Enter Required Experience"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solo Stats Section */}
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Solo Statistics</h3>
              <Separator className="flex-grow ml-4" />
            </div>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="wStageWinSolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Stage Wins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wStageDrawSolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage Draws</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Stage Draws"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wStageLoseSolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage Losses</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Stage Losses"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wWinSolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Total Wins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wPerfectWinSolo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Perfect Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Perfect Wins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Team Stats Section */}
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Team Statistics</h3>
              <Separator className="flex-grow ml-4" />
            </div>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="wStageWinTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Stage Wins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wStageDrawTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage Draws</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Stage Draws"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wStageLoseTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Stage Losses</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Stage Losses"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wWinTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Total Wins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wPerfectWinTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Perfect Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Perfect Wins"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Other Stats Section */}
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 space-y-6 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Other Statistics</h3>
              <Separator className="flex-grow ml-4" />
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wNormal_Race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Normal Race</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          placeholder="Enter Count"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wSuperRace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Super Race</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          placeholder="Enter Count"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dwMobExp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Mob Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Mob Experience"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dwPhyDefenceRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Physical Defence</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Physical Defence"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dwEngDefenceRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Defence</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Energy Defence"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dwMobZenny"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Mob Zenny</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Enter Mob Zenny"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-all duration-200"
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Column definitions for the exp table
const EXP_COLUMNS = [
  { key: 'tblidx', label: 'Table Index' },
  { key: 'dwExp', label: 'Experience' },
  { key: 'dwNeed_Exp', label: 'Required Exp' },
  { key: 'wStageWinSolo', label: 'Stage Wins (Solo)' },
  { key: 'wStageDrawSolo', label: 'Stage Draws (Solo)' },
  { key: 'wStageLoseSolo', label: 'Stage Losses (Solo)' },
  { key: 'wWinSolo', label: 'Wins (Solo)' },
  { key: 'wPerfectWinSolo', label: 'Perfect Wins (Solo)' },
  { key: 'wStageWinTeam', label: 'Stage Wins (Team)' },
  { key: 'wStageDrawTeam', label: 'Stage Draws (Team)' },
  { key: 'wStageLoseTeam', label: 'Stage Losses (Team)' },
  { key: 'wWinTeam', label: 'Wins (Team)' },
  { key: 'wPerfectWinTeam', label: 'Perfect Wins (Team)' },
  { key: 'wNormal_Race', label: 'Normal Race' },
  { key: 'wSuperRace', label: 'Super Race' },
  { key: 'dwMobExp', label: 'Mob Experience' },
  { key: 'dwPhyDefenceRef', label: 'Physical Defence' },
  { key: 'dwEngDefenceRef', label: 'Energy Defence' },
  { key: 'dwMobZenny', label: 'Mob Zenny' },
];

interface ExpTableRow {
  id: string;
  table_id: string;
  tblidx: number;
  dwExp: number;
  dwNeed_Exp: number;
  wStageWinSolo: number;
  wStageDrawSolo: number;
  wStageLoseSolo: number;
  wWinSolo: number;
  wPerfectWinSolo: number;
  wStageWinTeam: number;
  wStageDrawTeam: number;
  wStageLoseTeam: number;
  wWinTeam: number;
  wPerfectWinTeam: number;
  wNormal_Race: number;
  wSuperRace: number;
  dwMobExp: number;
  dwPhyDefenceRef: number;
  dwEngDefenceRef: number;
  dwMobZenny: number;
}

export default function ExpTablePage() {
  const [data, setData] = useState<ExpTableRow[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ExpTableRow | null>(null);
  const [nextTableId, setNextTableId] = useState<number>(1);
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id');

  useEffect(() => {
    if (!tableId) {
      setError('No table ID provided');
      setLoading(false);
      return;
    }

    setCurrentTableId(tableId);
    fetchData(tableId);
  }, [tableId]);

  // Fetch data on component mount
  const fetchData = async (id: string) => {
    const { data: expData, error } = await supabase
      .from('exp_table')
      .select('*')
      .eq('table_id', id)
      .order('tblidx');

    if (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setLoading(false);
      return;
    }

    setData(expData);
    
    // Set next table ID
    if (expData.length > 0) {
      const maxTblidx = Math.max(...expData.map(row => row.tblidx));
      setNextTableId(maxTblidx + 1);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      const parsedData = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim();
          return obj;
        }, {} as any);
      });

      // TODO: Validate and transform the data before setting
      setData(parsedData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleAddRow = async (formData: ExpTableFormData) => {
    if (!currentTableId) {
      setError('No table ID found');
      return;
    }

    const { data: newRow, error } = await supabase
      .from('exp_table')
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error('Error adding row:', error);
      setError('Failed to add row');
      return;
    }

    setData([...data, newRow]);
    setIsAddDialogOpen(false);
  };

  const handleEditRow = async (formData: ExpTableFormData) => {
    if (!selectedRow) {
      setError('No row selected for editing');
      return;
    }

    const { data: updatedRow, error } = await supabase
      .from('exp_table')
      .update(formData)
      .eq('id', selectedRow.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating row:', error);
      setError('Failed to update row');
      return;
    }

    setData(data.map(row => row.id === selectedRow.id ? updatedRow : row));
    setIsEditDialogOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 dark:text-red-400">
              {error}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Experience Table
                  </h2>
                  <div className="flex items-center space-x-4">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Row
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Row</DialogTitle>
                          <DialogDescription>
                            Add a new row to the experience table. Table ID will be {nextTableId}.
                          </DialogDescription>
                        </DialogHeader>
                        <ExpTableForm
                          onSubmit={handleAddRow}
                          onCancel={() => setIsAddDialogOpen(false)}
                          tblidx={nextTableId}
                          initialData={{ table_id: currentTableId || '' }}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {EXP_COLUMNS.map((column) => (
                            <th
                              key={column.key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {column.label}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            {EXP_COLUMNS.map((column) => (
                              <td
                                key={column.key}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                              >
                                {row[column.key as keyof ExpTableRow]}
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setSelectedRow(row);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No data</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by adding a row or importing data
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
            <DialogDescription>
              Edit the values for table ID {selectedRow?.tblidx}.
            </DialogDescription>
          </DialogHeader>
          <ExpTableForm
            initialData={{ ...selectedRow, table_id: currentTableId || '' }}
            onSubmit={handleEditRow}
            onCancel={() => setIsEditDialogOpen(false)}
            isEdit
            tblidx={selectedRow?.tblidx}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 