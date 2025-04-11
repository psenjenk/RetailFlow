import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { getProducts, getCustomers, addSale } from '@/lib/db';
import { Product, Customer, Sale } from '@/types';

export default function Sales() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<{
    productId: string;
    quantity: number;
  }[]>([]);
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'mpesa' | 'card'>('cash');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, customersData] = await Promise.all([
        getProducts(),
        getCustomers(),
      ]);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: products[0]?.id || '', quantity: 1 },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: 'productId' | 'quantity', value: string) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === 'quantity' ? parseInt(value) : value,
    };
    setSelectedProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || selectedProducts.length === 0) {
      alert('Please select a customer and add products');
      return;
    }

    try {
      const sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'> = {
        customerId: selectedCustomer,
        items: selectedProducts.map(item => {
          const product = products.find(p => p.id === item.productId)!;
          return {
            id: Math.random().toString(36).substr(2, 9),
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price,
            totalPrice: product.price * item.quantity,
          };
        }),
        totalAmount: calculateTotal(),
        paymentMethod,
        status: 'completed',
      };

      await addSale(sale);
      
      // Update product stock levels
      for (const item of selectedProducts) {
        const product = products.find(p => p.id === item.productId)!;
        await updateProduct(product.id, {
          stockLevel: product.stockLevel - item.quantity,
        });
      }

      // Reset form
      setSelectedCustomer('');
      setSelectedProducts([]);
      setPaymentMethod('cash');
      await loadData();
    } catch (error) {
      console.error('Error creating sale:', error);
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

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Sale</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'mpesa' | 'card')}
                required
              >
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Products</h2>
              <Button type="button" onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>

            {selectedProducts.map((item, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product</label>
                  <Select
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({formatCurrency(product.price)})
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Complete Sale</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 