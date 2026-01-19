'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@interview-pass/ui';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement real authentication in Phase 2
    console.log('Login attempt:', { email, password });
    alert('Auth coming in Phase 2. For now, use the Dashboard.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Pass</h1>
            <p className="text-gray-600">Sign in to your recruiter account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@seainfogroup.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-4">
              Phase 1 MVP: Authentication coming in Phase 2. Use demo below.
            </p>
            <Link href="/dashboard">
              <Button variant="secondary" className="w-full">
                View Demo Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Demo Credentials (Phase 2)</p>
            <p>Email: john@seainfogroup.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
