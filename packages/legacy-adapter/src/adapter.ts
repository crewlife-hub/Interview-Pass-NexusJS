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
 * Real Google Calendar adapter
 * Fetches interviews from the user's Google Calendar
 */
export class GoogleLegacyAdapter implements ILegacyAdapter {
  private accessToken: string;
  private calendarId: string = 'primary';
  private user: User;

  constructor(accessToken: string, user: User) {
    this.accessToken = accessToken;
    this.user = user;
  }

  async getUpcomingInterviews(limit = 10): Promise<Interview[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?maxResults=${limit}&orderBy=startTime&singleEvents=true`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );

      if (!response.ok) {
        console.warn('Failed to fetch calendar events, falling back to mock data');
        return new MockLegacyAdapter().getUpcomingInterviews(limit);
      }

      const data = await response.json();
      const interviews: Interview[] = (data.items || [])
        .filter((event: any) => event.summary?.includes('[INTERVIEW]'))
        .map((event: any) => ({
          id: event.id,
          candidateName: event.description?.split('\n')[0] || 'Unknown',
          candidateEmail: event.attendees?.[0]?.email || '',
          position: event.summary?.replace('[INTERVIEW] ', '') || 'Unknown',
          brand: 'SEACHEFS',
          scheduledTime: new Date(event.start.dateTime),
          duration: Math.round(
            (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) / 60000
          ),
          recruiterName: this.user.name,
          recruiterEmail: this.user.email,
          status: 'scheduled' as const,
          meetLink: event.conferenceData?.entryPoints?.[0]?.uri || '',
          notes: event.description || '',
        }))
        .slice(0, limit);

      return interviews;
    } catch (error) {
      console.error('Calendar fetch error:', error);
      return new MockLegacyAdapter().getUpcomingInterviews(limit);
    }
  }

  async getInterviewDetails(interviewId: string): Promise<Interview | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events/${interviewId}`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );

      if (!response.ok) return null;

      const event = await response.json();
      return {
        id: event.id,
        candidateName: event.description?.split('\n')[0] || 'Unknown',
        candidateEmail: event.attendees?.[0]?.email || '',
        position: event.summary?.replace('[INTERVIEW] ', '') || 'Unknown',
        brand: 'SEACHEFS',
        scheduledTime: new Date(event.start.dateTime),
        duration: Math.round(
          (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) / 60000
        ),
        recruiterName: this.user.name,
        recruiterEmail: this.user.email,
        status: 'scheduled' as const,
        meetLink: event.conferenceData?.entryPoints?.[0]?.uri || '',
        notes: event.description || '',
      };
    } catch (error) {
      console.error('Interview details error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.user;
  }

  async createCalendarEvent(interview: Interview): Promise<{ eventId: string; link?: string }> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: `[INTERVIEW] ${interview.position}`,
            description: `${interview.candidateName}\n${interview.candidateEmail}`,
            start: { dateTime: interview.scheduledTime.toISOString() },
            end: {
              dateTime: new Date(interview.scheduledTime.getTime() + interview.duration * 60000).toISOString(),
            },
            attendees: [{ email: interview.candidateEmail }],
            conferenceData: {
              createRequest: {
                requestId: `interview-${interview.id}`,
                conferenceSolution: { key: { type: 'hangoutsMeet' } },
              },
            },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create calendar event');

      const event = await response.json();
      return {
        eventId: event.id,
        link: event.conferenceData?.entryPoints?.[0]?.uri || event.htmlLink,
      };
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }
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
 * Switches between real (Google Calendar) and mock implementations
 */
export function createLegacyAdapter(accessToken?: string, user?: User): ILegacyAdapter {
  if (accessToken && user) {
    return new GoogleLegacyAdapter(accessToken, user);
  }
  return new MockLegacyAdapter();
}
