import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/db';
import { Product } from '@/types';
import RoleGuard from '@/components/RoleGuard';
import { useRole } from '@/hooks/useRole';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const { isAdmin } = useRole();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const product = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      };
      await addProduct(product);
      setNewProduct({ name: '', description: '', price: '', stock: '' });
      loadProducts();
    } catch (error) {
      setError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (id: string, product: Product) => {
    try {
      await updateProduct(id, product);
      loadProducts();
    } catch (error) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      setError('Failed to delete product');
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
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            {isAdmin && (
              <form onSubmit={handleAddProduct} className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Add Product</Button>
              </form>
            )}
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    {isAdmin && (
                      <td>
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateProduct(product.id, product)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
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