import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Phone,
} from "lucide-react";

function Footer() {
  return (
    <footer
      dir="rtl"
      className="mt-0 border-t border-white/10 bg-black text-white"
    >
      {/* =====================================================
          GREEN TOP LINE
      ====================================================== */}

      <div className="h-[2px] w-full bg-[#39ff14]" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* =====================================================
            FOOTER GRID
        ====================================================== */}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <div>
            <Link
              to="/"
              className="group mb-6 inline-flex items-center gap-3"
            >
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  overflow-hidden
                  rounded-xl
                  bg-white
                  shadow-[0_0_30px_rgba(57,255,20,0.12)]
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:shadow-[0_0_35px_rgba(57,255,20,0.22)]
                "
              >
                <img
                  src="/hiraql-logo.jpg"
                  alt="HIRAQL"
                  className="h-9 w-9 object-contain"
                />
              </div>

              <div className="leading-none">
                <h2 className="text-2xl font-black tracking-wide text-white">
                  HIRAQL
                </h2>

                <p className="mt-2 text-[9px] font-bold tracking-[0.25em] text-[#39ff14]">
                  GYM STORE
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-8 text-zinc-400">
              كل اللي تحتاجه للچيم في مكان واحد.
              ملابس رياضية، إكسسوارات، واختيارات
              مناسبة للتمرين والحركة اليومية.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

              <span className="text-[11px] font-bold text-zinc-500">
                Train Hard. Wear Better.
              </span>
            </div>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}

          <div>
            <h3 className="mb-6 text-base font-black text-white">
              روابط سريعة
            </h3>

            <div className="flex flex-col gap-4">

              <Link
                to="/"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                المنتجات
              </Link>

              <Link
                to="/categories"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                الأقسام
              </Link>

              <Link
                to="/products?offer=true"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                العروض
              </Link>

              <Link
                to="/cart"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                سلة التسوق
              </Link>

              <Link
                to="/checkout"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                إتمام الطلب
              </Link>

            </div>
          </div>

          {/* =====================================================
              CATEGORIES
          ====================================================== */}

          <div>
            <h3 className="mb-6 text-base font-black text-white">
              تسوق حسب القسم
            </h3>

            <div className="flex flex-col gap-4">

              <Link
                to="/products?category=tshirts"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                تيشيرتات
              </Link>

              <Link
                to="/products?category=pants"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                بنطلونات
              </Link>

              <Link
                to="/products?category=shorts"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                شورتات
              </Link>

              <Link
                to="/products?category=accessories"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                إكسسوارات
              </Link>

              <Link
                to="/products?category=supplements"
                className="
                  text-sm text-zinc-400
                  transition-all duration-300
                  hover:translate-x-[-3px]
                  hover:text-[#39ff14]
                "
              >
                مكملات
              </Link>

            </div>
          </div>

          {/* =====================================================
              CONTACT / SOCIAL
          ====================================================== */}

          <div>
            <h3 className="mb-6 text-base font-black text-white">
              تواصل معانا
            </h3>

            <p className="mb-6 text-sm leading-7 text-zinc-400">
              لو عندك أي سؤال أو محتاج مساعدة،
              تقدر تتواصل معانا بسهولة.
            </p>

            <div className="flex gap-3">

              {/* WHATSAPP */}

              <a
                href="#"
                aria-label="واتساب"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-zinc-300
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#39ff14]/30
                  hover:bg-[#39ff14]
                  hover:text-black
                "
              >
                <MessageCircle size={19} />
              </a>

              {/* TELEGRAM */}

              <a
                href="#"
                aria-label="تيليجرام"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-zinc-300
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#39ff14]/30
                  hover:bg-[#39ff14]
                  hover:text-black
                "
              >
                <Send size={18} />
              </a>

              {/* PHONE */}

              <a
                href="tel:"
                aria-label="اتصل بنا"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  text-zinc-300
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[#39ff14]/30
                  hover:bg-[#39ff14]
                  hover:text-black
                "
              >
                <Phone size={18} />
              </a>

            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-[10px] font-bold text-zinc-500">
                HIRAQL GYM STORE
              </p>

              <p className="mt-2 text-xs font-bold text-zinc-300">
                جودة • ستايل • أداء
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}

        <div className="my-10 h-px bg-white/10" />

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div
          className="
            flex flex-col gap-5
            text-center
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:text-right
          "
        >

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} HIRAQL GYM STORE.
            جميع الحقوق محفوظة.
          </p>

          <Link
            to="/products"
            className="
              group inline-flex
              items-center justify-center
              gap-2
              text-sm
              font-bold
              text-[#39ff14]
              transition-all duration-300
              hover:gap-3
            "
          >
            ابدأ التسوق الآن

            <ArrowLeft
              size={17}
              className="
                transition-transform duration-300
                group-hover:-translate-x-1
              "
            />
          </Link>

        </div>
      </div>
    </footer>
  );
}

export default Footer;