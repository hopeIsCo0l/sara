'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  Search,
  Sun,
  Volume2,
  Package,
  Layers,
  Wrench,
  LogOut,
  ShieldCheck,
  Tag,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import {
  getCategories,
  getProducts,
  getServices,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageToSupabase,
  createCategory,
  createService,
  supabase,
} from '@/lib/supabase';
import { Category, Product, Service, StockStatus } from '@/lib/types';
import { COMPANY_NAME, PRIMARY_PHONE } from '@/lib/constants';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab: 'products' | 'categories' | 'services'
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'services'>('products');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategorySlug, setProdCategorySlug] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(10000);
  const [prodSku, setProdSku] = useState('');
  const [prodStockStatus, setProdStockStatus] = useState<StockStatus>('in_stock');
  const [prodDescription, setProdDescription] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(true);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Tech Specs Key-Values
  const [specBrand, setSpecBrand] = useState('Sebrin Certified');
  const [specPower, setSpecPower] = useState('');
  const [specVoltage, setSpecVoltage] = useState('');
  const [specWarranty, setSpecWarranty] = useState('2-Year Manufacturer Warranty');

  // Check Session Auth on Mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('sebrin_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load Data
  const loadAllData = async () => {
    setLoading(true);
    const [cats, prods, srvs] = await Promise.all([
      getCategories(),
      getProducts(),
      getServices(),
    ]);
    setCategories(cats);
    setProducts(prods);
    setServices(srvs);
    if (cats.length > 0 && !prodCategorySlug) {
      setProdCategorySlug(cats[0].slug);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: sebrin2026 (or admin)
    if (passcode === 'sebrin2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sebrin_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sebrin_admin_auth');
  };

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const publicUrl = await uploadImageToSupabase(file);
    if (publicUrl) {
      setProdImageUrl(publicUrl);
    } else {
      alert('Failed to upload image to Supabase Storage. You can paste an Image URL manually.');
    }
    setUploadingImage(false);
  };

  // Create Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert('Please enter a product name');
      return;
    }

    setSubmitting(true);
    const slug = prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const selectedCat = categories.find((c) => c.slug === prodCategorySlug) || categories[0];

    const finalImage = prodImageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop';

    const detailsObj: Record<string, string> = {};
    if (specBrand) detailsObj.brand = specBrand;
    if (specPower) detailsObj.power_output = specPower;
    if (specVoltage) detailsObj.voltage = specVoltage;
    if (specWarranty) detailsObj.warranty = specWarranty;

    const newProd = await createProduct(
      {
        category_id: selectedCat?.id,
        name: prodName,
        slug,
        sku: prodSku || `SEB-${Math.floor(1000 + Math.random() * 9000)}`,
        price: Number(prodPrice),
        currency: 'ETB',
        description: prodDescription || `${prodName} supplied by Sebrin Trading PLC.`,
        details: detailsObj,
        is_featured: prodIsFeatured,
        is_visible: true,
        stock_status: prodStockStatus,
      },
      [finalImage]
    );

    setSubmitting(false);

    if (newProd || !supabase) {
      alert('Product created successfully!');
      setIsProductModalOpen(false);
      // Reset Form
      setProdName('');
      setProdPrice(10000);
      setProdSku('');
      setProdDescription('');
      setProdImageUrl('');
      await loadAllData();
    } else {
      alert('Failed to save product in Supabase.');
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product from database.');
      }
    }
  };

  // Toggle Stock Status
  const handleToggleStock = async (id: string, currentStatus: StockStatus) => {
    const nextStatus: StockStatus = currentStatus === 'in_stock' ? 'sold_out' : 'in_stock';
    const success = await updateProduct(id, { stock_status: nextStatus });
    if (success) {
      setProducts(products.map((p) => (p.id === id ? { ...p, stock_status: nextStatus } : p)));
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const success = await updateProduct(id, { is_featured: !currentFeatured });
    if (success) {
      setProducts(products.map((p) => (p.id === id ? { ...p, is_featured: !currentFeatured } : p)));
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ----------------------------------------------------------------------
  // UNAUTHENTICATED LOGIN SCREEN
  // ----------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-kith-card border border-kith-border p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-kith-subBg border border-kith-border rounded-full text-kith-bone mb-2">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-kith uppercase text-kith-bone">
              {COMPANY_NAME}
            </h1>
            <p className="text-xs font-mono text-kith-muted uppercase tracking-widest">
              ADMINISTRATIVE DESK LOGIN
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-superwide text-kith-muted uppercase">
                ENTER ADMIN PASSCODE
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (Default: sebrin2026)"
                className="w-full bg-kith-subBg border border-kith-border px-4 py-3 text-xs font-mono text-kith-bone focus:outline-none focus:border-kith-bone transition-colors"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Invalid passcode. Try "sebrin2026".
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-lg"
            >
              UNLOCK ADMIN DASHBOARD →
            </button>
          </form>

          <div className="pt-4 border-t border-kith-border text-center text-[10px] font-mono text-kith-darkMuted">
            AUTHENTICATED ACCESS ONLY • SUPABASE REST API
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------------------------
  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-kith-border pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-superwide text-kith-muted uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SEBRIN TRADING PLC // LIVE CATALOG MANAGEMENT
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight uppercase text-kith-bone flex items-center gap-3">
            EQUIPMENT ADMIN DASHBOARD
          </h1>
        </div>

        {/* Action Controls & Logout */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={loadAllData}
            className="px-3.5 py-2 border border-kith-border bg-kith-card text-kith-bone hover:border-kith-bone text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Refresh Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>

          <button
            onClick={() => setIsProductModalOpen(true)}
            className="px-4 py-2 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> ADD PRODUCT
          </button>

          <button
            onClick={handleLogout}
            className="p-2 border border-kith-border bg-kith-card text-kith-muted hover:text-rose-400 hover:border-rose-400/50 transition-colors"
            title="Logout Admin Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-kith-card border border-kith-border p-5 space-y-1">
          <span className="text-[10px] font-mono text-kith-darkMuted uppercase block">TOTAL PRODUCTS</span>
          <span className="text-2xl font-mono font-extrabold text-kith-bone">{products.length}</span>
        </div>

        <div className="bg-kith-card border border-kith-border p-5 space-y-1">
          <span className="text-[10px] font-mono text-kith-darkMuted uppercase block">CATEGORIES</span>
          <span className="text-2xl font-mono font-extrabold text-sky-400">{categories.length}</span>
        </div>

        <div className="bg-kith-card border border-kith-border p-5 space-y-1">
          <span className="text-[10px] font-mono text-kith-darkMuted uppercase block">IN STOCK ITEMS</span>
          <span className="text-2xl font-mono font-extrabold text-emerald-500">
            {products.filter((p) => p.stock_status === 'in_stock').length}
          </span>
        </div>

        <div className="bg-kith-card border border-kith-border p-5 space-y-1">
          <span className="text-[10px] font-mono text-kith-darkMuted uppercase block">SERVICES</span>
          <span className="text-2xl font-mono font-extrabold text-amber-500">{services.length}</span>
        </div>
      </div>

      {/* Tab Switcher & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kith-border pb-4">
        <div className="flex items-center gap-2 border border-kith-border bg-kith-card p-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'products'
                ? 'bg-kith-btnPrimaryBg text-kith-btnPrimaryText font-bold shadow'
                : 'text-kith-muted hover:text-kith-bone'
            }`}
          >
            PRODUCTS ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'categories'
                ? 'bg-kith-btnPrimaryBg text-kith-btnPrimaryText font-bold shadow'
                : 'text-kith-muted hover:text-kith-bone'
            }`}
          >
            CATEGORIES ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'services'
                ? 'bg-kith-btnPrimaryBg text-kith-btnPrimaryText font-bold shadow'
                : 'text-kith-muted hover:text-kith-bone'
            }`}
          >
            SERVICES ({services.length})
          </button>
        </div>

        {/* Search Bar for Products */}
        {activeTab === 'products' && (
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory..."
              className="w-full bg-kith-subBg border border-kith-border px-3 py-2 pl-9 text-xs font-mono text-kith-bone placeholder-kith-darkMuted focus:outline-none focus:border-kith-bone"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-kith-darkMuted" />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PRODUCTS TAB TABLE */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'products' && (
        <div className="bg-kith-card border border-kith-border overflow-x-auto">
          <table className="w-full text-left text-xs font-mono divide-y divide-kith-border">
            <thead className="bg-kith-subBg text-kith-muted uppercase tracking-widest text-[10px]">
              <tr>
                <th className="py-3.5 px-4">ITEM</th>
                <th className="py-3.5 px-4">CATEGORY</th>
                <th className="py-3.5 px-4">PRICE (ETB)</th>
                <th className="py-3.5 px-4">STOCK STATUS</th>
                <th className="py-3.5 px-4">FEATURED</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-kith-border/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-kith-muted">
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const primaryImg = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop';
                  return (
                    <tr key={p.id} className="hover:bg-kith-subBg/50 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-kith-subBg border border-kith-border overflow-hidden flex-shrink-0">
                          <Image src={primaryImg} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-0.5 max-w-xs">
                          <Link href={`/catalog/${p.slug}`} className="font-bold text-kith-bone hover:text-kith-accent line-clamp-1">
                            {p.name}
                          </Link>
                          {p.sku && <span className="text-[10px] text-kith-darkMuted block">SKU: {p.sku}</span>}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-kith-muted uppercase">
                        {p.category?.name || 'UNASSIGNED'}
                      </td>

                      {/* Price in ETB */}
                      <td className="py-3 px-4 font-bold text-kith-bone whitespace-nowrap">
                        {p.price.toLocaleString()} ETB
                      </td>

                      {/* Stock Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(p.id, p.stock_status)}
                          className={`px-2.5 py-1 text-[9px] uppercase tracking-widest border transition-colors ${
                            p.stock_status === 'in_stock'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30'
                          }`}
                          title="Click to toggle stock status"
                        >
                          {p.stock_status.replace('_', ' ')}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(p.id, p.is_featured)}
                          className={`text-xs ${p.is_featured ? 'text-amber-500 font-bold' : 'text-kith-darkMuted'}`}
                        >
                          {p.is_featured ? '★ YES' : '☆ NO'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/catalog/${p.slug}`}
                          className="p-1.5 inline-block text-kith-muted hover:text-kith-bone"
                          title="View Specs Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-kith-muted hover:text-rose-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CATEGORIES TAB TABLE */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'categories' && (
        <div className="bg-kith-card border border-kith-border overflow-x-auto">
          <table className="w-full text-left text-xs font-mono divide-y divide-kith-border">
            <thead className="bg-kith-subBg text-kith-muted uppercase tracking-widest text-[10px]">
              <tr>
                <th className="py-3.5 px-4">CATEGORY NAME</th>
                <th className="py-3.5 px-4">SLUG</th>
                <th className="py-3.5 px-4">DESCRIPTION</th>
                <th className="py-3.5 px-4 text-right">ORDER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kith-border/60">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-kith-subBg/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-kith-bone uppercase">{cat.name}</td>
                  <td className="py-3 px-4 text-sky-400">{cat.slug}</td>
                  <td className="py-3 px-4 text-kith-muted max-w-md truncate">{cat.description || '—'}</td>
                  <td className="py-3 px-4 text-right font-bold text-kith-bone">{cat.display_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SERVICES TAB TABLE */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {services.map((srv, idx) => (
            <div key={srv.id} className="bg-kith-card border border-kith-border p-6 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-kith-darkMuted uppercase">SERVICE 0{idx + 1}</span>
                  <h3 className="text-lg font-bold text-kith-bone uppercase">{srv.title}</h3>
                  <p className="text-xs text-kith-muted">{srv.subtitle}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-mono border border-emerald-500/30">
                  {srv.price_range || 'Custom Quote'}
                </span>
              </div>
              <p className="text-xs font-mono text-kith-bone">{srv.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CREATE PRODUCT MODAL */}
      {/* ------------------------------------------------------------------ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-kith-card border border-kith-border p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-kith-border pb-4">
              <h2 className="text-xl font-extrabold uppercase text-kith-bone tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" /> ADD NEW EQUIPMENT ITEM
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-kith-muted hover:text-kith-bone"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-mono">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-kith-muted">EQUIPMENT NAME *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Must 5.5kW Hybrid Solar Inverter"
                  className="w-full bg-kith-subBg border border-kith-border px-3 py-2.5 text-kith-bone focus:outline-none focus:border-kith-bone"
                />
              </div>

              {/* Category & Price Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-kith-muted">CATEGORY *</label>
                  <select
                    value={prodCategorySlug}
                    onChange={(e) => setProdCategorySlug(e.target.value)}
                    className="w-full bg-kith-subBg border border-kith-border px-3 py-2.5 text-kith-bone focus:outline-none focus:border-kith-bone uppercase"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-kith-muted">PRICE IN ETB *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-kith-subBg border border-kith-border px-3 py-2.5 text-kith-bone focus:outline-none focus:border-kith-bone"
                  />
                </div>
              </div>

              {/* SKU & Stock Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-kith-muted">SKU CODE</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="e.g. SEB-INV-5500"
                    className="w-full bg-kith-subBg border border-kith-border px-3 py-2.5 text-kith-bone focus:outline-none focus:border-kith-bone"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-kith-muted">STOCK STATUS</label>
                  <select
                    value={prodStockStatus}
                    onChange={(e) => setProdStockStatus(e.target.value as StockStatus)}
                    className="w-full bg-kith-subBg border border-kith-border px-3 py-2.5 text-kith-bone focus:outline-none focus:border-kith-bone uppercase"
                  >
                    <option value="in_stock">IN STOCK</option>
                    <option value="low_stock">LOW STOCK</option>
                    <option value="preorder">PRE-ORDER</option>
                    <option value="sold_out">SOLD OUT</option>
                  </select>
                </div>
              </div>

              {/* Technical Specs */}
              <div className="space-y-2 border-t border-kith-border pt-4">
                <label className="text-[10px] uppercase text-kith-bone font-bold block">TECHNICAL SPECIFICATIONS</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={specBrand}
                    onChange={(e) => setSpecBrand(e.target.value)}
                    placeholder="Brand (e.g. JBL / Jinko)"
                    className="bg-kith-subBg border border-kith-border px-3 py-2 text-kith-bone"
                  />
                  <input
                    type="text"
                    value={specPower}
                    onChange={(e) => setSpecPower(e.target.value)}
                    placeholder="Power (e.g. 550W / 2000W)"
                    className="bg-kith-subBg border border-kith-border px-3 py-2 text-kith-bone"
                  />
                  <input
                    type="text"
                    value={specVoltage}
                    onChange={(e) => setSpecVoltage(e.target.value)}
                    placeholder="Voltage (e.g. 48V / 230V)"
                    className="bg-kith-subBg border border-kith-border px-3 py-2 text-kith-bone"
                  />
                  <input
                    type="text"
                    value={specWarranty}
                    onChange={(e) => setSpecWarranty(e.target.value)}
                    placeholder="Warranty (e.g. 2-Year)"
                    className="bg-kith-subBg border border-kith-border px-3 py-2 text-kith-bone"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-2 border-t border-kith-border pt-4">
                <label className="text-[10px] uppercase text-kith-bone font-bold block">PRODUCT IMAGE</label>

                {/* Upload to Supabase Storage */}
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-kith-subBg border border-kith-border hover:border-kith-bone cursor-pointer text-kith-bone flex items-center gap-2">
                    <Upload className="w-4 h-4 text-sky-400" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File to Supabase Storage'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-[10px] text-kith-darkMuted">OR</span>
                </div>

                {/* Direct Image URL */}
                <input
                  type="text"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="Or paste image URL (e.g. Unsplash URL)"
                  className="w-full bg-kith-subBg border border-kith-border px-3 py-2 text-kith-bone"
                />

                {/* Preview */}
                {prodImageUrl && (
                  <div className="relative w-24 h-28 border border-kith-border overflow-hidden mt-2">
                    <Image src={prodImageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1 border-t border-kith-border pt-4">
                <label className="text-[10px] uppercase text-kith-muted">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Detailed product technical overview..."
                  className="w-full bg-kith-subBg border border-kith-border p-3 text-kith-bone focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-kith-border">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 border border-kith-border text-kith-muted hover:text-kith-bone"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg"
                >
                  {submitting ? 'SAVING...' : 'SAVE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
