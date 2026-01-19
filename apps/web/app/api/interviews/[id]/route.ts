import { getServerSession } from 'next-auth/next';
import { createLegacyAdapter } from '@interview-pass/legacy-adapter';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.accessToken) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adapter = createLegacyAdapter(
      session.user.accessToken,
      {
        email: session.user.email!,
        name: session.user.name || 'Recruiter',
        role: 'recruiter',
      }
    );

    const interview = await adapter.getInterviewDetails(params.id);

    if (!interview) {
      return Response.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Failed to fetch interview:', error);
    return Response.json(
      { error: 'Failed to fetch interview' },
      { status: 500 }
    );
  }
}
