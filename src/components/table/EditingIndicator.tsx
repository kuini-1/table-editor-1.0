"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Eye, Edit } from 'lucide-react';
import type { EditingSession } from '@/hooks/useEditingIndicators';

interface EditingIndicatorProps {
  sessions: EditingSession[];
  type?: 'viewing' | 'editing';
  className?: string;
  currentUserId?: string;
}

export function EditingIndicator({ sessions, type = 'viewing', className, currentUserId }: EditingIndicatorProps) {
  // Filter out current user's sessions
  const otherUsersSessions = currentUserId 
    ? sessions.filter(s => s.user_id !== currentUserId)
    : sessions;

  if (otherUsersSessions.length === 0) return null;

  const Icon = type === 'editing' ? Edit : Eye;
  const label = type === 'editing' ? 'editing' : 'viewing';

  // Group by user email to avoid duplicates
  const uniqueUsers = Array.from(
    new Map(otherUsersSessions.map(s => [s.user_email, s])).values()
  );

  if (uniqueUsers.length === 0) return null;

  const displayText = uniqueUsers.length === 1
    ? `${uniqueUsers[0].user_name || uniqueUsers[0].user_email} is ${label}`
    : `${uniqueUsers.length} users ${label}`;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 text-xs ${className || ''}`}
      title={
        uniqueUsers.length === 1
          ? displayText
          : uniqueUsers.map(u => u.user_name || u.user_email).join(', ')
      }
    >
      <Icon className="h-3 w-3" />
      <span>{displayText}</span>
    </Badge>
  );
}

interface RowEditingIndicatorProps {
  rowId: string;
  sessions: EditingSession[];
  currentUserId?: string;
  className?: string;
}

export function RowEditingIndicator({ 
  rowId, 
  sessions, 
  currentUserId,
  className 
}: RowEditingIndicatorProps) {
  // Filter out current user's sessions
  const otherUsers = sessions.filter(s => s.user_id !== currentUserId);

  if (otherUsers.length === 0) return null;

  return <EditingIndicator sessions={otherUsers} type="editing" className={className} />;
}

