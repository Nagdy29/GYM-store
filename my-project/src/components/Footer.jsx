import { Link } from "react-router-dom";
import {
  Dumbbell,
  ArrowLeft,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-20 bg-black text-white">
      {/* GREEN LINE */}
      <div className="h-1 w-full bg-[#39ff14]" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="mb-5 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#39ff14] text-black shadow-[0_0_25px_rgba(57,255,20,0.15)]">
                <Dumbbell
                  size={25}
                  strokeWidth={2.7}
                />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-wide">
                  ZENGER
                </h2>

                <p className="text-[10px] font-bold tracking-[0.2em] text-[#39ff14]">
                  GYM STORE
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-8 text-zinc-400">
              كل اللي تحتاجه للچيم في مكان واحد.
              ملابس رياضية، إكسسوارات، واختيارات
              مناسبة للتمرين والحركة اليومية.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-lg font-black">
              روابط سريعة
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                المنتجات
              </Link>

              <Link
                to="/categories"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                الأقسام
              </Link>

              <Link
                to="/products?offer=true"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                العروض
              </Link>

              <Link
                to="/cart"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                سلة التسوق
              </Link>

              <Link
                to="/checkout"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                إتمام الطلب
              </Link>
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="mb-5 text-lg font-black">
              تسوق حسب القسم
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/products?category=tshirts"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                تيشيرتات
              </Link>

              <Link
                to="/products?category=pants"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                بنطلونات
              </Link>

              <Link
                to="/products?category=shorts"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                شورتات
              </Link>

              <Link
                to="/products?category=accessories"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                إكسسوارات
              </Link>

              <Link
                to="/products?category=supplements"
                className="text-sm text-zinc-400 transition-colors duration-300 hover:text-[#39ff14]"
              >
                مكملات
              </Link>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="mb-5 text-lg font-black">
              تابعنا
            </h3>

            <p className="mb-5 text-sm leading-7 text-zinc-400">
              تابع ZENGER لمعرفة أحدث المنتجات
              والعروض وكل جديد عندنا.
            </p>

            <div className="flex gap-3">

              {/* INSTAGRAM */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm font-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#39ff14] hover:text-black"
              >
                IG
              </a>

              {/* TELEGRAM */}
              <a
                href="#"
                aria-label="Telegram"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm font-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#39ff14] hover:text-black"
              >
                TG
              </a>

              {/* WHATSAPP */}
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm font-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#39ff14] hover:text-black"
              >
                WA
              </a>

            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px bg-white/10" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right">

          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} ZENGER GYM STORE.
            جميع الحقوق محفوظة.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#39ff14] transition-all duration-300 hover:gap-3"
          >
            ابدأ التسوق الآن
            <ArrowLeft size={17} />
          </Link>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
