'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageShell, Card, Button } from '@interview-pass/ui';
import { createLegacyAdapter } from '@interview-pass/legacy-adapter';
import { formatDateTime, getDurationText } from '@interview-pass/shared';
import type { Interview } from '@interview-pass/shared';

function Sidebar() {
  return (
    <nav className="p-6 space-y-2">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
      </div>

      <Link
        href="/dashboard"
        className="block px-4 py-2 text-gray-900 bg-blue-50 rounded-lg font-medium border-l-4 border-blue-600"
      >
        📅 Dashboard
      </Link>

      <Link
        href="#"
        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        onClick={(e) => e.preventDefault()}
      >
        👥 Candidates
      </Link>

      <Link
        href="#"
        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        onClick={(e) => e.preventDefault()}
      >
        📊 Reports
      </Link>

      <Link
        href="#"
        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        onClick={(e) => e.preventDefault()}
      >
        ⚙️ Settings
      </Link>

      <hr className="my-4" />

      <div className="text-xs text-gray-500 p-2">
        <p className="font-semibold mb-2">User Info (Mock)</p>
        <p>John Smith</p>
        <p>Recruiter</p>
        <p>SEACHEFS</p>
      </div>
    </nav>
  );
}

function Header() {
  return (
    <div className="px-6 py-4 flex items-center justify-between bg-white">
      <h1 className="text-2xl font-bold text-gray-900">Interview Dashboard</h1>
      <div className="flex gap-3">
        <Button variant="secondary" size="sm">
          Profile
        </Button>
        <Button variant="danger" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      const adapter = createLegacyAdapter();
      const data = await adapter.getUpcomingInterviews(10);
      setInterviews(data);
      setLoading(false);
    };

    loadInterviews();
  }, []);

  return (
    <PageShell sidebar={<Sidebar />} header={<Header />}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card header={<h3 className="font-semibold">Today's Interviews</h3>}>
            <p className="text-3xl font-bold text-blue-600">{interviews.length}</p>
          </Card>
          <Card header={<h3 className="font-semibold">Scheduled</h3>}>
            <p className="text-3xl font-bold text-green-600">
              {interviews.filter((i) => i.status === 'scheduled').length}
            </p>
          </Card>
          <Card header={<h3 className="font-semibold">Brands</h3>}>
            <p className="text-3xl font-bold text-purple-600">3</p>
          </Card>
        </div>

        <Card header={<h2 className="text-lg font-semibold">Upcoming Interviews</h2>}>
          {loading ? (
            <p className="text-gray-500">Loading interviews...</p>
          ) : interviews.length === 0 ? (
            <p className="text-gray-500">No upcoming interviews</p>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                      <p className="text-sm text-gray-500">{interview.position}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      interview.status === 'scheduled'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">📅 Time</p>
                      <p className="font-medium">{formatDateTime(interview.scheduledTime)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">⏱️ Duration</p>
                      <p className="font-medium">{getDurationText(interview.duration)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">🏢 Brand</p>
                      <p className="font-medium">{interview.brand}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">👤 Recruiter</p>
                      <p className="font-medium">{interview.recruiterName}</p>
                    </div>
                  </div>

                  <Link href={`/interview/${interview.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card header={<h2 className="text-lg font-semibold">System Status</h2>}>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Status:</span>
              <span className="ml-2 font-medium text-green-600">✓ Running (Phase 1 MVP)</span>
            </p>
            <p>
              <span className="text-gray-500">Data Source:</span>
              <span className="ml-2 font-medium">Mock Adapter (Legacy integration in progress)</span>
            </p>
            <p>
              <span className="text-gray-500">Auth:</span>
              <span className="ml-2 font-medium text-yellow-600">Coming in Phase 2</span>
            </p>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
