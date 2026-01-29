'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@interview-pass/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Interview Pass</h1>
          <p className="text-xl text-gray-600 mb-2">Crew Life at Sea - Recruitment Portal</p>
          <p className="text-gray-500">NexusJS Migration - Phase 1 MVP</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome</h2>
          <p className="text-gray-600 mb-8">
            Manage your interview schedule, track candidates, and streamline your recruitment process.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button variant="primary" size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                View Dashboard (Demo)
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-800 mb-2">Calendar</h3>
            <p className="text-gray-600 text-sm">Schedule and manage interviews</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-800 mb-2">Candidates</h3>
            <p className="text-gray-600 text-sm">Track candidate information</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-gray-800 mb-2">Checklist</h3>
            <p className="text-gray-600 text-sm">Complete interview checklist</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-500 text-sm">
            Phase 1 MVP - Legacy integration in progress. Using mock data for demo.
          </p>
        </div>
      </div>
    </div>
  );
}
