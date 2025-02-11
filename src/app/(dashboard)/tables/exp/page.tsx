'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Plus, Edit, ExternalLink, MoreVertical, RefreshCcw, Copy, Trash2, Search, X, Filter } from 'lucide-react';
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
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="table_id"
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />

        <ScrollArea className="h-[600px] pr-4">
          <Card className="border border-gray-200 dark:border-0 bg-white dark:bg-gray-950/50 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">Basic Information</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Enter the basic details for this experience entry
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-6 pt-6 bg-white dark:bg-transparent">
              <FormField
                control={form.control}
                name="tblidx"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table ID</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="Enter Tblidx"
                        className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="Enter Exp"
                        className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                    <FormLabel>Required Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="Enter Required Exp"
                        className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator className="my-6 bg-gray-200 dark:bg-gray-800" />

          <Tabs defaultValue="solo" className="w-full">
            <TabsList className="w-full grid grid-cols-3 gap-4 bg-gray-100 dark:bg-gray-950/50 p-1 rounded-lg">
              <TabsTrigger 
                value="solo"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-500/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-800/50"
              >
                Solo Statistics
              </TabsTrigger>
              <TabsTrigger 
                value="team"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-500/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-800/50"
              >
                Team Statistics
              </TabsTrigger>
              <TabsTrigger 
                value="other"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-500/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white rounded-md transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-800/50"
              >
                Other Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solo">
              <Card className="border border-gray-200 dark:border-0 bg-white dark:bg-gray-950/50 backdrop-blur-xl shadow-xl">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">Solo Statistics</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Configure statistics for solo gameplay
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 pt-6 bg-white dark:bg-transparent">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wStageWinSolo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stage Wins</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Stage Wins"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Stage Draws</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Stage Draws"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wStageLoseSolo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stage Losses</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Stage Losses"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Total Wins</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Total Wins"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="wPerfectWinSolo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfect Wins</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="Enter Perfect Wins"
                            className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card className="border border-gray-200 dark:border-0 bg-white dark:bg-gray-950/50 backdrop-blur-xl shadow-xl">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">Team Statistics</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Configure statistics for team gameplay
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 pt-6 bg-white dark:bg-transparent">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wStageWinTeam"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stage Wins</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Stage Wins"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Stage Draws</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Stage Draws"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wStageLoseTeam"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stage Losses</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Stage Losses"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Total Wins</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Total Wins"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="wPerfectWinTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfect Wins</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="Enter Perfect Wins"
                            className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="other">
              <Card className="border border-gray-200 dark:border-0 bg-white dark:bg-gray-950/50 backdrop-blur-xl shadow-xl">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">Other Statistics</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Configure additional game statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 pt-6 bg-white dark:bg-transparent">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wNormal_Race"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Normal Race</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Count"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Super Race</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Count"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dwMobExp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mob Experience</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Mob Experience"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Physical Defence</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Physical Defence"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dwEngDefenceRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Energy Defence</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Energy Defence"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <FormLabel>Mob Zenny</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Enter Mob Zenny"
                              className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors"
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
  { key: 'tblidx', label: 'Tblidx' },
  { key: 'dwExp', label: 'Exp' },
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

// Add ColumnFilter interface
interface ColumnFilter {
  operator: 'contains' | 'equals' | 'greater' | 'less';
  value: string;
}

interface ColumnFilters {
  [key: string]: ColumnFilter;
}

export default function ExpTablePage() {
  const [data, setData] = useState<ExpTableRow[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ExpTableRow | null>(null);
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [rowToDuplicate, setRowToDuplicate] = useState<ExpTableRow | null>(null);
  const [filters, setFilters] = useState<ColumnFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<ColumnFilters>({});

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

  const handleDeleteRows = async () => {
    if (selectedRows.size === 0) return;

    const { error } = await supabase
      .from('exp_table')
      .delete()
      .in('id', Array.from(selectedRows));

    if (error) {
      console.error('Error deleting rows:', error);
      setError('Failed to delete rows');
      return;
    }

    setData(data.filter(row => !selectedRows.has(row.id)));
    setSelectedRows(new Set());
  };

  const handleDuplicateRow = async (formData: ExpTableFormData) => {
    const { data: newRow, error } = await supabase
      .from('exp_table')
      .insert([{ ...formData, table_id: currentTableId || '' }])
      .select()
      .single();

    if (error) {
      console.error('Error duplicating row:', error);
      setError('Failed to duplicate row');
      return;
    }

    setData([...data, newRow]);
    setIsDuplicateDialogOpen(false);
    setRowToDuplicate(null);
  };

  const getPermissionBadges = () => (
    <div className="flex space-x-2">
      <span className="px-2 py-1 text-xs font-medium rounded bg-emerald-900/50 text-emerald-400">GET</span>
      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-900/50 text-blue-400">PUT</span>
      <span className="px-2 py-1 text-xs font-medium rounded bg-amber-900/50 text-amber-400">POST</span>
      <span className="px-2 py-1 text-xs font-medium rounded bg-red-900/50 text-red-400">DELETE</span>
    </div>
  );

  // Add useEffect for debouncing filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  // Add filtered data logic
  const filteredData = React.useMemo(() => {
    return data.filter(row => {
      return Object.entries(debouncedFilters).every(([key, filter]) => {
        if (!filter.value) return true;
        const cellValue = String(row[key as keyof ExpTableRow]).toLowerCase();
        const filterValue = filter.value.toLowerCase();
        
        switch (filter.operator) {
          case 'contains':
            return cellValue.includes(filterValue);
          case 'equals':
            return cellValue === filterValue;
          case 'greater':
            return Number(cellValue) > Number(filterValue);
          case 'less':
            return Number(cellValue) < Number(filterValue);
          default:
            return true;
        }
      });
    });
  }, [data, debouncedFilters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experience Table</h2>
            <div className="flex items-center space-x-4">
              {selectedRows.size > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteRows}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete Selected ({selectedRows.size})
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="relative h-8 w-8 p-0 border-gray-200 dark:border-gray-700"
                  >
                    <Filter className="h-4 w-4" />
                    {Object.keys(filters).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {Object.keys(filters).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="end">
                  <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Filters</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add filters to refine table data</p>
                      </div>
                      {Object.keys(filters).length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFilters({})}
                          className="h-8 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="max-h-[300px] p-4">
                    <div className="space-y-4">
                      {Object.entries(filters).map(([key, filter]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Select
                              value={key}
                              onValueChange={(value) => {
                                const newFilters = { ...filters };
                                delete newFilters[key];
                                newFilters[value] = filter;
                                setFilters(newFilters);
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select column" />
                              </SelectTrigger>
                              <SelectContent>
                                {EXP_COLUMNS.map((col) => (
                                  <SelectItem key={col.key} value={col.key}>{col.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={filter.operator}
                              onValueChange={(value) => {
                                setFilters(prev => ({
                                  ...prev,
                                  [key]: {
                                    ...filter,
                                    operator: value as ColumnFilter['operator']
                                  }
                                }));
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="greater">Greater than</SelectItem>
                                <SelectItem value="less">Less than</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters[key];
                                setFilters(newFilters);
                              }}
                              className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                            <input
                              type="text"
                              value={filter.value}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  [key]: {
                                    ...filter,
                                    value: e.target.value
                                  }
                                }));
                              }}
                              placeholder="Enter value"
                              className="h-9 w-full rounded-md border border-gray-200 bg-white/80 pl-9 pr-3 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-100 dark:placeholder:text-gray-400 dark:hover:bg-gray-800/50"
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const unusedColumns = EXP_COLUMNS.filter(col => !filters[col.key]);
                          if (unusedColumns.length > 0) {
                            setFilters(prev => ({
                              ...prev,
                              [unusedColumns[0].key]: {
                                operator: 'contains',
                                value: ''
                              }
                            }));
                          }
                        }}
                        disabled={Object.keys(filters).length === EXP_COLUMNS.length}
                        className="w-full border-dashed border-gray-200 bg-transparent hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                      >
                        Add Filter
                      </Button>
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Add New Row</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                      Add a new row to the experience table. Please enter the Table ID manually.
                    </DialogDescription>
                  </DialogHeader>
                  <ExpTableForm
                    onSubmit={handleAddRow}
                    onCancel={() => setIsAddDialogOpen(false)}
                    initialData={{ table_id: currentTableId || '' }}
                  />
                </DialogContent>
              </Dialog>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fetchData(currentTableId || '')}
                className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="sticky left-0 z-50 bg-gray-50 dark:bg-gray-900 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-900 dark:checked:bg-indigo-600"
                          checked={selectedRows.size === data.length && data.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(new Set(data.map(row => row.id)));
                            } else {
                              setSelectedRows(new Set());
                            }
                          }}
                        />
                      </th>
                      {EXP_COLUMNS.map((column) => (
                        <th
                          key={column.key}
                          className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {column.label}
                        </th>
                      ))}
                      <th className="sticky right-0 bg-gray-50 dark:bg-gray-900 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="sticky left-0 bg-white dark:bg-gray-800 px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-900 dark:checked:bg-indigo-600"
                            checked={selectedRows.has(row.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedRows);
                              if (e.target.checked) {
                                newSelected.add(row.id);
                              } else {
                                newSelected.delete(row.id);
                              }
                              setSelectedRows(newSelected);
                            }}
                          />
                        </td>
                        {EXP_COLUMNS.map((column) => (
                          <td
                            key={column.key}
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                          >
                            {row[column.key as keyof ExpTableRow]}
                          </td>
                        ))}
                        <td className="sticky right-0 bg-white dark:bg-gray-800 px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRowToDuplicate(row);
                                setIsDuplicateDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRow(row);
                                setIsEditDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                const { error } = await supabase
                                  .from('exp_table')
                                  .delete()
                                  .eq('id', row.id);

                                if (error) {
                                  console.error('Error deleting row:', error);
                                  setError('Failed to delete row');
                                  return;
                                }

                                setData(data.filter(r => r.id !== row.id));
                              }}
                              className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">
              Edit Row
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Edit the values for tblidx {selectedRow?.tblidx}.
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

      {/* Duplicate Dialog */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">
              Duplicate Row
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Create a new row with the same values as tblidx {rowToDuplicate?.tblidx}.
              You can modify any values before creating the new row.
            </DialogDescription>
          </DialogHeader>
          {rowToDuplicate && (
            <ExpTableForm
              initialData={{ ...rowToDuplicate, table_id: currentTableId || '' }}
              onSubmit={handleDuplicateRow}
              onCancel={() => {
                setIsDuplicateDialogOpen(false);
                setRowToDuplicate(null);
              }}
              isEdit={false}
              tblidx={rowToDuplicate.tblidx}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 