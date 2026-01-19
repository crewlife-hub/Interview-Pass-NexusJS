'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to get authenticated session
 * Automatically redirects to login if not authenticated
 */
export function useAuthSession() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return { session, status, isLoading: status === 'loading' };
}

export type UserSession = typeof useSession extends (...args: any[]) => infer R
  ? R extends { data: infer T }
    ? T
    : never
  : never;
