import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/custom-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleGuard from '@/components/RoleGuard';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersList);
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'staff') => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date(),
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      setError('Failed to update user role');
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
    <RoleGuard allowedRoles={['admin']}>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <Select
                    value={user.role}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      handleUpdateRole(user.id, e.target.value as 'admin' | 'staff')
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
} 