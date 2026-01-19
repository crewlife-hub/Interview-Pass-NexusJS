'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageShell, Card, Button } from '@interview-pass/ui';
import { createLegacyAdapter } from '@interview-pass/legacy-adapter';
import { formatDateTime, getDurationText, formatDate, formatTime } from '@interview-pass/shared';
import type { Interview } from '@interview-pass/shared';

interface InterviewPageProps {
  params: {
    id: string;
  };
}

function Sidebar() {
  return (
    <nav className="p-6 space-y-2">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
      </div>

      <Link
        href="/dashboard"
        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        📅 Dashboard
      </Link>

      <Link
        href="#"
        className="block px-4 py-2 text-gray-900 bg-blue-50 rounded-lg font-medium border-l-4 border-blue-600"
        onClick={(e) => e.preventDefault()}
      >
        👥 Candidates
      </Link>
    </nav>
  );
}

function Header() {
  return (
    <div className="px-6 py-4 flex items-center justify-between bg-white">
      <h1 className="text-2xl font-bold text-gray-900">Interview Details</h1>
      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function InterviewPage({ params }: InterviewPageProps) {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterview = async () => {
      const adapter = createLegacyAdapter();
      const data = await adapter.getInterviewDetails(params.id);
      setInterview(data);
      setLoading(false);
    };

    loadInterview();
  }, [params.id]);

  if (loading) {
    return (
      <PageShell sidebar={<Sidebar />} header={<Header />}>
        <div className="text-gray-500">Loading interview details...</div>
      </PageShell>
    );
  }

  if (!interview) {
    return (
      <PageShell sidebar={<Sidebar />} header={<Header />}>
        <Card>
          <p className="text-red-600">Interview not found</p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell sidebar={<Sidebar />} header={<Header />}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Info */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Candidate</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  interview.status === 'scheduled'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {interview.status}
                </span>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{interview.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  <a href={`mailto:${interview.candidateEmail}`} className="text-blue-600 hover:underline">
                    {interview.candidateEmail}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{interview.position}</p>
              </div>
            </div>
          </Card>

          {/* Interview Details */}
          <Card header={<h2 className="text-lg font-semibold">Interview Details</h2>}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">📅 Date</p>
                <p className="font-medium">{formatDate(interview.scheduledTime)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">⏰ Time</p>
                <p className="font-medium">{formatTime(interview.scheduledTime)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">⏱️ Duration</p>
                <p className="font-medium">{getDurationText(interview.duration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">🏢 Brand</p>
                <p className="font-medium">{interview.brand}</p>
              </div>
            </div>
          </Card>

          {/* Recruiter Info */}
          <Card header={<h2 className="text-lg font-semibold">Recruiter</h2>}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{interview.recruiterName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  <a href={`mailto:${interview.recruiterEmail}`} className="text-blue-600 hover:underline">
                    {interview.recruiterEmail}
                  </a>
                </p>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {interview.notes && (
            <Card header={<h2 className="text-lg font-semibold">Notes</h2>}>
              <p className="text-gray-700">{interview.notes}</p>
            </Card>
          )}

          {/* Interview Checklist (placeholder) */}
          <Card header={<h2 className="text-lg font-semibold">Interview Checklist</h2>}>
            <div className="text-gray-500 text-sm">
              <p>Coming in Phase 2: Interactive checklist</p>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>☐ Introduction & rapport building</li>
                <li>☐ Experience verification</li>
                <li>☐ Technical competency assessment</li>
                <li>☐ Safety & compliance awareness</li>
                <li>☐ Guest experience focus</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <Card header={<h2 className="font-semibold">Actions</h2>}>
            <div className="space-y-3">
              {interview.meetLink && (
                <a href={interview.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="w-full">
                    📹 Join Meet
                  </Button>
                </a>
              )}
              <Button variant="secondary" className="w-full">
                📋 Open Calendar
              </Button>
              <Button variant="secondary" className="w-full">
                📧 Send Reminder
              </Button>
              <Button variant="danger" className="w-full">
                ❌ Cancel
              </Button>
            </div>
          </Card>

          <Card header={<h2 className="font-semibold">Meeting Info</h2>}>
            {interview.meetLink ? (
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Google Meet Link</p>
                <p className="break-all">
                  <a
                    href={interview.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {interview.meetLink}
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No meeting link generated yet</p>
            )}
          </Card>

          <Card header={<h2 className="font-semibold">Status</h2>}>
            <div className="text-sm space-y-2">
              <p>
                <span className="text-gray-500">Interview:</span>
                <span className="ml-2 font-medium capitalize">{interview.status}</span>
              </p>
              <p>
                <span className="text-gray-500">Time until:</span>
                <span className="ml-2 font-medium">2h 15m</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
