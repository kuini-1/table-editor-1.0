'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Plus, Edit, ExternalLink, MoreVertical, Copy, Trash2, Search, X, Filter, RefreshCcw, ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, Download } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { useSearchParams, useRouter } from 'next/navigation';
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
import { toast, Toaster } from "sonner";
import { useStore } from '@/lib/store';
import type { DatabaseTable, Table, SubOwnerPermission } from '../page';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

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
  const searchParams = useSearchParams();
  const tableId = searchParams.get('id');

  const form = useForm<ExpTableFormData>({
    resolver: zodResolver(expTableSchema),
    defaultValues: {
      table_id: initialData?.table_id || tableId || '',
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

  // Set table_id when component mounts
  useEffect(() => {
    if (tableId) {
      form.setValue('table_id', tableId);
    }
  }, [tableId]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <FormField
            control={form.control}
            name="table_id"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          <ScrollArea className="pr-4">
            <Card className="border border-gray-200 dark:border-0 bg-white dark:bg-gray-950/50 backdrop-blur-xl">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:bg-clip-text">Basic Information</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Enter the basic details for this experience entry
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 bg-white dark:bg-transparent">
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
              <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 bg-transparent">
                <TabsTrigger 
                  value="solo"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-900/50 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                >
                  Solo Statistics
                </TabsTrigger>
                <TabsTrigger 
                  value="team"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-900/50 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                >
                  Team Statistics
                </TabsTrigger>
                <TabsTrigger 
                  value="other"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 dark:data-[state=active]:shadow-indigo-900/50 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
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
        </div>

        <div className="sticky bottom-0 px-6 py-4 rounded-lg bg-white dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 dark:shadow-indigo-900/50 transition-all duration-200"
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

// Column definitions for the exp table
const EXP_COLUMNS = [
  { key: 'tblidx', label: 'Table ID' },
  { key: 'dwExp', label: 'Experience' },
  { key: 'dwNeed_Exp', label: 'Required Exp' },
  { key: 'wStageWinSolo', label: 'Stage Win Solo' },
  { key: 'wStageDrawSolo', label: 'Stage Draw Solo' },
  { key: 'wStageLoseSolo', label: 'Stage Lose Solo' },
  { key: 'wWinSolo', label: 'Win Solo' },
  { key: 'wPerfectWinSolo', label: 'Perfect Win Solo' },
  { key: 'wStageWinTeam', label: 'Stage Win Team' },
  { key: 'wStageDrawTeam', label: 'Stage Draw Team' },
  { key: 'wStageLoseTeam', label: 'Stage Lose Team' },
  { key: 'wWinTeam', label: 'Win Team' },
  { key: 'wPerfectWinTeam', label: 'Perfect Win Team' },
  { key: 'wNormal_Race', label: 'Normal Race' },
  { key: 'wSuperRace', label: 'Super Race' },
  { key: 'dwMobExp', label: 'Mob Exp' },
  { key: 'dwPhyDefenceRef', label: 'Phy Defence Ref' },
  { key: 'dwEngDefenceRef', label: 'Eng Defence Ref' },
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

interface SubOwnerPermissions {
  can_get: boolean;
  can_put: boolean;
  can_post: boolean;
  can_delete: boolean;
}

export default function ExpTablePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [subAccounts, setSubAccounts] = useState<SubOwnerPermission[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ExpTableRow | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [rowToDuplicate, setRowToDuplicate] = useState<ExpTableRow | null>(null);
  const [filters, setFilters] = useState<ColumnFilters>({});
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [operator, setOperator] = useState<ColumnFilter['operator']>('contains');
  const [value, setValue] = useState('');
  const [tableId, setTableId] = useState<string | null>(null);
  const [rowToDelete, setRowToDelete] = useState<ExpTableRow | null>(null);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(50);

  // Get state and actions from store
  const {
    userProfile,
    permissions,
    tableData,
    fetchUserProfile,
    fetchTablePermissions,
    setTableData,
    clearTableData
  } = useStore();

  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get cached table data
  const currentTableData = tableId ? tableData[tableId] : null;
  const page = currentTableData?.page || 1;
  const pageSize = currentTableData?.pageSize || 50;
  const totalRows = currentTableData?.totalRows || 0;
  const data = currentTableData?.data || [];

  // Column labels mapping
  const columnLabels = Object.fromEntries(
    EXP_COLUMNS.map(col => [col.key, col.label])
  );

  // Initialize data and fetch permissions
  useEffect(() => {
    const initializeData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('id');
      if (!id) return;

      setTableId(id);
      await fetchTablePermissions(id);
      await fetchData(id);
    };

    initializeData();
  }, []);

  // Effect for filter changes
  useEffect(() => {
    if (!tableId) return;
    fetchData(tableId);
  }, [filters, tableId, currentPage, currentPageSize]);

  const handleColumnChange = (newColumn: string) => {
    setSelectedColumn(newColumn);
  };

  const handleAddFilter = async () => {
    if (!selectedColumn || !value.trim() || !tableId) return;

    try {
      setLoading(true);
      
      // Create new filters object
      const newFilters = {
        ...filters,
        [selectedColumn]: {
          operator,
          value: value.trim()
        }
      };

      // Update filters state
      setFilters(newFilters);
      
      // Clear the filter form
      setSelectedColumn('');
      setOperator('contains');
      setValue('');
      
    } catch (err: any) {
      console.error('Error applying filter:', err);
      toast.error(err.message || 'Failed to apply filter');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFilter = async (column: string) => {
    if (!tableId) return;
    
    try {
      setLoading(true);
      const { [column]: _, ...rest } = filters;
      setFilters(rest);
      
      // Fetch data with updated filters
      await fetchData(tableId, rest);
    } catch (err: any) {
      console.error('Error removing filter:', err);
      toast.error(err.message || 'Failed to remove filter');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (id: string, currentFilters = filters) => {
    try {
      setLoading(true);

      // Get authenticated user data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw new Error('Failed to authenticate user');
      }

      // Fetch user profile if not already loaded
      if (!userProfile) {
        await fetchUserProfile();
      }

      const isOwner = userProfile?.data?.role === 'owner';
      
      // Only check permissions if not owner
      if (!isOwner && !permissions[id]?.can_get) {
        throw new Error('You do not have permission to view this table');
      }

      let query = supabase
        .from('exp_table')
        .select('*', { count: 'exact' })
        .eq('table_id', id)
        .range((currentPage - 1) * currentPageSize, (currentPage * currentPageSize) - 1);

      // Apply filters
      for (const [column, filter] of Object.entries(currentFilters)) {
        const numericColumns = ['tblidx', 'dwExp', 'dwNeed_Exp', 'wStageWinSolo', 'wStageDrawSolo', 'wStageLoseSolo', 
          'wWinSolo', 'wPerfectWinSolo', 'wStageWinTeam', 'wStageDrawTeam', 'wStageLoseTeam', 'wWinTeam', 
          'wPerfectWinTeam', 'wNormal_Race', 'wSuperRace', 'dwMobExp', 'dwPhyDefenceRef', 'dwEngDefenceRef', 'dwMobZenny'];
        
        const value = filter.value.trim();
        const isNumericColumn = numericColumns.includes(column);
        
        if (!value) continue;

        if (isNumericColumn) {
          const numValue = Number(value);
          if (isNaN(numValue)) continue;

          switch (filter.operator) {
            case 'equals':
              query = query.eq(column, numValue);
              break;
            case 'greater':
              query = query.gt(column, numValue);
              break;
            case 'less':
              query = query.lt(column, numValue);
              break;
            case 'contains': {
              // For numeric columns, use RPC function for partial number search
              const { data: matchingRows, error: rpcError } = await supabase.rpc('search_partial_number', {
                table_name: 'exp_table',
                column_name: column,
                search_value: value
              });
              if (rpcError) {
                console.error('Error in partial number search:', rpcError);
                continue;
              }
              if (matchingRows && matchingRows.length > 0) {
                // Since RPC now returns full rows, we need to filter by matching IDs
                const matchingIds = matchingRows.map((row: any) => row.id);
                if (matchingIds.length > 0) {
                  query = query.in('id', matchingIds);
                }
              }
              break;
            }
          }
        } else {
          switch (filter.operator) {
            case 'equals':
              query = query.eq(column, value);
              break;
            case 'contains':
              query = query.ilike(column, `%${value}%`);
              break;
            case 'greater':
              query = query.gt(column, value);
              break;
            case 'less':
              query = query.lt(column, value);
              break;
          }
        }
      }

      const { data: rows, error, count } = await query;

      if (error) throw error;

      // Update table data in store
      setTableData(id, {
        data: rows || [],
        totalRows: count || 0,
        lastFetched: Date.now(),
        filters: currentFilters,
        page: currentPage,
        pageSize: currentPageSize
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async (formData: ExpTableFormData) => {
    if (!tableId) {
      toast.error('No table ID found. Please ensure you are on the correct page.');
      return;
    }

    try {
      if (!permissions[tableId]?.can_post) {
        toast.error('You do not have permission to add rows');
        return;
      }

      // Check if tblidx already exists
      const { count } = await supabase
        .from('exp_table')
        .select('*', { count: 'exact', head: true })
        .eq('tblidx', formData.tblidx)
        .eq('table_id', tableId);

      if (count && count > 0) {
        toast.error(`Row with tblidx ${formData.tblidx} already exists`);
        return;
      }

      const { data: newRow, error } = await supabase
        .from('exp_table')
        .insert([{ ...formData, table_id: tableId }])
        .select()
        .single();

      if (error) {
        console.error('Error adding row:', error);
        toast.error(error.message || 'Failed to add row');
        return;
      }

      // Optimistically update the store
      const updatedTableData = currentTableData || {
        data: [],
        totalRows: 0,
        lastFetched: Date.now(),
        filters: filters,
        page,
        pageSize,
      };

      setTableData(tableId, {
        ...updatedTableData,
        data: [...updatedTableData.data, newRow],
        totalRows: updatedTableData.totalRows + 1,
        lastFetched: Date.now(),
      });

      setIsAddDialogOpen(false);
      toast.success('Row added successfully');
    } catch (err: any) {
      console.error('Error adding row:', err);
      toast.error(err.message || 'Failed to add row');
    }
  };

  const handleEditRow = async (formData: ExpTableFormData) => {
    if (!tableId || !selectedRow) {
      toast.error('No table or row selected');
      return;
    }

    try {
      if (!permissions[tableId]?.can_put) {
        throw new Error('You do not have permission to edit rows');
      }

      const { data: updatedRow, error } = await supabase
        .from('exp_table')
        .update(formData)
        .eq('id', selectedRow.id)
        .select()
        .single();

      if (error) throw error;

      // Get current table data or initialize if not exists
      const updatedTableData = currentTableData || {
        data: [],
        totalRows: 0,
        lastFetched: Date.now(),
        filters: filters,
        page,
        pageSize,
      };

      setTableData(tableId, {
        ...updatedTableData,
        data: updatedTableData.data.map(row => row.id === selectedRow.id ? updatedRow : row),
        lastFetched: Date.now(),
      });
      setIsEditDialogOpen(false);
      setSelectedRow(null);
      toast.success('Row updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update row');
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    if (!tableId) {
      toast.error('No table ID found');
      return;
    }

    try {
      if (!permissions[tableId]?.can_delete) {
        throw new Error('You do not have permission to delete rows');
      }

      const { error } = await supabase
        .from('exp_table')
        .delete()
        .eq('id', rowId);

      if (error) throw error;

      // Get current table data or initialize if not exists
      const updatedTableData = currentTableData || {
        data: [],
        totalRows: 0,
        lastFetched: Date.now(),
        filters: filters,
        page,
        pageSize,
      };

      setTableData(tableId, {
        ...updatedTableData,
        data: updatedTableData.data.filter(r => r.id !== rowId),
        totalRows: updatedTableData.totalRows - 1,
        lastFetched: Date.now(),
      });
      setRowToDelete(null);
      toast.success('Row deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete row');
    }
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const deletePromises = Array.from(selectedRows).map(id =>
        supabase
          .from('exp_table')
          .delete()
          .eq('id', id)
      );

      const results = await Promise.all(deletePromises);
      const errors = results.filter(result => result.error).map(result => result.error);

      if (errors.length > 0) {
        throw new Error(`Failed to delete some rows: ${errors.map(e => e?.message || 'Unknown error').join(', ')}`);
      }

      // Clear selected rows and refresh data
      setSelectedRows(new Set());
      setIsBulkDeleteDialogOpen(false);
      await fetchData(tableId || '');
      toast.success('Selected rows deleted successfully');
    } catch (err: any) {
      console.error('Error deleting rows:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateRow = async (formData: ExpTableFormData) => {
    if (!tableId || !rowToDuplicate) {
      toast.error('No row selected for duplication');
      return;
    }

    try {
      if (!permissions[tableId]?.can_post) {
        throw new Error('You do not have permission to duplicate rows');
      }

      // Check if tblidx already exists
      const { count } = await supabase
        .from('exp_table')
        .select('*', { count: 'exact', head: true })
        .eq('tblidx', formData.tblidx)
        .eq('table_id', tableId);

      if (count && count > 0) {
        toast.error(`Row with tblidx ${formData.tblidx} already exists`);
        return;
      }

      const { data: newRow, error } = await supabase
        .from('exp_table')
        .insert([{ ...formData, table_id: tableId }])
        .select()
        .single();

      if (error) throw error;

      // Get current table data or initialize if not exists
      const updatedTableData = currentTableData || {
        data: [],
        totalRows: 0,
        lastFetched: Date.now(),
        filters: filters,
        page,
        pageSize,
      };

      setTableData(tableId, {
        ...updatedTableData,
        data: [...updatedTableData.data, newRow],
        totalRows: updatedTableData.totalRows + 1,
        lastFetched: Date.now(),
      });
      setIsDuplicateDialogOpen(false);
      setRowToDuplicate(null);
      toast.success('Row duplicated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to duplicate row');
    }
  };

  const getPermissionBadges = () => (
    <div className="flex space-x-2">
      <span className="px-2 py-1 text-xs font-medium rounded bg-emerald-900/50 text-emerald-400">GET</span>
      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-900/50 text-blue-400">PUT</span>
      <span className="px-2 py-1 text-xs font-medium rounded bg-amber-900/50 text-amber-400">POST</span>
      <span className="px-2 py-1 text-xs font-medium rounded bg-red-900/50 text-red-400">DELETE</span>
    </div>
  );

  // Remove client-side filtering
  const filteredData = data;

  // Add pagination UI component
  const Pagination = () => {
    const totalPages = Math.ceil(totalRows / pageSize);
    const canPreviousPage = page > 1;
    const canNextPage = page < totalPages;

    return (
      <div className="sticky bottom-0 right-0 flex items-center justify-between gap-2 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rows per page
          </p>
          <Select
            value={currentPageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={currentPageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRows / currentPageSize)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.ceil(totalRows / currentPageSize))}
              disabled={currentPage >= Math.ceil(totalRows / currentPageSize)}
              className="h-8 w-8 p-0"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          tableName: 'exp_table'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Export failed');
      }

      if (data.success) {
        toast.success('Export completed successfully');
        // Optionally trigger download
        window.open(data.downloadUrl, '_blank');
      } else {
        throw new Error('Export failed without error');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export data');
    }
  };

  const handleImport = async (file: File) => {
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tableId', tableId || '');
      formData.append('tableName', 'exp_table');

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Import failed');
      }

      if (data.success) {
        toast.success('Import completed successfully');
        // Refresh the table data
        fetchData(tableId || '');
      } else {
        throw new Error('Import failed without error');
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import data');
    }
  };

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      setCurrentPage(newPage);
      
      // Update the store immediately
      if (tableId && currentTableData) {
        setTableData(tableId, {
          ...currentTableData,
          page: newPage
        });
      }
    } catch (error: any) {
      console.error('Error changing page:', error);
      toast.error(error.message || 'Failed to change page');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = async (newSize: number) => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset to first page
      setCurrentPageSize(newSize);
      
      // Update the store immediately with new page size
      if (tableId && currentTableData) {
        setTableData(tableId, {
          ...currentTableData,
          page: 1,
          pageSize: newSize
        });
      }
    } catch (error: any) {
      console.error('Error changing page size:', error);
      toast.error(error.message || 'Failed to update page size');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="flex h-16 items-center gap-4 px-4">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Experience Table
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage and configure experience points and statistics
              </p>
            </div>
            <div className="flex items-center gap-4">
              {selectedRows.size > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedRows.size})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".rdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setFileToImport(file);
                  setIsImportDialogOpen(true);
                }}
              />
              {data.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                    {Object.keys(filters).length > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-medium text-white">
                        {Object.keys(filters).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-4">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <h4 className="font-medium">Filter Data</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add filters to refine the table data
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Select
                        value={selectedColumn}
                        onValueChange={handleColumnChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          <ScrollArea className="h-[200px]">
                            {Object.entries(columnLabels)
                              .filter(([key]) => !filters[key])
                              .map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>

                      <Select
                        value={operator}
                        onValueChange={(value) => setOperator(value as ColumnFilter['operator'])}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="greater">Greater than</SelectItem>
                          <SelectItem value="less">Less than</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Enter value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button 
                      onClick={handleAddFilter}
                      className="w-full"
                      disabled={!selectedColumn || !operator || !value}
                    >
                      Add Filter
                    </Button>
                    {Object.keys(filters).length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Active Filters</div>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(filters).map(([column, filter]) => (
                            <Badge
                              key={column}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <span>{columnLabels[column]}</span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {filter.operator}
                              </span>
                              <span>{filter.value}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemoveFilter(column)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove filter</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                onClick={() => fetchData(tableId || '')}
                className="gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white dark:text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-900/50 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
          <div className="overflow-x-auto">
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      <th className="sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left">
                        <Checkbox
                          checked={data.length > 0 && selectedRows.size === data.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRows(new Set(data.map(row => row.id)));
                            } else {
                              setSelectedRows(new Set());
                            }
                          }}
                          aria-label="Select all"
                        />
                      </th>
                      {EXP_COLUMNS.map((column) => (
                        <th
                          key={column.key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {column.label}
                        </th>
                      ))}
                      <th className="sticky right-0 z-20 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {data.map((row) => (
                      <tr 
                        key={row.id} 
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="sticky left-0 z-20 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 px-4 py-3">
                          <Checkbox
                            checked={selectedRows.has(row.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedRows);
                              if (checked) {
                                newSelected.add(row.id);
                              } else {
                                newSelected.delete(row.id);
                              }
                              setSelectedRows(newSelected);
                            }}
                            aria-label={`Select row ${row.tblidx}`}
                          />
                        </td>
                        {EXP_COLUMNS.map((column) => (
                          <td
                            key={column.key}
                            className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
                          >
                            {row[column.key as keyof ExpTableRow]}
                          </td>
                        ))}
                        <td className="sticky right-0 z-20 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRowToDuplicate(row);
                                setIsDuplicateDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setRowToDelete(row)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
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
              <Pagination />
            </div>
          </div>
        </div>
      </div>

      {/* Add Row Sheet */}
      <Sheet open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <SheetContent side="right" className="w-[95%] sm:w-[90%] md:w-[1200px] p-0">
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <SheetHeader>
                <SheetTitle>Add New Row</SheetTitle>
                <SheetDescription>
                  Add a new row to the experience table.
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ExpTableForm
                onSubmit={handleAddRow}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Row Sheet */}
      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SheetContent side="right" className="w-[95%] sm:w-[90%] md:w-[1200px] p-0">
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <SheetHeader>
                <SheetTitle>Edit Row</SheetTitle>
                <SheetDescription>
                  Edit the selected row in the experience table.
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ExpTableForm
                initialData={selectedRow || undefined}
                onSubmit={handleEditRow}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedRow(null);
                }}
                isEdit
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Duplicate Row Sheet */}
      <Sheet open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <SheetContent side="right" className="w-[95%] sm:w-[90%] md:w-[1200px] p-0">
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <SheetHeader>
                <SheetTitle>Duplicate Row</SheetTitle>
                <SheetDescription>
                  Create a new row based on the selected row.
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {rowToDuplicate && (
                <ExpTableForm
                  initialData={{
                    ...rowToDuplicate,
                    tblidx: rowToDuplicate.tblidx + 1
                  }}
                  onSubmit={handleDuplicateRow}
                  onCancel={() => {
                    setIsDuplicateDialogOpen(false);
                    setRowToDuplicate(null);
                  }}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={rowToDelete !== null} onOpenChange={(open) => !open && setRowToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this row? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setRowToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => rowToDelete && handleDeleteRow(rowToDelete.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.size} selected row{selectedRows.size !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <AlertDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Import</AlertDialogTitle>
            <AlertDialogDescription>
              This action will replace all existing data in the current table with the data from the imported file. 
              This cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFileToImport(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (fileToImport) {
                  await handleImport(fileToImport);
                  setFileToImport(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
} 