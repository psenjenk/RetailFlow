import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '@/lib/db';
import { Customer } from '@/types';
import RoleGuard from '@/components/RoleGuard';
import { useRole } from '@/hooks/useRole';

export default function Customers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const { isAdmin } = useRole();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await addCustomer(newCustomer);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      loadCustomers();
    } catch (error) {
      setError('Failed to add customer');
    }
  };

  const handleUpdateCustomer = async (id: string, customer: Customer) => {
    try {
      await updateCustomer(id, customer);
      loadCustomers();
    } catch (error) {
      setError('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (error) {
      setError('Failed to delete customer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'staff']}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            {isAdmin && (
              <form onSubmit={handleAddCustomer} className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Add Customer</Button>
              </form>
            )}
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    {isAdmin && (
                      <td>
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateCustomer(customer.id, customer)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
} 