"use client";

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RelatedTableEditModal } from './RelatedTableEditModal';
import type { RelatedTableFieldConfig } from '@/lib/relatedTableConfig';

interface RelatedTableEditButtonProps {
  /**
   * The configuration for this related table field
   */
  config: RelatedTableFieldConfig;
  
  /**
   * The current value of the field (the ID to look up)
   */
  value: string | number | null | undefined;
  
  /**
   * The table ID for the related table (same as current table's table_id)
   */
  relatedTableId: string;
  
  /**
   * Optional: Custom button label
   */
  buttonLabel?: string;
  
  /**
   * Optional: Button size
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component that opens a modal to edit a related table row.
 * This button should be placed inside or beside an input field.
 */
export function RelatedTableEditButton({
  config,
  value,
  relatedTableId,
  buttonLabel,
  size = 'sm',
}: RelatedTableEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Don't show button if there's no value or if value is 4294967295 (represents null)
  if (!value || value === '' || value === null || value === undefined || value === 4294967295 || value === '4294967295') {
    return null;
  }
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  const sizeClasses = {
    sm: 'h-6 w-6 p-1',
    md: 'h-8 w-8 p-1.5',
    lg: 'h-10 w-10 p-2',
  };
  
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={`${sizeClasses[size]} absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
        title={buttonLabel || config.buttonLabel || `Edit ${config.relatedTableType}`}
      >
        <ExternalLink className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
      </Button>
      
      <RelatedTableEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={config}
        rowId={value}
        relatedTableId={relatedTableId}
        onSave={(updatedData) => {
          // The modal will handle the save, we just need to close it
          setIsModalOpen(false);
        }}
      />
    </>
  );
}

