import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    name?: string;
  }
}
