import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardMetrics } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [metrics, setMetrics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </Layout>
    );
  }

  const salesData = [
    { name: 'Daily', value: metrics?.dailySales || 0 },
    { name: 'Weekly', value: metrics?.weeklySales || 0 },
    { name: 'Monthly', value: metrics?.monthlySales || 0 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(metrics?.dailySales || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(metrics?.weeklySales || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(metrics?.monthlySales || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(metrics?.totalInventoryValue || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `${label} Sales`}
                    />
                    <Bar dataKey="value" fill="#4DB6AC" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.lowStockItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Current Stock: {item.stockLevel} units
                      </p>
                    </div>
                    <div className="text-sm font-medium text-red-600">
                      Low Stock Alert
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.topSellingProducts?.map((item: any) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Sold: {item.quantity} units
                    </p>
                  </div>
                  <div className="text-sm font-medium text-teal-600">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 