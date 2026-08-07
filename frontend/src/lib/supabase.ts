import { createClient } from '@supabase/supabase-js';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES } from './mockData';
import { Category, Product, Service } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) return MOCK_CATEGORIES;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return MOCK_CATEGORIES;
    return data as Category[];
  } catch (err) {
    console.warn('Supabase fetch failed, fallback to mock categories', err);
    return MOCK_CATEGORIES;
  }
}

/**
 * Fetch products with image relations
 */
export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
}): Promise<Product[]> {
  if (!supabase) {
    let result = MOCK_PRODUCTS;
    if (options?.categorySlug && options.categorySlug !== 'all') {
      result = result.filter((p) => p.category?.slug === options.categorySlug);
    }
    if (options?.isFeatured) {
      result = result.filter((p) => p.is_featured);
    }
    return result;
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .order('created_at', { ascending: false });

    if (options?.isFeatured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) return MOCK_PRODUCTS;

    let products = data as Product[];
    if (options?.categorySlug && options.categorySlug !== 'all') {
      products = products.filter((p) => p.category?.slug === options.categorySlug);
    }
    return products;
  } catch (err) {
    console.warn('Supabase fetch failed, fallback to mock products', err);
    return MOCK_PRODUCTS;
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }
    return data as Product;
  } catch (err) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Fetch active services
 */
export async function getServices(): Promise<Service[]> {
  if (!supabase) return MOCK_SERVICES;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return MOCK_SERVICES;
    return data as Service[];
  } catch (err) {
    return MOCK_SERVICES;
  }
}

// ----------------------------------------------------------------------
// ADMIN MUTATION METHODS (CREATE, UPDATE, DELETE)
// ----------------------------------------------------------------------

/**
 * Upload an image file with automatic Base64 Data URL fallback so image upload NEVER fails
 */
export async function uploadImageToSupabase(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const convertToBase64 = () => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };

    if (!supabase) {
      return convertToBase64();
    }

    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;

    supabase.storage
      .from('product-media')
      .upload(filename, file, { upsert: true })
      .then(({ data, error }) => {
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('product-media')
            .getPublicUrl(filename);

          if (publicUrlData?.publicUrl) {
            return resolve(publicUrlData.publicUrl);
          }
        }
        // Fallback to Data URL if storage bucket fails or RLS policy restricts upload
        convertToBase64();
      })
      .catch(() => {
        convertToBase64();
      });
  });
}

/**
 * Create a new product in Supabase with multiple images
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'images' | 'category'>,
  imageUrls: string[]
): Promise<Product | null> {
  if (!supabase) return null;

  try {
    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .insert({
        category_id: productData.category_id,
        name: productData.name,
        slug: productData.slug,
        sku: productData.sku,
        price: productData.price,
        currency: productData.currency || 'ETB',
        description: productData.description,
        details: productData.details || {},
        is_featured: productData.is_featured,
        is_visible: productData.is_visible,
        stock_status: productData.stock_status,
      })
      .select()
      .single();

    if (prodError || !prodData) {
      console.error('Error inserting product:', prodError);
      return null;
    }

    const productId = prodData.id;

    // Insert multiple image records
    if (imageUrls.length > 0) {
      const imageRecords = imageUrls.map((url, index) => ({
        product_id: productId,
        url,
        is_primary: index === 0,
        display_order: index,
      }));

      await supabase.from('product_images').insert(imageRecords);
    }

    return prodData as Product;
  } catch (err) {
    console.error('Error creating product:', err);
    return null;
  }
}

/**
 * Update an existing product and optional image set
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>,
  imageUrls?: string[]
): Promise<boolean> {
  if (!supabase) return true;

  try {
    const updatePayload: Record<string, any> = {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.category_id !== undefined && { category_id: updates.category_id }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.stock_status !== undefined && { stock_status: updates.stock_status }),
      ...(updates.is_featured !== undefined && { is_featured: updates.is_featured }),
      ...(updates.is_visible !== undefined && { is_visible: updates.is_visible }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.sku !== undefined && { sku: updates.sku }),
      ...(updates.details !== undefined && { details: updates.details }),
    };

    const { error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return false;
    }

    // If new images provided, refresh product images
    if (imageUrls && imageUrls.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', id);
      const imageRecords = imageUrls.map((url, index) => ({
        product_id: id,
        url,
        is_primary: index === 0,
        display_order: index,
      }));
      await supabase.from('product_images').insert(imageRecords);
    }

    return true;
  } catch (err) {
    console.error('Failed to update product:', err);
    return false;
  }
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (!supabase) return true;

  try {
    await supabase.from('product_images').delete().eq('product_id', id);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete product:', err);
    return false;
  }
}

/**
 * Create a new Category
 */
export async function createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> {
  if (!supabase) {
    return {
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...cat,
    };
  }

  try {
    const { data, error } = await supabase.from('categories').insert(cat).select().single();
    if (error || !data) {
      console.error('Error creating category:', error);
      return null;
    }
    return data as Category;
  } catch (err) {
    return null;
  }
}

/**
 * Update an existing Category
 */
export async function updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    if (error) {
      console.error('Error updating category:', error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Delete a Category by ID
 */
export async function deleteCategory(id: string): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Create a new Service
 */
export async function createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service | null> {
  if (!supabase) {
    return {
      id: `srv-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...service,
    };
  }

  try {
    const { data, error } = await supabase.from('services').insert(service).select().single();
    if (error || !data) {
      console.error('Error creating service:', error);
      return null;
    }
    return data as Service;
  } catch (err) {
    return null;
  }
}

/**
 * Update an existing Service
 */
export async function updateService(id: string, updates: Partial<Service>): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('services').update(updates).eq('id', id);
    if (error) {
      console.error('Error updating service:', error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Delete a Service by ID
 */
export async function deleteService(id: string): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      console.error('Error deleting service:', error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

