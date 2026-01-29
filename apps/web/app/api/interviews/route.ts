import { getServerSession } from 'next-auth/next';
import { createLegacyAdapter } from '@interview-pass/legacy-adapter';
import type { Interview } from '@interview-pass/shared';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.accessToken) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create adapter with user's session
    const adapter = createLegacyAdapter(
      session.user.accessToken,
      {
        email: session.user.email!,
        name: session.user.name || 'Recruiter',
        role: 'recruiter',
      }
    );

    const limit = new URL(request.url).searchParams.get('limit') || '10';
    const interviews = await adapter.getUpcomingInterviews(parseInt(limit));

    return Response.json({
      success: true,
      data: interviews,
      count: interviews.length,
    });
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    return Response.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}
