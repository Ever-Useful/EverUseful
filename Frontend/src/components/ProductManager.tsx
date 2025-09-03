import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfileStore, Product } from '@/hooks/useProfileStore';
import { v4 as uuidv4 } from 'uuid';

const ProductManager = () => {
  const { profile, addProduct, updateProduct, deleteProduct } = useProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: ''
  });

  const products = profile?.userType === 'enterprise' ? profile.products : [];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      const newProduct: Product = {
        id: uuidv4(),
        ...formData
      };
      addProduct(newProduct);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', link: '' });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      link: product.link
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product/service?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Manage Products/Services</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add New Product/Service</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product/Service' : 'Add New Product/Service'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product-name">Product/Service Name *</Label>
                <Input
                  id="product-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter product or service name"
                />
              </div>
              
              <div>
                <Label htmlFor="product-description">Description *</Label>
                <Textarea
                  id="product-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Describe your product or service..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="product-link">Link</Label>
                <Input
                  id="product-link"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="https://yourproduct.com"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product/Service' : 'Add Product/Service'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {products.length === 0 ? (
            <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">No products/services added yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>Add Your First Product/Service</Button>
            </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{product.description}</p>
              {product.link && (
                <a 
                  href={product.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Product/Service →
                </a>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManager;