import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { getDashboardMetrics, getSales } from '@/lib/db';
import { Sale } from '@/types';

const COLORS = ['#4DB6AC', '#FF8A65', '#90A4AE', '#FFB74D', '#81C784'];

export default function Reports() {
  const [metrics, setMetrics] = React.useState<any>(null);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, salesData] = await Promise.all([
        getDashboardMetrics(),
        getSales(),
      ]);
      setMetrics(metricsData);
      setSales(salesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </Layout>
    );
  }

  // Prepare data for charts
  const salesByDay = sales.reduce((acc: { [key: string]: number }, sale) => {
    const date = sale.createdAt.toDate().toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.totalAmount;
    return acc;
  }, {});

  const salesData = Object.entries(salesByDay).map(([date, amount]) => ({
    date,
    amount,
  }));

  const paymentMethodData = sales.reduce((acc: { [key: string]: number }, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.totalAmount;
    return acc;
  }, {});

  const pieData = Object.entries(paymentMethodData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>

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
              <CardTitle className="text-sm font-medium text-gray-500">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#4DB6AC"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
              {metrics?.topSellingProducts?.map((item: any, index: number) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      <span className="text-white font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Sold: {item.quantity} units
                      </p>
                    </div>
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