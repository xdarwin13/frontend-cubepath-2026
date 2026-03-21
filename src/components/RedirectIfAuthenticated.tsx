'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Wrapper component that redirects authenticated users away from
 * public-only pages (login, register, etc.) to their dashboard.
 */
export default function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to the appropriate dashboard based on role
      if (user.role === 'teacher') router.replace('/teacher');
      else if (user.role === 'student') router.replace('/student');
      else if (user.role === 'admin') router.replace('/admin');
      else router.replace('/');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1121]">
        <Loader2 className="w-10 h-10 animate-spin text-[#38bdf8]" />
      </div>
    );
  }

  // If user is authenticated, don't render children (redirect is happening)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1121]">
        <Loader2 className="w-10 h-10 animate-spin text-[#38bdf8]" />
      </div>
    );
  }

  // User is not authenticated, render the page normally
  return <>{children}</>;
}
