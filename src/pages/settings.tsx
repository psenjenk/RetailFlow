import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, onAuthStateChange } from '@/lib/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/custom-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleGuard from '@/components/RoleGuard';

interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.id));
          if (userDoc.exists()) {
            setProfile({
              name: userDoc.data().name,
              email: user.email,
              role: userDoc.data().role,
            });
          }
        } catch (error) {
          setError('Failed to load profile');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', user.uid), {
        name: profile?.name,
        role: profile?.role,
        updatedAt: new Date(),
      });

      // Show success message or redirect
      router.push('/');
    } catch (error) {
      setError('Failed to update profile');
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
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  id="name"
                  value={profile?.name || ''}
                  onChange={(e) => setProfile({ ...profile!, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select
                  value={profile?.role || 'staff'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setProfile({ ...profile!, role: e.target.value as 'admin' | 'staff' })
                  }
                  disabled={profile?.role !== 'admin'}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
} 