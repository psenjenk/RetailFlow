import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '@/lib/db';
import { Supplier } from '@/types';
import RoleGuard from '@/components/RoleGuard';
import { useRole } from '@/hooks/useRole';

export default function Suppliers() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const { isAdmin } = useRole();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await addSupplier(newSupplier);
      setNewSupplier({ name: '', email: '', phone: '', address: '' });
      loadSuppliers();
    } catch (error) {
      setError('Failed to add supplier');
    }
  };

  const handleUpdateSupplier = async (id: string, supplier: Supplier) => {
    try {
      await updateSupplier(id, supplier);
      loadSuppliers();
    } catch (error) {
      setError('Failed to update supplier');
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (error) {
      setError('Failed to delete supplier');
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
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            {isAdmin && (
              <form onSubmit={handleAddSupplier} className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Add Supplier</Button>
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
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.address}</td>
                    {isAdmin && (
                      <td>
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateSupplier(supplier.id, supplier)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteSupplier(supplier.id)}
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