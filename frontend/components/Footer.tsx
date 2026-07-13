import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(192,112,64,0.12),transparent_50%),linear-gradient(180deg,#070707_0%,#0d0d11_100%)] text-white md:mt-20">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2.5 md:mb-5">
              <img
                src="/images/SmailStore Logo.jpg"
                alt="Smail Store"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-terracotta/20 shadow-[0_8px_24px_rgba(192,112,64,0.18)]"
              />
              <span className="text-base font-bold md:text-lg">
                Smail <span className="text-brand-terracotta">Store</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#cfcfd5]">
              أول ماركة مغربية ديال الستريوير بشهادة الجودة. جودة عالمية، روح
              مغربية. التوصيل ف 3 حتي 5 أيام فجميع مدن المغرب.
            </p>
            <div className="mt-5 flex gap-2 md:gap-3">
              <a href="https://www.instagram.com/smailstore75/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-[#E4405F]/20 group md:h-10 md:w-10" aria-label="Instagram">
                <svg className="h-4 w-4 text-gray-400 group-hover:text-[#E4405F] md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1AFaoH7Ej1/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-[#1877F2]/20 group md:h-10 md:w-10" aria-label="Facebook">
                <svg className="h-4 w-4 text-gray-400 group-hover:text-[#1877F2] md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://wa.me/212600294302" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-[#25D366]/20 group md:h-10 md:w-10" aria-label="WhatsApp">
                <svg className="h-4 w-4 text-gray-400 group-hover:text-[#25D366] md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white md:mb-4 md:text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-[#cfcfd5] md:space-y-3 md:text-sm">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/collections/t-shirts", label: "تيشيرتات" },
                { href: "/collections/hoodies", label: "هوديات" },
                { href: "/location", label: "موقع المحل" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "اتصل بنا" },
              ].map((link) => (
                <li key={link.href}><Link href={link.href} className="transition-colors hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white md:mb-4 md:text-sm">لماذا تثق فينا</h4>
            <ul className="space-y-2 text-sm text-[#cfcfd5] md:space-y-3">
              <li className="flex items-center gap-2"><span className="text-sm">✓</span> شهادة الجودة المضمونة</li>
              <li className="flex items-center gap-2"><span className="text-sm">🚚</span> التوصيل ف 3-5 أيام</li>
              <li className="flex items-center gap-2"><span className="text-sm">💵</span> الدفع عند الإستلام</li>
              <li className="flex items-center gap-2"><span className="text-sm">🔄</span> التبديل و الإرجاع</li>
              <li className="flex items-center gap-2"><span className="text-sm">⭐</span> +500 راجل واثق فينا</li>
              <li className="flex items-center gap-2"><span className="text-sm">📦</span> تغليف فاخر لجميع الطلبات</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[10px] text-gray-500 md:mt-12 md:flex-row md:gap-4 md:pt-8 md:text-sm">
          <span>© 2024 Smail Store. جميع الحقوق محفوظة.</span>
          <span className="text-gray-600">جودة عالمية، روح مغربية</span>
        </div>
      </div>
    </footer>
  );
}
