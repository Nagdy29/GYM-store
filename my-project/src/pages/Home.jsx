import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  ChevronLeft,
  Dumbbell,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Users,
} from "lucide-react";

import { categories } from "../data/products";

import {
  getProductsFromFirebase,
} from "../firebase/products";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("ar-EG")} جنيه`;
}

const categoryImages = {
  tshirts:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",

  pants:
    "https://images.unsplash.com/photo-1506629905607-d9c8f7e4d3b5?auto=format&fit=crop&w=900&q=85",

  shorts:
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85",

  accessories:
    "https://images.unsplash.com/photo-1580083770445-2aeb4d2f0c13?auto=format&fit=crop&w=900&q=85",

  supplements:
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=85",
};

const fallbackCategoryImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506629905607-d9c8f7e4d3b5?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1580083770445-2aeb4d2f0c13?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=85",
];

function getCategoryImage(category, index) {
  if (category?.image) {
    return category.image;
  }

  return (
    categoryImages[category?.id] ||
    fallbackCategoryImages[index % fallbackCategoryImages.length]
  );
}

function Home() {
  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [productError, setProductError] =
    useState("");

  const loadProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setProductError("");

        const data =
          await getProductsFromFirebase();

        setFeaturedProducts(
          Array.isArray(data)
            ? data.slice(0, 4)
            : []
        );
      } catch (error) {
        console.error(
          "Home Products Error:",
          error
        );

        setProductError(
          "مش قادرين نحمل المنتجات حاليًا."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const customerReviews = [
    {
      id: 1,
      name: "محمد أحمد",
      text: "المنتج وصل بسرعة والخامة كويسة جدًا، والتعامل محترم. إن شاء الله مش آخر طلب.",
      rating: 5,
    },
    {
      id: 2,
      name: "أحمد محمود",
      text: "الأسعار كويسة جدًا مقارنة بالجودة، والمقاس طلع مظبوط زي ما كنت متوقع.",
      rating: 5,
    },
    {
      id: 3,
      name: "يوسف علي",
      text: "تجربة محترمة من أول الطلب لحد الاستلام. المنتجات شكلها حلو والخدمة ممتازة.",
      rating: 4,
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "شحن سريع",
      text: "طلبك بيوصلك في أسرع وقت ممكن.",
      number: "01",
    },
    {
      icon: ShieldCheck,
      title: "جودة نثق بها",
      text: "اختيارات بعناية وجودة نهتم بيها.",
      number: "02",
    },
    {
      icon: ShoppingBag,
      title: "طلب بسهولة",
      text: "اختار منتجك وكمل طلبك في خطوات بسيطة.",
      number: "03",
    },
    {
      icon: Check,
      title: "خدمة مميزة",
      text: "نهتم بتجربتك من أول الطلب لحد الاستلام.",
      number: "04",
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "اختيارات بعناية",
      text: "منتجات مختارة عشان تناسب احتياجات التمرين والاستخدام اليومي.",
    },
    {
      icon: ShoppingBag,
      title: "تجربة شراء بسيطة",
      text: "من اختيار المنتج للسلة ثم إتمام الطلب بكل سهولة.",
    },
    {
      icon: Truck,
      title: "توصيل للبيت",
      text: "اطلب وأنت مكانك وخلي طلبك يوصل لحد باب البيت.",
    },
    {
      icon: Users,
      title: "نهتم بالعميل",
      text: "هدفنا إن كل طلب يكون بداية لتجربة أحسن مع HIRAQL.",
    },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#050505] text-white"
    >

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative isolate min-h-[700px] overflow-hidden bg-black">

        {/* HERO IMAGE */}

        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=2200&q=90"
            alt="HIRAQL Gym"
            className="h-full w-full object-cover object-center"
          />

          {/* DARK LAYER */}

          <div className="absolute inset-0 bg-black/65" />

          {/* RIGHT DARK GRADIENT */}

          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/85 to-black/30" />

          {/* BOTTOM */}

          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />

          {/* GREEN GLOW */}

          <div className="absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-[#39ff14]/10 blur-[140px]" />

          <div className="absolute -left-40 bottom-20 h-[350px] w-[350px] rounded-full bg-[#39ff14]/5 blur-[130px]" />

          {/* GRID */}

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:70px_70px]" />

        </div>

        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto flex min-h-[700px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            {/* BRAND BADGE */}

            <div className="hero-reveal inline-flex items-center gap-3 rounded-full border border-[#39ff14]/20 bg-black/50 px-4 py-2.5 shadow-2xl backdrop-blur-xl">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#39ff14] text-black shadow-[0_8px_25px_rgba(57,255,20,0.15)]">
                <Dumbbell size={16} />
              </div>

              <div className="text-right">
                <p className="text-[9px] font-black tracking-[0.2em] text-[#39ff14]">
                  HIRAQL
                </p>

                <p className="text-[10px] font-bold text-zinc-300">
                  GYM STORE
                </p>
              </div>

            </div>

            {/* TITLE */}

            <h1 className="hero-reveal-delay mt-7 text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[76px]">

              لبسك جزء من

              <span className="block text-[#39ff14]">
                قوتك.
              </span>

              <span className="mt-1 block text-white">
                خليك جاهز.
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p className="hero-reveal-delay-2 mt-7 max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base sm:leading-9">

              في HIRAQL بنقدملك ملابس رياضية وإكسسوارات
              مختارة بعناية عشان تجمع بين الراحة،
              الشكل والأداء في كل تمرينة.

            </p>

            {/* BUTTONS */}

            <div className="hero-reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black shadow-[0_15px_50px_rgba(57,255,20,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d] hover:shadow-[0_20px_60px_rgba(57,255,20,0.22)]"
              >
                ابدأ التسوق

                <ArrowLeft
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>

              <Link
                to="/categories"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 text-sm font-black text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-white/[0.09]"
              >
                استكشف الأقسام

                <ChevronLeft
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>

            </div>

            {/* STATS */}

            <div className="hero-reveal-delay-4 mt-11 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">

              {[
                ["ملابس رياضية", "01"],
                ["إكسسوارات", "02"],
                ["أسعار مناسبة", "03"],
                ["شحن للبيت", "04"],
              ].map(([text, number]) => (
                <div
                  key={number}
                  className="group rounded-2xl border border-white/[0.09] bg-black/45 px-4 py-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/25"
                >

                  <span className="text-[10px] font-black text-[#39ff14]">
                    {number}
                  </span>

                  <p className="mt-1 text-[11px] font-bold text-zinc-400">
                    {text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* HERO LOGO CARD */}

        <div className="absolute bottom-12 left-6 z-10 hidden lg:block">

          <div className="hero-float flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-black/70 p-4 shadow-2xl backdrop-blur-2xl">

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#39ff14] text-black">

              <div className="absolute inset-1 rounded-xl border border-black/10" />

              <Dumbbell size={25} />

            </div>

            <div>

              <p className="text-[9px] font-black tracking-[0.25em] text-[#39ff14]">
                HIRAQL
              </p>

              <p className="mt-1 text-sm font-black text-white">
                Train Hard. Wear Better.
              </p>

            </div>

          </div>

        </div>

        {/* SCROLL */}

        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">

          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-zinc-500">
            Scroll
          </span>

          <div className="h-10 w-px bg-gradient-to-b from-[#39ff14] to-transparent" />

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="relative z-20 border-y border-white/[0.06] bg-[#050505]">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="feature-card group relative overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#39ff14]/20 hover:bg-[#0e0e0e]"
                >

                  <span className="absolute left-4 top-4 text-[9px] font-black text-zinc-700 transition-colors duration-300 group-hover:text-[#39ff14]">
                    {item.number}
                  </span>

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04] text-zinc-300 transition-all duration-500 group-hover:border-[#39ff14]/20 group-hover:bg-[#39ff14] group-hover:text-black">
                      <Icon size={20} />
                    </div>

                    <div>

                      <h3 className="text-sm font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                        {item.text}
                      </p>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORIES - NEW DESIGN
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#050505]">

        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#39ff14]/5 blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          {/* SECTION HEADER */}

          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#39ff14]/10 bg-[#39ff14]/[0.04] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                <span className="text-[10px] font-black text-[#39ff14]">
                  EXPLORE COLLECTION
                </span>

              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                اختار القسم
                <span className="text-[#39ff14]">
                  {" "}المناسب
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-8 text-zinc-500">
                كل احتياجات التمرين قدامك في مكان واحد،
                اختار القسم اللي يناسبك وابدأ رحلتك.
              </p>

            </div>

            <Link
              to="/categories"
              className="group inline-flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-black text-white transition-all duration-300 hover:border-[#39ff14]/20 hover:bg-[#39ff14]/[0.05]"
            >
              مشاهدة كل الأقسام

              <ArrowLeft
                size={16}
                className="text-[#39ff14] transition-transform duration-300 group-hover:-translate-x-1"
              />

            </Link>

          </div>


          {/* CATEGORY GRID */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {categories.map((category, index) => {

              const image =
                getCategoryImage(
                  category,
                  index
                );

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card group relative min-h-[340px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-2 hover:border-[#39ff14]/30 hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
                >

                  {/* IMAGE */}

                  <img
                    src={image}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-75 group-hover:grayscale-0"
                  />

                  {/* DARK OVERLAY */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/20" />

                  {/* GREEN HOVER */}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#39ff14]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />


                  {/* NUMBER */}

                  <span className="absolute left-5 top-5 text-[10px] font-black text-white/40 transition-colors duration-300 group-hover:text-[#39ff14]">
                    0{index + 1}
                  </span>


                  {/* ICON */}

                  <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/45 text-lg backdrop-blur-xl transition-all duration-500 group-hover:border-[#39ff14]/30 group-hover:bg-[#39ff14] group-hover:text-black">
                    {category.icon}
                  </div>


                  {/* CONTENT */}

                  <div className="absolute inset-x-0 bottom-0 p-6">

                    <div className="mb-3 h-1 w-7 rounded-full bg-[#39ff14] transition-all duration-500 group-hover:w-14" />

                    <h3 className="text-lg font-black text-white">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-400">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[11px] font-black text-[#39ff14]">

                      استكشف القسم

                      <ArrowLeft
                        size={14}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                      />

                    </div>

                  </div>

                </Link>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="relative border-y border-white/[0.05] bg-[#080808]">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <span className="inline-flex items-center gap-2 text-xs font-black text-[#39ff14]">

                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                اختيارات HIRAQL

              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                منتجات مميزة
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                أحدث المنتجات الموجودة في المتجر.
              </p>

            </div>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-black text-white"
            >
              عرض كل المنتجات

              <ArrowLeft
                size={17}
                className="text-[#39ff14] transition-transform duration-300 group-hover:-translate-x-1"
              />

            </Link>

          </div>


          {loading ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (

                <div
                  key={item}
                  className="overflow-hidden rounded-[1.7rem] border border-white/[0.06] bg-[#0d0d0d]"
                >

                  <div className="aspect-square animate-pulse bg-white/[0.04]" />

                  <div className="space-y-3 p-5">

                    <div className="h-3 w-20 animate-pulse rounded-full bg-white/[0.06]" />

                    <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />

                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />

                  </div>

                </div>

              ))}

            </div>

          ) : productError ? (

            <div className="rounded-[1.7rem] border border-red-500/10 bg-[#0d0d0d] p-10 text-center">

              <ShoppingBag
                size={35}
                className="mx-auto text-zinc-700"
              />

              <h3 className="mt-4 font-black text-white">
                حصلت مشكلة في تحميل المنتجات
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {productError}
              </p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-5 rounded-xl bg-[#39ff14] px-5 py-3 text-xs font-black text-black transition-all hover:bg-[#4dff2d]"
              >
                حاول تاني
              </button>

            </div>

          ) : featuredProducts.length === 0 ? (

            <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-[#0d0d0d] p-12 text-center">

              <ShoppingBag
                size={35}
                className="mx-auto text-zinc-700"
              />

              <h3 className="mt-4 font-black text-white">
                المنتجات هتظهر هنا
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                أضف منتجات من لوحة التحكم عشان تظهر في المتجر.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {featuredProducts.map((product) => (

                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group overflow-hidden rounded-[1.7rem] border border-white/[0.07] bg-[#0c0c0c] transition-all duration-500 hover:-translate-y-2 hover:border-[#39ff14]/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                >

                  <div className="relative aspect-square overflow-hidden bg-[#111111]">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center">

                        <Dumbbell
                          size={45}
                          className="text-zinc-800"
                        />

                      </div>

                    )}

                    {product.badge && (

                      <span className="absolute right-4 top-4 rounded-full bg-[#39ff14] px-3 py-1.5 text-[10px] font-black text-black shadow-lg">
                        {product.badge}
                      </span>

                    )}

                    {Number(product.discount || 0) > 0 && (

                      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
                        -{Number(product.discount)}%
                      </span>

                    )}

                    {Number(product.stock || 0) <= 0 && (

                      <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">

                        <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-black shadow-xl">
                          نفد المخزون
                        </span>

                      </div>

                    )}

                  </div>


                  <div className="p-5">

                    <p className="text-[10px] font-bold text-zinc-600">
                      {product.categoryName || "HIRAQL"}
                    </p>

                    <h3 className="mt-2 line-clamp-1 text-sm font-black text-white">
                      {product.name}
                    </h3>

                    <div className="mt-4 flex items-center justify-between gap-3">

                      <div className="min-w-0">

                        <span className="text-sm font-black text-white">
                          {formatPrice(product.price)}
                        </span>

                        {Number(product.oldPrice) > 0 && (

                          <span className="mr-2 text-[10px] text-zinc-600 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>

                        )}

                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] font-bold text-zinc-500">

                        <Star
                          size={11}
                          className="fill-current"
                        />

                        {Number(product.rating || 0).toFixed(1)}

                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#050505]">

        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#39ff14]/5 blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* IMAGE */}

            <div className="relative">

              <div className="absolute -inset-3 rounded-[2.5rem] border border-[#39ff14]/10" />

              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/[0.08] bg-[#0b0b0b]">

                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=90"
                  alt="HIRAQL Gym"
                  loading="lazy"
                  className="h-[420px] w-full object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />

                <div className="absolute bottom-6 right-6">

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/75 px-5 py-4 backdrop-blur-xl">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                      <Dumbbell size={18} />
                    </div>

                    <div>

                      <p className="text-[10px] font-black text-[#39ff14]">
                        HIRAQL
                      </p>

                      <p className="mt-1 text-sm font-black text-white">
                        Train Hard. Wear Better.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* CONTENT */}

            <div>

              <span className="inline-flex items-center gap-2 text-xs font-black text-[#39ff14]">

                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                عن HIRAQL

              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">

                مش بنبيع

                <span className="block text-[#39ff14]">
                  لبس بس.
                </span>

              </h2>

              <p className="mt-6 text-sm leading-8 text-zinc-400 sm:text-base">

                HIRAQL اتعملت عشان تكون أكتر من مجرد
                متجر ملابس رياضية. هدفنا نقدم لك
                اختيارات تجمع بين الشكل، الراحة
                والجودة عشان تدخل التمرينة وانت واثق
                في نفسك.

              </p>

              <p className="mt-4 text-sm leading-8 text-zinc-600">

                من أول التيشيرت لحد الإكسسوارات
                والمنتجات اللي بتحتاجها في يومك،
                بنحاول نخلي كل اختيار عندنا له قيمة.

              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-4">

                  <p className="text-2xl font-black text-[#39ff14]">
                    01
                  </p>

                  <p className="mt-1 text-xs font-bold text-zinc-500">
                    جودة واختيارات
                  </p>

                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-4">

                  <p className="text-2xl font-black text-[#39ff14]">
                    02
                  </p>

                  <p className="mt-1 text-xs font-bold text-zinc-500">
                    ستايل مختلف
                  </p>

                </div>

              </div>

              <Link
                to="/products"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-black text-white"
              >

                اكتشف منتجاتنا

                <ArrowLeft
                  size={17}
                  className="text-[#39ff14] transition-transform duration-300 group-hover:-translate-x-1"
                />

              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY HIRAQL
      ====================================================== */}

      <section className="relative border-y border-white/[0.05] bg-[#080808]">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">

            <div className="group relative min-h-[390px] overflow-hidden rounded-[2.2rem] border border-white/[0.07] bg-[#0b0b0b] p-7 text-white sm:p-9">

              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#39ff14]/5 blur-[90px] transition-all duration-700 group-hover:bg-[#39ff14]/10" />

              <div className="relative flex h-full flex-col justify-between">

                <div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
                    <Dumbbell size={21} />
                  </div>

                  <h2 className="mt-7 text-3xl font-black leading-tight sm:text-4xl">

                    ليه تختار

                    <span className="block text-[#39ff14]">
                      HIRAQL؟
                    </span>

                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-8 text-zinc-500">
                    بنحاول نخلي تجربة التسوق عندنا
                    بسيطة ومريحة، من أول ما تختار
                    المنتج لحد ما طلبك يوصل.
                  </p>

                </div>

                <Link
                  to="/products"
                  className="group mt-8 inline-flex w-fit items-center gap-2 text-sm font-black text-[#39ff14]"
                >

                  شوف المنتجات

                  <ArrowLeft
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />

                </Link>

              </div>

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

              {benefits.map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-[1.7rem] border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#39ff14]/20 hover:bg-[#0e0e0e]"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.035] text-zinc-300 transition-all duration-500 group-hover:border-[#39ff14]/20 group-hover:bg-[#39ff14] group-hover:text-black">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-sm font-black text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-zinc-500">
                      {item.text}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          REVIEWS
      ====================================================== */}

      <section className="bg-[#050505]">

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <span className="inline-flex items-center gap-2 text-xs font-black text-[#39ff14]">

                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                رأي عملائنا

              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                الناس بتقول إيه؟
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                أهم حاجة عندنا إن العميل يكون
                مبسوط من المنتج والتجربة كلها.
              </p>

            </div>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-black text-white"
            >

              شوف المنتجات

              <ChevronLeft
                size={17}
                className="text-[#39ff14] transition-transform duration-300 group-hover:-translate-x-1"
              />

            </Link>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            {customerReviews.map((review) => (

              <article
                key={review.id}
                className="group relative overflow-hidden rounded-[1.7rem] border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#39ff14]/15"
              >

                <div className="absolute left-5 top-5 text-5xl font-black leading-none text-white/[0.03]">
                  ”
                </div>

                <div className="relative flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#39ff14] text-black">
                      <MessageSquare size={18} />
                    </div>

                    <div>

                      <p className="text-sm font-black text-white">
                        {review.name}
                      </p>

                      <p className="text-[10px] text-zinc-600">
                        عميل HIRAQL
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-0.5">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <Star
                        key={star}
                        size={13}
                        className={
                          star <= review.rating
                            ? "fill-[#39ff14] text-[#39ff14]"
                            : "text-zinc-700"
                        }
                      />

                    ))}

                  </div>

                </div>

                <p className="mt-6 text-sm leading-8 text-zinc-500">
                  “{review.text}”
                </p>

                <div className="mt-6 h-1 w-8 rounded-full bg-[#39ff14] transition-all duration-500 group-hover:w-14" />

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-[#050505] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.3rem] border border-white/[0.07] bg-[#0a0a0a] px-6 py-16 text-center text-white sm:px-12">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#39ff14]/10 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/[0.025] blur-[90px]" />

          <div className="relative">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#39ff14] text-black shadow-[0_12px_35px_rgba(57,255,20,0.12)]">
              <Dumbbell size={24} />
            </div>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-black text-zinc-500">

              <Sparkles
                size={13}
                className="text-[#39ff14]"
              />

              HIRAQL GYM STORE

            </span>

            <h2 className="mt-5 text-3xl font-black sm:text-5xl">
              جاهز تبدأ؟
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-zinc-500">
              اختار احتياجاتك، ضيفها للسلة،
              وكمل طلبك بكل سهولة.
            </p>

            <Link
              to="/products"
              className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d] hover:shadow-[0_15px_40px_rgba(57,255,20,0.14)]"
            >

              تسوق الآن

              <ArrowUpLeft
                size={19}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5"
              />

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          BACK TO TOP
      ====================================================== */}

      <button
        type="button"
        aria-label="العودة لأعلى الصفحة"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="group fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/85 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
      >

        <ArrowUpLeft
          size={19}
          className="transition-transform duration-300 group-hover:-translate-y-0.5"
        />

      </button>


      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`

        @keyframes heroReveal {

          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        @keyframes heroFloat {

          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }

        }

        .hero-reveal {
          animation: heroReveal 0.8s ease-out both;
        }

        .hero-reveal-delay {
          animation: heroReveal 0.8s ease-out 0.1s both;
        }

        .hero-reveal-delay-2 {
          animation: heroReveal 0.8s ease-out 0.2s both;
        }

        .hero-reveal-delay-3 {
          animation: heroReveal 0.8s ease-out 0.3s both;
        }

        .hero-reveal-delay-4 {
          animation: heroReveal 0.8s ease-out 0.4s both;
        }

        .hero-float {
          animation: heroFloat 4.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }

        }

      `}</style>

    </div>
  );
}

export default Home;