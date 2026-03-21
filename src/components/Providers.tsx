'use client';

import { AuthProvider } from '@/lib/auth';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        }}
      />
    </AuthProvider>
  );
}
