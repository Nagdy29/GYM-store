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
  Zap,
} from "lucide-react";

import { categories } from "../data/products";

import {
  getProductsFromFirebase,
} from "../firebase/products";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString(
    "ar-EG"
  )} جنيه`;
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
      text: "هدفنا إن كل طلب يكون بداية لتجربة أحسن مع ZENGER.",
    },
  ];

  return (
    <div className="overflow-hidden bg-white text-zinc-950">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative isolate overflow-hidden bg-[#050505] text-white">
        {/* BACKGROUND */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#39ff14]/10 blur-[110px]" />

          <div className="absolute -bottom-40 -left-32 h-[430px] w-[430px] rounded-full bg-[#39ff14]/5 blur-[120px]" />

          <div className="absolute right-1/3 top-1/3 h-40 w-40 rounded-full bg-white/[0.025] blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,255,20,0.07),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.035),transparent_30%)]" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:50px_50px]" />
        </div>

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          {/* HERO CONTENT */}

          <div className="relative z-10 max-w-2xl">
            <div className="animate-[fadeIn_0.7s_ease-out]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/20 bg-[#39ff14]/5 px-4 py-2 text-xs font-black text-zinc-300 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#39ff14]" />

                أهلاً بيك في ZENGER
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[76px]">
              خليك جاهز
              <span className="block text-[#39ff14]">
                للتمرين
              </span>

              <span className="block text-zinc-300">
                بطريقتك.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-zinc-400 sm:text-base sm:leading-9">
              في ZENGER هتلاقي ملابس رياضية،
              إكسسوارات وكل اللي تحتاجه عشان
              تكمل ستايلك وتتمرن براحة وثقة.
            </p>

            {/* BUTTONS */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black shadow-[0_15px_40px_rgba(57,255,20,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d] hover:shadow-[0_18px_45px_rgba(57,255,20,0.15)]"
              >
                ابدأ التسوق

                <ArrowLeft
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>

              <Link
                to="/categories"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-4 text-sm font-black text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                اكتشف الأقسام

                <ChevronLeft
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>
            </div>

            {/* HERO MINI STATS */}

            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["منتجات متنوعة", "01"],
                ["أسعار مناسبة", "02"],
                ["شحن سريع", "03"],
                ["خدمة مميزة", "04"],
              ].map(
                ([text, number]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/20 hover:bg-[#39ff14]/[0.03]"
                  >
                    <span className="text-[10px] font-black text-[#39ff14]">
                      {number}
                    </span>

                    <p className="mt-1 text-[11px] font-bold text-zinc-400">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="relative hidden min-h-[500px] lg:block">
            {/* GLOW */}

            <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39ff14]/10 blur-[80px]" />

            {/* MAIN FRAME */}

            <div className="absolute left-1/2 top-1/2 h-[440px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] border border-white/[0.08] bg-white/[0.025] shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-5 rounded-[2.5rem] border border-white/[0.05]" />

              <div className="absolute left-1/2 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#39ff14]/20 bg-[#0b0b0b] shadow-[0_0_80px_rgba(57,255,20,0.08)]">
                <div className="absolute inset-7 rounded-full border border-white/[0.05]" />

                <Dumbbell
                  size={125}
                  strokeWidth={1.2}
                  className="relative text-[#39ff14]"
                />
              </div>

              {/* FLOAT CARD 1 */}

              <div className="absolute -right-7 top-16 animate-[float_4s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-[#101010] p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                    <Zap size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-500">
                      طاقة
                    </p>

                    <p className="text-sm font-black text-white">
                      جاهز للتمرين
                    </p>
                  </div>
                </div>
              </div>

              {/* FLOAT CARD 2 */}

              <div className="absolute -left-8 bottom-16 animate-[float_4.5s_ease-in-out_infinite_reverse] rounded-2xl border border-white/10 bg-[#101010] p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-500">
                      اختيارات
                    </p>

                    <p className="text-sm font-black text-white">
                      بعناية
                    </p>
                  </div>
                </div>
              </div>

              {/* SMALL BADGE */}

              <div className="absolute bottom-7 right-8 flex items-center gap-2 rounded-full border border-[#39ff14]/20 bg-[#39ff14]/5 px-4 py-2">
                <Sparkles
                  size={13}
                  className="text-[#39ff14]"
                />

                <span className="text-[10px] font-black text-zinc-300">
                  ZENGER GYM STORE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FADE */}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="relative z-10 border-b border-zinc-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-5 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {features.map(
            (item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:bg-white hover:shadow-lg"
                >
                  {/* CARD NUMBER */}

                  <span className="absolute left-4 top-4 text-[9px] font-black text-zinc-300 transition-colors duration-300 group-hover:text-[#39ff14]">
                    {item.number}
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-800 shadow-sm transition-all duration-300 group-hover:bg-black group-hover:text-[#39ff14]">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-black">
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
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black text-[#16a34a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                تسوق براحتك
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                اختار القسم المناسب
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                كل حاجة مترتبة قدامك عشان توصل
                للي محتاجه بسرعة ومن غير لف كتير.
              </p>
            </div>

            <Link
              to="/categories"
              className="group inline-flex items-center gap-2 self-start text-sm font-black sm:self-auto"
            >
              كل الأقسام

              <ArrowLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map(
              (category, index) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-zinc-100 bg-zinc-50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-900 hover:bg-[#090909] hover:text-white hover:shadow-2xl"
                >
                  {/* NUMBER */}

                  <span className="absolute left-5 top-5 text-[9px] font-black text-zinc-300 transition-colors group-hover:text-[#39ff14]">
                    0{index + 1}
                  </span>

                  {/* ICON */}

                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition-all duration-300 group-hover:bg-[#39ff14] group-hover:text-black group-hover:shadow-[0_10px_25px_rgba(57,255,20,0.12)]">
                    {category.icon}
                  </div>

                  <h3 className="text-sm font-black">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-xs leading-6 text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[11px] font-black text-[#16a34a]">
                    اكتشف القسم

                    <ArrowLeft
                      size={14}
                      className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                  </div>

                  <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#39ff14]/0 blur-2xl transition-all duration-500 group-hover:bg-[#39ff14]/10" />
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="relative bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black text-[#16a34a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                اختيارات ZENGER
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
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
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[1.7rem] border border-zinc-200 bg-white"
                  >
                    <div className="aspect-square animate-pulse bg-zinc-100" />

                    <div className="space-y-3 p-5">
                      <div className="h-3 w-20 animate-pulse rounded-full bg-zinc-100" />

                      <div className="h-5 w-3/4 animate-pulse rounded-full bg-zinc-100" />

                      <div className="h-4 w-1/2 animate-pulse rounded-full bg-zinc-100" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : productError ? (
            <div className="rounded-[1.7rem] border border-red-100 bg-white p-10 text-center shadow-sm">
              <ShoppingBag
                size={35}
                className="mx-auto text-zinc-300"
              />

              <h3 className="mt-4 font-black">
                حصلت مشكلة في تحميل المنتجات
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {productError}
              </p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-5 rounded-xl bg-black px-5 py-3 text-xs font-black text-white transition hover:bg-zinc-800"
              >
                حاول تاني
              </button>
            </div>
          ) : featuredProducts.length ===
            0 ? (
            <div className="rounded-[1.7rem] border border-dashed border-zinc-300 bg-white p-12 text-center">
              <ShoppingBag
                size={35}
                className="mx-auto text-zinc-300"
              />

              <h3 className="mt-4 font-black">
                المنتجات هتظهر هنا
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                أضف منتجات من لوحة التحكم عشان
                تظهر في المتجر.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map(
                (product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group overflow-hidden rounded-[1.7rem] border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-300 hover:shadow-xl"
                  >
                    <div className="relative aspect-square overflow-hidden bg-zinc-100">
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
                            className="text-zinc-300"
                          />
                        </div>
                      )}

                      {/* BADGE */}

                      {product.badge && (
                        <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-[#39ff14] shadow-lg">
                          {product.badge}
                        </span>
                      )}

                      {/* DISCOUNT */}

                      {Number(product.discount || 0) >
                        0 && (
                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-black shadow-lg">
                          -{Number(product.discount)}%
                        </span>
                      )}

                      {/* OUT OF STOCK */}

                      {Number(
                        product.stock || 0
                      ) <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
                          <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-black shadow-xl">
                            نفد المخزون
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] font-bold text-zinc-400">
                        {product.categoryName ||
                          "ZENGER"}
                      </p>

                      <h3 className="mt-2 line-clamp-1 text-sm font-black">
                        {product.name}
                      </h3>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-sm font-black">
                            {formatPrice(
                              product.price
                            )}
                          </span>

                          {Number(
                            product.oldPrice
                          ) > 0 && (
                            <span className="mr-2 text-[10px] text-zinc-400 line-through">
                              {formatPrice(
                                product.oldPrice
                              )}
                            </span>
                          )}
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-50 px-2 py-1 text-[10px] font-bold text-zinc-500">
                          <Star
                            size={11}
                            className="fill-current"
                          />

                          {Number(
                            product.rating || 0
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

      {/* =====================================================
          WHY ZENGER
      ====================================================== */}

      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            {/* BLACK CARD */}

            <div className="group relative min-h-[390px] overflow-hidden rounded-[2.2rem] bg-[#070707] p-7 text-white sm:p-9">
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#39ff14]/10 blur-[90px] transition-all duration-700 group-hover:bg-[#39ff14]/15" />

              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full border border-white/[0.03]" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39ff14] text-black shadow-[0_10px_30px_rgba(57,255,20,0.1)]">
                    <Dumbbell size={21} />
                  </div>

                  <h2 className="mt-7 text-3xl font-black leading-tight sm:text-4xl">
                    ليه تختار
                    <span className="block text-[#39ff14]">
                      ZENGER؟
                    </span>
                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-8 text-zinc-400">
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

            {/* BENEFITS */}

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map(
                (item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-[1.7rem] border border-zinc-100 bg-zinc-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:bg-white hover:shadow-xl"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-800 shadow-sm transition-all duration-300 group-hover:bg-black group-hover:text-[#39ff14]">
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

      {/* =====================================================
          REVIEWS
      ====================================================== */}

      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black text-[#16a34a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                رأي عملائنا
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                الناس بتقول إيه؟
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                أهم حاجة عندنا إن العميل يكون
                مبسوط من المنتج والتجربة كلها.
              </p>
            </div>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-black"
            >
              شوف المنتجات

              <ChevronLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {customerReviews.map(
              (review) => (
                <article
                  key={review.id}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl"
                >
                  <div className="absolute left-5 top-5 text-5xl font-black leading-none text-zinc-100">
                    ”
                  </div>

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-[#39ff14]">
                        <MessageSquare size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-black">
                          {review.name}
                        </p>

                        <p className="text-[10px] text-zinc-400">
                          عميل ZENGER
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={13}
                            className={
                              star <=
                              review.rating
                                ? "fill-[#111111] text-[#111111]"
                                : "text-zinc-300"
                            }
                          />
                        )
                      )}
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-8 text-zinc-600">
                    “{review.text}”
                  </p>

                  <div className="mt-6 h-1 w-8 rounded-full bg-[#39ff14] transition-all duration-300 group-hover:w-14" />
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.3rem] bg-[#070707] px-6 py-16 text-center text-white sm:px-12">
          {/* GLOW */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#39ff14]/10 blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/[0.025] blur-[90px]" />

          {/* GRID */}

          <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:45px_45px]" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#39ff14] text-black shadow-[0_12px_35px_rgba(57,255,20,0.12)]">
              <Dumbbell size={24} />
            </div>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] font-black text-zinc-400">
              <Sparkles
                size={13}
                className="text-[#39ff14]"
              />

              ZENGER GYM STORE
            </span>

            <h2 className="mt-5 text-3xl font-black sm:text-5xl">
              جاهز تبدأ؟
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-zinc-400">
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
          LOCAL ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
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