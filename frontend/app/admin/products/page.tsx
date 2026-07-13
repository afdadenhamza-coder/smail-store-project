"use client";

import { useState, useEffect } from "react";
import { fetchAllProducts, createProduct, updateProduct, deleteProduct, Product, ProductCreateData } from "@/lib/admin-api";

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

  const [imageInput, setImageInput] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "offer_price" || name === "rating" || name === "reviews_count"
        ? parseFloat(value) || 0
        : newValue,
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
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
      price: product.price,
      offer_price: product.offer_price || 0,
      has_offer: product.has_offer,
      images: product.images,
      category: product.category || "",
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_upsell: product.is_upsell,
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
                <label className="block text-xs text-gray-500 mb-1">اسم المنتج *</label>
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
                <label className="block text-xs text-gray-500 mb-1">Slug *</label>
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
                <label className="block text-xs text-gray-500 mb-1">السعر (MAD) *</label>
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
                <label className="block text-xs text-gray-500 mb-1">سعر العرض</label>
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
                <label className="block text-xs text-gray-500 mb-1">الفئة</label>
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

            <div className="space-y-2">
              <label className="block text-xs text-gray-500">الصور</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-terracotta/50"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg text-xs text-gray-400">
                    <span className="truncate max-w-[150px]">{img}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-red-400 hover:text-red-300"
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
                    <span className={product.is_active ? "text-green-400" : "text-red-400"}>
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
