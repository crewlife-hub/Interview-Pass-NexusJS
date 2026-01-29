/**
 * Shared types for Interview Pass
 */

export type UserRole = 'recruiter' | 'candidate' | 'admin' | 'interviewer';

export type BrandId = 'SEACHEFS' | 'COSTA' | 'RCG';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  brand: BrandId;
  avatar?: string;
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  brand: BrandId;
  scheduledTime: Date;
  duration: number; // in minutes
  recruiterName: string;
  recruiterEmail: string;
  status: InterviewStatus;
  meetLink?: string;
  notes?: string;
  checklist?: InterviewChecklistItem[];
}

export interface InterviewChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completed?: boolean;
}

export interface InterviewTemplate {
  id: string;
  name: string;
  brand: BrandId;
  position: string;
  checklist: InterviewChecklistItem[];
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  interviewId?: string;
  metadata?: Record<string, unknown>;
}
