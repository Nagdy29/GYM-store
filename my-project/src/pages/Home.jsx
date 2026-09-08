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

import {
  getCategoriesFromFirebase,
} from "../firebase/categories";

import {
  getProductsFromFirebase,
} from "../firebase/products";

function formatPrice(price) {
  return `${Number(
    price || 0
  ).toLocaleString("ar-EG")} جنيه`;
}

const categoryFallbackImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=90",
  "/bantalon.jpeg",
  "https://images.unsplash.com/photo-1580083770445-2aeb4d2f0c13?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1200&q=90",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
];

function getCategoryImage(
  category,
  index
) {
  return (
    category?.image ||
    categoryFallbackImages[
      index %
        categoryFallbackImages.length
    ]
  );
}

function Home() {
  const [
    featuredProducts,
    setFeaturedProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    productError,
    setProductError,
  ] = useState("");

  const loadHomeData =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setProductError("");

          const [
            productsData,
            categoriesData,
          ] = await Promise.all([
            getProductsFromFirebase(),
            getCategoriesFromFirebase(),
          ]);

          setFeaturedProducts(
            Array.isArray(
              productsData
            )
              ? productsData.slice(
                  0,
                  4
                )
              : []
          );

          setCategories(
            Array.isArray(
              categoriesData
            )
              ? categoriesData
              : []
          );
        } catch (error) {
          console.error(
            "Home Firebase Error:",
            error
          );

          setProductError(
            error?.message ||
              "مش قادرين نحمل بيانات المتجر حاليًا."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

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
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#39ff14]/[0.045] blur-[150px]" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#39ff14]/[0.025] blur-[140px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:70px_70px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid min-h-[680px] items-center lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative z-20 order-2 py-8 lg:order-1 lg:pl-10">
              <div className="hero-reveal inline-flex items-center gap-3 rounded-full border border-[#39ff14]/15 bg-white/[0.025] px-4 py-2.5 backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                  <Dumbbell size={16} />
                </div>

                <div className="text-right">
                  <p className="text-[9px] font-black tracking-[0.2em] text-[#39ff14]">
                    HIRAQL
                  </p>

                  <p className="text-[10px] font-bold text-zinc-400">
                    GYM STORE
                  </p>
                </div>
              </div>

              <h1 className="hero-reveal-delay mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[72px]">
                لبسك جزء من
                <span className="block text-[#39ff14]">
                  قوتك.
                </span>
                <span className="mt-1 block text-white">
                  خليك جاهز.
                </span>
              </h1>

              <p className="hero-reveal-delay-2 mt-6 max-w-xl text-sm leading-8 text-zinc-400 sm:text-base sm:leading-9">
                في HIRAQL بنقدملك ملابس رياضية وإكسسوارات
                مختارة بعناية عشان تجمع بين الراحة، الشكل
                والأداء في كل تمرينة.
              </p>

              <div className="hero-reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d]"
                >
                  ابدأ التسوق

                  <ArrowLeft
                    size={18}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </Link>

                <Link
                  to="/categories"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/20"
                >
                  استكشف الأقسام

                  <ChevronLeft
                    size={17}
                    className="text-[#39ff14] transition-transform group-hover:-translate-x-1"
                  />
                </Link>
              </div>

              <div className="hero-reveal-delay-4 mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["ملابس رياضية", "01"],
                  ["إكسسوارات", "02"],
                  ["أسعار مناسبة", "03"],
                  ["شحن للبيت", "04"],
                ].map(
                  ([text, number]) => (
                    <div
                      key={number}
                      className="group rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/85 px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/20"
                    >
                      <span className="text-[10px] font-black text-[#39ff14]">
                        {number}
                      </span>

                      <p className="mt-1 text-[11px] font-bold text-zinc-500">
                        {text}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="relative order-1 flex min-h-[500px] items-center justify-center lg:order-2 lg:min-h-[680px]">
              <div className="pointer-events-none absolute right-[5%] top-[15%] h-[420px] w-[420px] rounded-full bg-[#39ff14]/[0.06] blur-[100px]" />

              <div className="relative h-[470px] w-full max-w-[560px] overflow-hidden sm:h-[560px] lg:h-[640px]">
           <img
  src="WhatsApp Image 2026-09-08 at 11.45.32 AM.jpeg"
  alt="HIRAQL Gym"
  className="h-full w-full object-contain object-center opacity-95 transition-transform duration-700 hover:scale-[1.01]"
/>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#050505]/10 via-transparent to-[#050505]/80" />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/10" />

                <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#050505] to-transparent opacity-70" />

                <div className="absolute bottom-8 right-6 left-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black tracking-[0.25em] text-[#39ff14]">
                        HIRAQL / GYM
                      </p>

                      <h3 className="mt-2 text-xl font-black sm:text-2xl">
                        Train Hard.
                      </h3>

                      <p className="mt-1 text-xs font-bold text-zinc-300 sm:text-sm">
                        Wear Better.
                      </p>
                    </div>

                    <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/50 text-[#39ff14] backdrop-blur-xl sm:flex">
                      <Dumbbell size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-float absolute bottom-10 left-1 hidden sm:block lg:left-2">
                <div className="rounded-2xl border border-white/10 bg-black/85 px-4 py-3 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                      <Sparkles size={16} />
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-zinc-600">
                        YOUR STYLE
                      </p>

                      <p className="text-xs font-black text-white">
                        جاهز للتمرين
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 hidden items-center justify-center gap-3 lg:flex">
            <span className="h-px w-14 bg-gradient-to-l from-[#39ff14] to-transparent" />

            <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-600">
              SCROLL TO EXPLORE
            </span>

            <span className="h-px w-14 bg-gradient-to-r from-[#39ff14] to-transparent" />
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="relative z-20 border-y border-white/[0.06] bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(
              (item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[#0b0b0b] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#39ff14]/20"
                  >
                    <span className="absolute left-4 top-4 text-[9px] font-black text-zinc-700">
                      {item.number}
                    </span>

                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04] text-zinc-300 transition-all group-hover:bg-[#39ff14] group-hover:text-black">
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
              }
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#39ff14]/5 blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#39ff14]/10 bg-[#39ff14]/[0.04] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                <span className="text-[10px] font-black text-[#39ff14]">
                  GYM COLLECTION
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                اختار القسم
                <span className="text-[#39ff14]">
                  {" "}
                  المناسب
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-8 text-zinc-500">
                الأقسام دي بتتجاب مباشرة من Firebase.
              </p>
            </div>

            <Link
              to="/categories"
              className="group inline-flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-black text-white transition hover:border-[#39ff14]/20"
            >
              مشاهدة كل الأقسام

              <ArrowLeft
                size={16}
                className="text-[#39ff14] transition-transform group-hover:-translate-x-1"
              />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="min-h-[350px] animate-pulse rounded-[2rem] bg-[#0b0b0b]"
                  />
                )
              )}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#0b0b0b] p-12 text-center">
              <Dumbbell
                size={36}
                className="mx-auto text-zinc-700"
              />

              <p className="mt-4 text-sm font-black text-white">
                مفيش أقسام مضافة لسه
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map(
                (
                  category,
                  index
                ) => {
                  const image =
                    getCategoryImage(
                      category,
                      index
                    );

                  return (
                    <Link
                      key={category.id}
                      to={`/products?category=${encodeURIComponent(
                        category.id
                      )}`}
                      className="group relative min-h-[350px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-2 hover:border-[#39ff14]/30"
                    >
                      <img
                        src={image}
                        alt={
                          category.name
                        }
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/5" />

                      <span className="absolute left-5 top-5 text-[10px] font-black text-white/40 group-hover:text-[#39ff14]">
                        0{index + 1}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="mb-3 h-1 w-7 rounded-full bg-[#39ff14] transition-all group-hover:w-14" />

                        <h3 className="text-lg font-black text-white">
                          {
                            category.name
                          }
                        </h3>

                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-400">
                          {
                            category.description
                          }
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-[11px] font-black text-[#39ff14]">
                          استكشف القسم
                          <ArrowLeft
                            size={14}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTS */}

      <section className="relative border-y border-white/[0.05] bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black text-[#39ff14]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />
                اختيارات HIRAQL
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                منتجات مميزة
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                أحدث المنتجات الموجودة في المتجر.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-black"
            >
              عرض كل المنتجات

              <ArrowLeft
                size={17}
                className="text-[#39ff14]"
              />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[1.7rem] bg-[#0d0d0d]"
                  >
                    <div className="aspect-square animate-pulse bg-white/[0.04]" />

                    <div className="space-y-3 p-5">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : productError ? (
            <div className="rounded-[1.7rem] bg-[#0d0d0d] p-10 text-center">
              <ShoppingBag
                size={35}
                className="mx-auto text-zinc-700"
              />

              <h3 className="mt-4 font-black">
                حصلت مشكلة
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {productError}
              </p>

              <button
                type="button"
                onClick={loadHomeData}
                className="mt-5 rounded-xl bg-[#39ff14] px-5 py-3 text-xs font-black text-black"
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

              <h3 className="mt-4 font-black">
                المنتجات هتظهر هنا
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                أضف منتجات من لوحة التحكم.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map(
                (product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group overflow-hidden rounded-[1.7rem] border border-white/[0.07] bg-[#0c0c0c] transition-all duration-500 hover:-translate-y-2 hover:border-[#39ff14]/20"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#111]">
                      {product.image ? (
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Dumbbell
                            size={45}
                            className="text-zinc-800"
                          />
                        </div>
                      )}

                      {product.badge && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#39ff14] px-3 py-1.5 text-[10px] font-black text-black">
                          {
                            product.badge
                          }
                        </span>
                      )}

                      {Number(
                        product.stock || 0
                      ) <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/65">
                          <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
                            نفد المخزون
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] font-bold text-zinc-600">
                        {
                          product.categoryName ||
                          "HIRAQL"
                        }
                      </p>

                      <h3 className="mt-2 line-clamp-1 text-sm font-black">
                        {
                          product.name
                        }
                      </h3>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-sm font-black">
                          {formatPrice(
                            product.price
                          )}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] px-2 py-1 text-[10px] font-bold text-zinc-500">
                          <Star
                            size={11}
                            className="fill-current"
                          />

                          {Number(
                            product.rating ||
                              0
                          ).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}

      <section
        id="about"
        className="relative overflow-hidden bg-[#050505]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
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

                      <p className="mt-1 text-sm font-black">
                        Train Hard. Wear Better.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black text-[#39ff14]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />
                عن HIRAQL
              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                مش بنبيع
                <span className="block text-[#39ff14]">
                  لبس بس.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-8 text-zinc-400 sm:text-base">
                HIRAQL اتعملت عشان تكون أكتر من مجرد متجر
                ملابس رياضية. هدفنا نقدم لك اختيارات تجمع بين
                الشكل، الراحة والجودة عشان تدخل التمرينة وانت
                واثق في نفسك.
              </p>

              <p className="mt-4 text-sm leading-8 text-zinc-600">
                من أول التيشيرت لحد الإكسسوارات والمنتجات اللي
                بتحتاجها في يومك، بنحاول نخلي كل اختيار عندنا له قيمة.
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
                className="group mt-8 inline-flex items-center gap-3 text-sm font-black"
              >
                اكتشف منتجاتنا

                <ArrowLeft
                  size={17}
                  className="text-[#39ff14]"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}

      <section className="relative border-y border-white/[0.05] bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="group relative min-h-[390px] overflow-hidden rounded-[2.2rem] border border-white/[0.07] bg-[#0b0b0b] p-7 text-white sm:p-9">
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
                    <Dumbbell size={21} />
                  </div>

                  <h2 className="mt-7 text-3xl font-black sm:text-4xl">
                    ليه تختار
                    <span className="block text-[#39ff14]">
                      HIRAQL؟
                    </span>
                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-8 text-zinc-500">
                    بنحاول نخلي تجربة التسوق عندنا بسيطة ومريحة،
                    من أول ما تختار المنتج لحد ما طلبك يوصل.
                  </p>
                </div>

                <Link
                  to="/products"
                  className="group mt-8 inline-flex w-fit items-center gap-2 text-sm font-black text-[#39ff14]"
                >
                  شوف المنتجات
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map(
                (item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-[1.7rem] border border-white/[0.07] bg-[#0b0b0b] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#39ff14]/20"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.035] text-zinc-300 transition-all duration-500 group-hover:bg-[#39ff14] group-hover:text-black">
                        <Icon size={20} />
                      </div>

                      <h3 className="mt-5 text-sm font-black">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-zinc-500">
                        {item.text}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}

      <section className="bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-black text-[#39ff14]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />
              رأي عملائنا
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              الناس بتقول إيه؟
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {customerReviews.map(
              (review) => (
                <article
                  key={review.id}
                  className="rounded-[1.7rem] border border-white/[0.07] bg-[#0b0b0b] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#39ff14] text-black">
                      <MessageSquare size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        {review.name}
                      </p>

                      <p className="text-[10px] text-zinc-600">
                        عميل HIRAQL
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-0.5">
                    {[
                      1,
                      2,
                      3,
                      4,
                      5,
                    ].map(
                      (star) => (
                        <Star
                          key={star}
                          size={13}
                          className={
                            star <=
                            review.rating
                              ? "fill-[#39ff14] text-[#39ff14]"
                              : "text-zinc-700"
                          }
                        />
                      )
                    )}
                  </div>

                  <p className="mt-5 text-sm leading-8 text-zinc-500">
                    “{review.text}”
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-[#050505] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.3rem] border border-white/[0.07] bg-[#0a0a0a] px-6 py-16 text-center sm:px-12">
          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
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
              اختار احتياجاتك، ضيفها للسلة، وكمل طلبك بكل سهولة.
            </p>

            <Link
              to="/products"
              className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d]"
            >
              تسوق الآن

              <ArrowUpLeft
                size={19}
                className="transition-transform group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* BACK TO TOP */}

      <button
        type="button"
        aria-label="العودة لأعلى الصفحة"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="group fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/85 text-white shadow-2xl backdrop-blur-xl transition hover:border-[#39ff14]/30 hover:bg-[#39ff14] hover:text-black"
      >
        <ArrowUpLeft size={19} />
      </button>

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