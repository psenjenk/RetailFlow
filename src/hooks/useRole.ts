import { useState, useEffect } from 'react';
import { onAuthStateChange } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Role = 'admin' | 'staff';

export function useRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.id));
          if (userDoc.exists()) {
            setRole(userDoc.data().role as Role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';

  return {
    role,
    isAdmin,
    isStaff,
    loading,
  };
} 