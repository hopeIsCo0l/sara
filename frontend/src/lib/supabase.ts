import { createClient } from '@supabase/supabase-js';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES } from './mockData';
import { Category, Product, Service } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all categories (from Supabase or fallback to mock data)
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
      .eq('is_visible', true)
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
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return MOCK_SERVICES;
    return data as Service[];
  } catch (err) {
    return MOCK_SERVICES;
  }
}
