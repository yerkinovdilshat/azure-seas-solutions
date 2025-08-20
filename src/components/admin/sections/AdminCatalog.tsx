import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Copy, Package, FolderOpen, Badge } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

interface CatalogCategory {
  id: string;
  locale: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  order: number;
}

interface CatalogProduct {
  id: string;
  locale: string;
  title: string;
  slug: string;
  description: string;
  content_rich: any;
  featured_image: string;
  gallery_images: string[];
  pdf_files: string[];
  video_url?: string;
  category_id: string | null;
  sku: string;
  manufacturer: string;
  specifications: any;
  is_featured: boolean;
  order: number;
  type: 'production' | 'supply';
  is_ctkz: boolean;
  tags: string[] | null;
}

interface AdminCatalogProps {
  locale: string;
}

const AdminCatalog = ({ locale }: AdminCatalogProps) => {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [ctkzFilter, setCtkzFilter] = useState<string>('all');
  const { toast } = useToast();

  // Category form state
  const [editingCategory, setEditingCategory] = useState<CatalogCategory | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: null as string | null,
    order: 0
  });

  // Product form state
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productFormData, setProductFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content_rich: null,
    featured_image: '',
    gallery_images: [] as string[],
    pdf_files: [] as string[],
    video_url: '',
    category_id: null as string | null,
    sku: '',
    manufacturer: '',
    specifications: null,
    is_featured: false,
    order: 0,
    type: 'supply' as 'production' | 'supply',
    is_ctkz: false,
    tags: null as string[] | null
  });

  useEffect(() => {
    fetchData();
  }, [locale]);

  // Filter products based on type and CT-KZ filters
  useEffect(() => {
    let filtered = products;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(product => product.type === typeFilter);
    }
    
    if (ctkzFilter !== 'all') {
      if (ctkzFilter === 'ctkz') {
        filtered = filtered.filter(product => product.is_ctkz);
      } else if (ctkzFilter === 'non-ctkz') {
        filtered = filtered.filter(product => !product.is_ctkz);
      }
    }
    
    setFilteredProducts(filtered);
  }, [products, typeFilter, ctkzFilter]);

  const fetchData = async () => {
    try {
      const [categoriesResult, productsResult] = await Promise.all([
        supabase
          .from('catalog_categories')
          .select('*')
          .eq('locale', locale)
          .order('order', { ascending: true }),
        supabase
          .from('catalog_products')
          .select('*')
          .eq('locale', locale)
          .order('order', { ascending: true })
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (productsResult.error) throw productsResult.error;

      setCategories(categoriesResult.data || []);
      const mappedProducts = (productsResult.data || []).map(product => ({
        ...product,
        type: product.type as 'production' | 'supply',
        tags: product.tags || null
      }));
      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Category CRUD operations
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        ...categoryFormData,
        locale
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('catalog_categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('catalog_categories')
          .insert([categoryData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...productFormData,
        locale
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('catalog_products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('catalog_products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setIsProductDialogOpen(false);
      resetProductForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: null,
      order: 0
    });
    setEditingCategory(null);
  };

  const resetProductForm = () => {
    setProductFormData({
      title: '',
      slug: '',
      description: '',
      content_rich: null,
      featured_image: '',
      gallery_images: [],
      pdf_files: [],
      video_url: '',
      category_id: null,
      sku: '',
      manufacturer: '',
      specifications: null,
      is_featured: false,
      order: 0,
      type: 'supply',
      is_ctkz: false,
      tags: null
    });
    setEditingProduct(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Catalog Management ({locale.toUpperCase()})</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetCategoryForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add Category'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category_name">Name</Label>
                      <Input
                        id="category_name"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category_slug">Slug</Label>
                      <Input
                        id="category_slug"
                        value={categoryFormData.slug}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category_description">Description</Label>
                    <Textarea
                      id="category_description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCategory ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryFormData({
                            name: category.name,
                            slug: category.slug,
                            description: category.description || '',
                            parent_id: category.parent_id,
                            order: category.order
                          });
                          setIsCategoryDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Products</h3>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetProductForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product_title">Title</Label>
                      <Input
                        id="product_title"
                        value={productFormData.title}
                        onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_sku">SKU</Label>
                      <Input
                        id="product_sku"
                        value={productFormData.sku}
                        onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product_description">Description</Label>
                    <Textarea
                      id="product_description"
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <RichTextEditor
                      value={productFormData.content_rich}
                      onChange={(value) => setProductFormData({ ...productFormData, content_rich: value })}
                      placeholder="Enter product content..."
                    />
                  </div>

                  <div>
                    <Label>Featured Image</Label>
                    <FileUpload
                      value={productFormData.featured_image}
                      onChange={(url) => setProductFormData({ ...productFormData, featured_image: url || '' })}
                      bucket="images"
                      folder="catalog"
                      accept="image/*"
                      allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    />
                  </div>

                  <div>
                    <Label>Gallery Images</Label>
                    <MultiImageUpload
                      value={productFormData.gallery_images}
                      onChange={(urls) => setProductFormData({ ...productFormData, gallery_images: urls })}
                      bucket="images"
                      folder="catalog/gallery"
                      accept="image/*"
                      allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      maxImages={10}
                      placeholder="Upload product gallery images"
                    />
                  </div>

                  <div>
                    <Label>Video URL</Label>
                    <Input
                      id="video_url"
                      value={productFormData.video_url}
                      onChange={(e) => setProductFormData({ ...productFormData, video_url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={productFormData.manufacturer}
                      onChange={(e) => setProductFormData({ ...productFormData, manufacturer: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <RadioGroup 
                        value={productFormData.type} 
                        onValueChange={(value: 'production' | 'supply') => {
                          setProductFormData({ 
                            ...productFormData, 
                            type: value,
                            // Auto-uncheck CT-KZ if switching to supply
                            is_ctkz: value === 'supply' ? false : productFormData.is_ctkz
                          });
                        }}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="production" id="type_production" />
                          <Label htmlFor="type_production">Production (CT-KZ)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="supply" id="type_supply" />
                          <Label htmlFor="type_supply">Supply</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {productFormData.type === 'production' && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="product_is_ctkz"
                          checked={productFormData.is_ctkz}
                          onCheckedChange={(checked) => setProductFormData({ ...productFormData, is_ctkz: checked })}
                        />
                        <Label htmlFor="product_is_ctkz">CT-KZ Certified</Label>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product_tags">Tags (comma separated)</Label>
                    <Input
                      id="product_tags"
                      value={productFormData.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tagsString = e.target.value;
                        const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : null;
                        setProductFormData({ ...productFormData, tags: tagsArray });
                      }}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="product_is_featured"
                      checked={productFormData.is_featured}
                      onCheckedChange={(checked) => setProductFormData({ ...productFormData, is_featured: checked })}
                    />
                    <Label htmlFor="product_is_featured">Featured Product</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div>
              <Label htmlFor="type-filter">Filter by Type:</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="supply">Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="ctkz-filter">Filter by CT-KZ:</Label>
              <Select value={ctkzFilter} onValueChange={setCtkzFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ctkz">CT-KZ Only</SelectItem>
                  <SelectItem value="non-ctkz">Non CT-KZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setTypeFilter('all');
                setCtkzFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                       <div className="flex items-center gap-2 mt-2">
                         {product.sku && (
                           <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                             SKU: {product.sku}
                           </span>
                         )}
                         
                         <span className={`px-2 py-1 rounded text-xs ${
                           product.type === 'production' 
                             ? 'bg-purple-100 text-purple-800' 
                             : 'bg-green-100 text-green-800'
                         }`}>
                           {product.type === 'production' ? 'Production' : 'Supply'}
                         </span>
                         
                         {product.is_ctkz && (
                           <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1">
                             <Badge className="h-3 w-3" />
                             CT-KZ
                           </span>
                         )}
                         
                         <span className={`px-2 py-1 rounded text-xs ${
                           product.is_featured 
                             ? 'bg-blue-100 text-blue-800' 
                             : 'bg-gray-100 text-gray-800'
                         }`}>
                           {product.is_featured ? 'Featured' : 'Regular'}
                         </span>
                         
                         {product.tags && product.tags.length > 0 && (
                           <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-800">
                             {product.tags.length} tag{product.tags.length > 1 ? 's' : ''}
                           </span>
                         )}
                       </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product);
                          setProductFormData({
                            title: product.title,
                            slug: product.slug,
                            description: product.description || '',
                            content_rich: product.content_rich,
                            featured_image: product.featured_image || '',
                            gallery_images: product.gallery_images || [],
                            pdf_files: product.pdf_files || [],
                            video_url: product.video_url || '',
                            category_id: product.category_id,
                            sku: product.sku || '',
                            manufacturer: product.manufacturer || '',
                            specifications: product.specifications,
                            is_featured: product.is_featured,
                            order: product.order,
                            type: product.type,
                            is_ctkz: product.is_ctkz,
                            tags: product.tags
                          });
                          setIsProductDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCatalog;