import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Reports', href: '/reports', icon: BarChart },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // TODO: Implement auth state listener
  }, []);

  const handleLogout = async () => {
    // TODO: Implement logout
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-teal-600">RetailFlow</h1>
              </div>
              <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                          isActive
                            ? 'bg-teal-50 text-teal-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-3 h-5 w-5',
                            isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        {user?.role || 'Role'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 