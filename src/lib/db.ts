import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import {
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  User,
  DashboardMetrics,
} from '../types';

// Products
export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProduct = async (id: string) => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

// Customers
export const getCustomers = async () => {
  const snapshot = await getDocs(collection(db, 'customers'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
};

export const getCustomer = async (id: string) => {
  const docRef = doc(db, 'customers', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Customer;
  }
  return null;
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'customers'), {
    ...customer,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCustomer = async (id: string, customer: Partial<Customer>) => {
  const docRef = doc(db, 'customers', id);
  await updateDoc(docRef, {
    ...customer,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCustomer = async (id: string) => {
  await deleteDoc(doc(db, 'customers', id));
};

// Sales
export const getSales = async () => {
  const snapshot = await getDocs(collection(db, 'sales'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
};

export const getSale = async (id: string) => {
  const docRef = doc(db, 'sales', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Sale;
  }
  return null;
};

export const addSale = async (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'sales'), {
    ...sale,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateSale = async (id: string, sale: Partial<Sale>) => {
  const docRef = doc(db, 'sales', id);
  await updateDoc(docRef, {
    ...sale,
    updatedAt: Timestamp.now(),
  });
};

export const deleteSale = async (id: string) => {
  await deleteDoc(doc(db, 'sales', id));
};

// Dashboard Metrics
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const salesQuery = query(
    collection(db, 'sales'),
    where('createdAt', '>=', startOfMonth),
    orderBy('createdAt', 'desc')
  );
  const salesSnapshot = await getDocs(salesQuery);
  const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));

  const dailySales = sales
    .filter(sale => sale.createdAt.toDate() >= startOfDay)
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  const weeklySales = sales
    .filter(sale => sale.createdAt.toDate() >= startOfWeek)
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  const monthlySales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  const productsSnapshot = await getDocs(collection(db, 'products'));
  const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stockLevel,
    0
  );

  const lowStockItems = products.filter(
    product => product.stockLevel <= product.lowStockThreshold
  );

  const topSellingProducts = await getTopSellingProducts();

  return {
    dailySales,
    weeklySales,
    monthlySales,
    totalInventoryValue,
    lowStockItems,
    topSellingProducts,
  };
};

const getTopSellingProducts = async () => {
  const salesSnapshot = await getDocs(collection(db, 'sales'));
  const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));

  const productSales = new Map<string, number>();
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const current = productSales.get(item.productId) || 0;
      productSales.set(item.productId, current + item.quantity);
    });
  });

  const productsSnapshot = await getDocs(collection(db, 'products'));
  const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  return Array.from(productSales.entries())
    .map(([productId, quantity]) => ({
      product: products.find(p => p.id === productId)!,
      quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}; 