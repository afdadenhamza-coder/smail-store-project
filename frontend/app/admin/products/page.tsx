"use client";

import { useState, useEffect } from "react";
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductCreateData,
} from "@/lib/admin-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<ProductCreateData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    offer_price: 0,
    has_offer: false,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    category: "",
    is_active: true,
    is_featured: false,
    is_upsell: false,
    rating: 0,
    reviews_count: 0,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as any;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "offer_price" ||
        name === "rating" ||
        name === "reviews_count"
          ? parseFloat(value) || 0
          : newValue,
    }));
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = sessionStorage.getItem("admin_token");
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, images: [...prev.images, data.url] }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!formData.name || !formData.slug || !formData.price) {
        setError("Please fill in required fields");
        return;
      }

      if (editingId) {
        await updateProduct(editingId, formData);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(formData);
        setSuccess("Product created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: 0,
        offer_price: 0,
        has_offer: false,
        images: [],
        sizes: ["S", "M", "L", "XL"],
        category: "",
        is_active: true,
        is_featured: false,
        is_upsell: false,
        rating: 0,
        reviews_count: 0,
      });
      await loadProducts();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: (product as any).description || "",
      price: product.price,
      offer_price: product.offer_price || 0,
      has_offer: product.has_offer,
      images: product.images,
      sizes: (product as any).sizes || ["S", "M", "L", "XL"],
      category: product.category || "",
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_upsell: product.is_upsell,
      rating: (product as any).rating || 0,
      reviews_count: (product as any).reviews_count || 0,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setSuccess("Product deleted successfully!");
      await loadProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      offer_price: 0,
      has_offer: false,
      images: [],
      sizes: ["S", "M", "L", "XL"],
      category: "",
      is_active: true,
      is_featured: false,
      is_upsell: false,
      rating: 0,
      reviews_count: 0,
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">المنتجات</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-brand-terracotta text-white rounded-lg hover:opacity-90 transition-all"
          >
            + منتج جديد
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">
            {editingId ? "تعديل المنتج" : "منتج جديد"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="قميص تي شيرت"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="tshirt-blue"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">الوصف</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف المنتج..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50 min-h-24"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  السعر (MAD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="199.99"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  سعر العرض
                </label>
                <input
                  type="number"
                  name="offer_price"
                  value={formData.offer_price}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="149.99"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  الفئة
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="t-shirts"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">التقييم (نجوم)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                    className="p-1 transition-all"
                  >
                    <svg
                      className={`w-6 h-6 ${star <= (formData.rating || 0) ? "text-brand-terracotta" : "text-gray-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-gray-500 mb-1">الصور</label>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 border-dashed border-white/20 rounded-lg hover:border-brand-terracotta/50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                  disabled={uploading}
                />
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm text-gray-400">
                  {uploading ? "جاري الرفع..." : "انقر لرفع صورة"}
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500/80 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_offer"
                  checked={formData.has_offer}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-400">عرض فعال</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-400">نشط</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-400">مميز</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_upsell"
                  checked={formData.is_upsell}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-400">Upsell</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-brand-terracotta text-white rounded-lg hover:opacity-90 transition-all font-medium"
              >
                {editingId ? "تحديث" : "إنشاء"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-gray-400">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400">لا توجد منتجات</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-white/20 transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-white">{product.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span>السعر: {product.price} MAD</span>
                    {product.has_offer && (
                      <span className="text-brand-terracotta">
                        العرض: {product.offer_price} MAD
                      </span>
                    )}
                    <span
                      className={
                        product.is_active ? "text-green-400" : "text-red-400"
                      }
                    >
                      {product.is_active ? "✓ نشط" : "✗ معطل"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
