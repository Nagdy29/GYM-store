import { Link } from "react-router-dom";

import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const PHONE_NUMBER = "201099170161";

const whatsappUrl =
  `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    "مرحباً HIRAQL GYM STORE 👋 أريد الاستفسار عن أحد المنتجات."
  )}`;

const phoneUrl = `tel:+${PHONE_NUMBER}`;

const tiktokUrl =
  "https://www.tiktok.com/@hiraql5";

const facebookUrl =
  "https://www.facebook.com/share/19eSeYwPYr/";

const whatsappChannelUrl =
  "https://whatsapp.com/channel/0029Vb91hoK0lwgiMI93YQ2C";

const instagramUrl =
  "https://www.instagram.com/hiraql.15?stkn=aG12aGt3djhqY2I0";

function Footer() {
  return (
    <footer
      dir="rtl"
      className="border-t border-white/10 bg-black text-white"
    >
      <div className="h-[2px] w-full bg-[#39ff14]" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}

          <div>
            <Link
              to="/"
              className="group mb-6 inline-flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden bg-transparent transition-all duration-300 group-hover:-translate-y-1">
                <img
                  src="/logo foter.jpeg"
                  alt="HIRAQL"
                  className="h-14 w-14 object-contain mix-blend-screen transition-transform duration-300 group-hover:scale-105"
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
              ملابس رياضية، شنط جيم، مكملات غذائية،
              واختيارات مناسبة للتمرين والحركة اليومية.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

              <span className="text-[11px] font-bold text-zinc-500">
                Train Hard. Wear Better.
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}

          <div>
            <h3 className="mb-6 text-base font-black">
              روابط سريعة
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                المنتجات
              </Link>

              <Link
                to="/categories"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                الأقسام
              </Link>

              <Link
                to="/products?offer=true"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                العروض
              </Link>

              <Link
                to="/secret"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                🔐 المفتاح الخفي
              </Link>

              <Link
                to="/cart"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                سلة التسوق
              </Link>

              <Link
                to="/checkout"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                إتمام الطلب
              </Link>
            </div>
          </div>

          {/* CATEGORIES */}

          <div>
            <h3 className="mb-6 text-base font-black">
              تسوق حسب القسم
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                to="/products?category=tshirts"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                تيشيرتات جيم
              </Link>

              <Link
                to="/products?category=pants"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                بنطلونات جيم
              </Link>

              <Link
                to="/products?category=shorts"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                شورتات جيم
              </Link>

              <Link
                to="/products?category=bags"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                شنط جيم
              </Link>

              <Link
                to="/products?category=supplements"
                className="text-sm text-zinc-400 transition hover:text-[#39ff14]"
              >
                مكملات غذائية
              </Link>
            </div>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className="mb-6 text-base font-black">
              تواصل معانا
            </h3>

            <p className="mb-6 text-sm leading-7 text-zinc-400">
              لو عندك أي سؤال أو محتاج مساعدة،
              تقدر تتواصل معانا بسهولة.
            </p>

            <div className="flex flex-wrap gap-3">
              {/* WHATSAPP */}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                title="واتساب"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
              >
                <MessageCircle size={19} />
              </a>

              {/* WHATSAPP CHANNEL */}

              <a
                href={whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="قناة واتساب"
                title="قناة واتساب"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
              >
                <Send size={18} />
              </a>

              {/* TIKTOK */}

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تيك توك"
                title="تيك توك"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
              >
                <span className="text-lg font-black">
                  TT
                </span>
              </a>

              {/* FACEBOOK */}

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                title="فيسبوك"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
              >
                <span className="text-lg font-black">
                  f
                </span>
              </a>

              {/* INSTAGRAM */}

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="انستجرام"
                title="انستجرام"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
              >
                <span className="text-lg font-black">
                  IG
                </span>
              </a>

              {/* PHONE */}

              <a
                href={phoneUrl}
                aria-label="اتصال"
                title="اتصال"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
              >
                <Phone size={18} />
              </a>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-[#39ff14]/20"
            >
              <p className="text-[10px] font-bold text-zinc-500">
                واتساب / اتصال
              </p>

              <p
                dir="ltr"
                className="mt-2 text-sm font-black tracking-wide"
              >
                01099170161
              </p>
            </a>

            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-[10px] font-bold text-zinc-500">
                HIRAQL GYM STORE
              </p>

              <p className="mt-2 text-xs font-bold text-zinc-300">
                جودة • ستايل • أداء
              </p>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-right">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} HIRAQL GYM STORE.
            جميع الحقوق محفوظة.
          </p>

          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-2 text-sm font-bold text-[#39ff14] transition hover:gap-3"
          >
            ابدأ التسوق الآن

            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;