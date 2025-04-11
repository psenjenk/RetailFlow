import React from 'react';
import { useRouter } from 'next/router';
import { useRole } from '@/hooks/useRole';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'staff')[];
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const router = useRouter();
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    router.push('/');
    return null;
  }

  return <>{children}</>;
} 