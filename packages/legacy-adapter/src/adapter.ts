import type { Interview, User } from '@shared/types';

export interface ILegacyAdapter {
  /**
   * Get upcoming interviews for the authenticated user
   */
  getUpcomingInterviews(limit?: number): Promise<Interview[]>;

  /**
   * Get interview details by ID
   */
  getInterviewDetails(interviewId: string): Promise<Interview | null>;

  /**
   * Get the authenticated recruiter/user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Create a calendar event for an interview
   */
  createCalendarEvent(interview: Interview): Promise<{ eventId: string; link?: string }>;
}

/**
 * Mock implementation of the legacy adapter
 * Used during MVP phase before real Google Calendar/Smartsheet integration
 */
export class MockLegacyAdapter implements ILegacyAdapter {
  async getUpcomingInterviews(limit = 10): Promise<Interview[]> {
    // Mock data for MVP
    const now = new Date();
    return [
      {
        id: 'int-001',
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
        position: 'Executive Chef',
        brand: 'SEACHEFS',
        scheduledTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        duration: 30,
        recruiterName: 'John Smith',
        recruiterEmail: 'john@seainfogroup.com',
        status: 'scheduled',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Follow up on Italian cuisine expertise',
      },
      {
        id: 'int-002',
        candidateName: 'Carlos Rodriguez',
        candidateEmail: 'carlos@example.com',
        position: 'Sous Chef',
        brand: 'COSTA',
        scheduledTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        duration: 45,
        recruiterName: 'Sarah Johnson',
        recruiterEmail: 'sarah@seainfogroup.com',
        status: 'scheduled',
        meetLink: 'https://meet.google.com/xyz-uvwx-yz',
        notes: 'Check service excellence standards',
      },
      {
        id: 'int-003',
        candidateName: 'Maria Santos',
        candidateEmail: 'maria@example.com',
        position: 'Chef de Partie',
        brand: 'RCG',
        scheduledTime: new Date(now.getTime() + 6 * 60 * 60 * 1000),
        duration: 30,
        recruiterName: 'John Smith',
        recruiterEmail: 'john@seainfogroup.com',
        status: 'scheduled',
        meetLink: 'https://meet.google.com/pqr-stuv-wx',
        notes: 'Verify teamwork and safety awareness',
      },
    ];
  }

  async getInterviewDetails(interviewId: string): Promise<Interview | null> {
    const interviews = await this.getUpcomingInterviews();
    return interviews.find((i) => i.id === interviewId) || null;
  }

  async getCurrentUser(): Promise<User | null> {
    // Mock user - in real implementation, fetch from session/auth provider
    return {
      id: 'user-001',
      name: 'John Smith',
      email: 'john@seainfogroup.com',
      role: 'recruiter',
      brand: 'SEACHEFS',
    };
  }

  async createCalendarEvent(interview: Interview): Promise<{ eventId: string; link?: string }> {
    // Mock calendar event creation
    return {
      eventId: `event-${Date.now()}`,
      link: `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
        `Interview: ${interview.candidateName} - ${interview.position}`
      )}`,
    };
  }
}

/**
 * Factory function to create the appropriate adapter
 * Can be extended to create real adapters for Google Calendar, Smartsheet, etc.
 */
export function createLegacyAdapter(): ILegacyAdapter {
  // Start with mock, can be swapped for real implementation
  return new MockLegacyAdapter();
}
