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
 * Upload an image file to Supabase Storage bucket 'product-media'
 */
export async function uploadImageToSupabase(file: File): Promise<string | null> {
  if (!supabase) return null;

  try {
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const { data, error } = await supabase.storage
      .from('product-media')
      .upload(filename, file, { upsert: true });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-media')
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload image:', err);
    return null;
  }
}

/**
 * Create a new product in Supabase
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

    // Insert image records
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
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        price: updates.price,
        stock_status: updates.stock_status,
        is_featured: updates.is_featured,
        is_visible: updates.is_visible,
        description: updates.description,
        sku: updates.sku,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return false;
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
    // Delete related images first
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
export async function createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('categories').insert(cat);
    if (error) {
      console.error('Error creating category:', error);
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
export async function createService(service: Omit<Service, 'id' | 'created_at'>): Promise<boolean> {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('services').insert(service);
    if (error) {
      console.error('Error creating service:', error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
