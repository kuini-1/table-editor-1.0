"use client";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export interface QuickViewField {
  key: string;
  label: string;
  value: any;
  type?: 'text' | 'number' | 'boolean';
}

export interface QuickViewSection {
  title: string;
  fields: QuickViewField[];
}

export interface TabSection {
  label: string;
  fields: ReactNode[];
}

export interface FormTab {
  id: string;
  label: string;
  sections: TabSection[];
}

interface ModernFormLayoutProps {
  quickViewSections?: QuickViewSection[];
  tabs?: FormTab[];
  defaultTab?: string;
  stats?: Array<{ label: string; value: any; color?: string }>;
  children?: ReactNode;
  onCancel?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  mode?: 'add' | 'edit' | 'duplicate';
}

export function ModernFormLayout({
  quickViewSections = [],
  tabs = [],
  defaultTab,
  stats = [],
  children,
  onCancel,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  mode = 'add',
}: ModernFormLayoutProps) {
  const activeTab = defaultTab || (tabs.length > 0 ? tabs[0].id : undefined);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Quick Stats Overview */}
      {stats.length > 0 && (
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 flex-wrap">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}:</span>
                <Badge 
                  variant="outline" 
                  className={stat.color ? `text-${stat.color}-600 dark:text-${stat.color}-400` : ''}
                >
                  {stat.value ?? '—'}
                </Badge>
                {index < stats.length - 1 && <Separator orientation="vertical" className="h-6" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area - Two Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Column - Quick View Panel */}
        {quickViewSections.length > 0 && (
          <div className="w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick View</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Frequently used fields</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {quickViewSections.map((section, idx) => (
                  <Card key={idx} className="border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.fields.map((field, fieldIdx) => (
                        <div key={fieldIdx} className="space-y-1">
                          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {field.label}
                          </label>
                          {field.type === 'boolean' ? (
                            <div className="flex items-center h-10 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                              <span className="text-xs text-gray-700 dark:text-gray-300">
                                {field.value ? 'Yes' : 'No'}
                              </span>
                            </div>
                          ) : (
                            <div className="h-10 px-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center">
                              <span className="text-xs text-gray-700 dark:text-gray-300">
                                {field.value ?? '—'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Right Column - Detailed Editing with Tabs or Children */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          {tabs.length > 0 ? (
            <Tabs defaultValue={activeTab} className="flex flex-col flex-1 overflow-hidden">
              {/* Sticky tabs list */}
              <div className="sticky top-0 z-10 px-6 pt-4 pb-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <TabsList className={`grid w-full bg-gray-100 dark:bg-gray-800 p-1 h-auto ${tabs.length <= 3 ? 'grid-cols-3' : tabs.length <= 5 ? 'grid-cols-5' : 'grid-cols-6'}`}>
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 py-2 text-sm"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Scrollable tab content */}
              <ScrollArea className="flex-1">
                <div className="px-6 py-4">
                  {tabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0 space-y-4">
                      {tab.sections.map((section, sectionIdx) => (
                        <Card key={sectionIdx} className="border-gray-200 dark:border-gray-700">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">{section.label}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              {section.fields.map((field, fieldIdx) => (
                                <div key={fieldIdx}>{field}</div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          ) : (
            <ScrollArea className="flex-1">
              <div className="px-6 py-4">
                {children}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
      
      {/* Form Footer */}
      {(onCancel || onSubmit) && (
        <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-sm">
          <div className="flex gap-4 w-full">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                {cancelLabel}
              </Button>
            )}
            {onSubmit && (
              <Button
                type="submit"
                onClick={onSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 !text-white dark:!text-white"
              >
                {submitLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

