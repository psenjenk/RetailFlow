import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Package,
  Users,
  Truck,
  BarChart2,
  Settings,
  UserCog,
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['admin', 'staff'] },
  { name: 'Products', href: '/products', icon: Package, roles: ['admin', 'staff'] },
  { name: 'Customers', href: '/customers', icon: Users, roles: ['admin', 'staff'] },
  { name: 'Suppliers', href: '/suppliers', icon: Truck, roles: ['admin', 'staff'] },
  { name: 'Reports', href: '/reports', icon: BarChart2, roles: ['admin', 'staff'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'staff'] },
  { name: 'User Management', href: '/admin/users', icon: UserCog, roles: ['admin'] },
];

export default function Sidebar() {
  const router = useRouter();
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="w-64 bg-white shadow">
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white shadow">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation
            .filter(item => item.roles.includes(role || 'staff'))
            .map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );
} 