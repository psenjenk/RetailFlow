export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt: Date;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  totalInventoryValue: number;
  lowStockItems: Product[];
  topSellingProducts: {
    product: Product;
    quantity: number;
  }[];
} 