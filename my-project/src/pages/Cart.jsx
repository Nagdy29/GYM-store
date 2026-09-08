import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  PackageCheck,
  Sparkles,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function formatPrice(value) {
  return Number(value || 0).toLocaleString("ar-EG");
}

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div
        dir="rtl"
        className="min-h-[80vh] bg-white"
      >
        {/* HERO */}
        <section className="relative overflow-hidden bg-black px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#39ff14]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#39ff14]/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src="/logo.jpg"
                  alt="ZENGER GYM STORE"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-black">
                  ZENGER
                </p>

                <p className="text-[10px] font-bold text-[#39ff14]">
                  GYM STORE
                </p>
              </div>
            </div>

            <h1 className="mt-7 text-3xl font-black sm:text-4xl">
              سلة التسوق
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              راجع منتجاتك وأكمل طلبك بسهولة.
            </p>
          </div>
        </section>

        {/* EMPTY */}
        <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#39ff14]/10 blur-2xl" />

            <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-zinc-200 bg-zinc-50">
              <ShoppingBag
                size={44}
                strokeWidth={1.5}
                className="text-zinc-400"
              />
            </div>
          </div>

          <h2 className="mt-7 text-2xl font-black sm:text-3xl">
            السلة لسه فاضية
          </h2>

          <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
            اختار المنتجات اللي محتاجها من
            ZENGER وابدأ طلبك بسهولة.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-black px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800"
          >
            ابدأ التسوق

            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-zinc-50"
    >
      {/* HERO */}
      <section className="relative overflow-hidden bg-black px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#39ff14]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-36 right-10 h-96 w-96 rounded-full bg-[#39ff14]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src="/logo.jpg"
                alt="ZENGER GYM STORE"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-black">
                ZENGER
              </p>

              <p className="text-[10px] font-bold text-[#39ff14]">
                GYM STORE
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#39ff14]">
                <Sparkles size={15} />

                <span className="text-xs font-black">
                  طلبك جاهز تقريبًا
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                سلة التسوق
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                راجع اختياراتك قبل ما تكمل الطلب.
              </p>
            </div>

            <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 backdrop-blur">
              {cartCount} قطعة في السلة
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[1fr_380px]">
          {/* PRODUCTS */}
          <section>
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">
                    المنتجات المختارة
                  </h2>

                  <p className="mt-1 text-xs text-zinc-400">
                    {cartItems.length} نوع من المنتجات
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-red-500 transition-all hover:bg-red-50"
                >
                  <Trash2 size={15} />

                  <span className="hidden sm:inline">
                    إفراغ السلة
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="group rounded-[1.5rem] border border-zinc-100 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow-lg sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-5">
                      {/* IMAGE */}
                      <Link
                        to={`/products/${item.id}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:h-32 sm:w-32"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-300">
                            <ShoppingBag size={30} />
                          </div>
                        )}
                      </Link>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              to={`/products/${item.id}`}
                              className="line-clamp-2 text-sm font-black transition-colors hover:text-[#16a34a] sm:text-base"
                            >
                              {item.name}
                            </Link>

                            {(item.size || item.color) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.size && (
                                  <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-600">
                                    المقاس: {item.size}
                                  </span>
                                )}

                                {item.color && (
                                  <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-600">
                                    اللون: {item.color}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.id,
                                item.size,
                                item.color
                              )
                            }
                            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 sm:flex"
                            aria-label="حذف المنتج"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          {/* QUANTITY */}
                          <div className="flex h-10 items-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                  item.size,
                                  item.color
                                )
                              }
                              className="flex h-full w-9 items-center justify-center transition-colors hover:bg-zinc-200"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="w-9 text-center text-sm font-black">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                  item.size,
                                  item.color
                                )
                              }
                              className="flex h-full w-9 items-center justify-center transition-colors hover:bg-zinc-200"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* PRICE */}
                          <div className="text-left">
                            <p className="text-base font-black sm:text-lg">
                              {formatPrice(
                                item.price *
                                  item.quantity
                              )}{" "}
                              جنيه
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-0.5 text-[10px] text-zinc-400">
                                {formatPrice(
                                  item.price
                                )}{" "}
                                جنيه للقطعة
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.size,
                              item.color
                            )
                          }
                          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-red-500 sm:hidden"
                        >
                          <Trash2 size={13} />
                          حذف المنتج
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 text-sm font-black text-zinc-600 transition-all hover:gap-3 hover:text-black"
              >
                <ArrowLeft size={17} />
                مواصلة التسوق
              </Link>
            </div>

            {/* FEATURES */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39ff14]/10 text-[#16a34a] transition-all group-hover:bg-[#39ff14] group-hover:text-black">
                  <Truck size={20} />
                </div>

                <p className="mt-4 text-sm font-black">
                  توصيل سريع
                </p>

                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  بنجهز طلبك ونوصله في أسرع وقت ممكن.
                </p>
              </div>

              <div className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-all group-hover:bg-black group-hover:text-[#39ff14]">
                  <ShieldCheck size={20} />
                </div>

                <p className="mt-4 text-sm font-black">
                  طلب آمن
                </p>

                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  بيانات طلبك بتتعامل معاها بشكل آمن.
                </p>
              </div>

              <div className="group rounded-[1.5rem] border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-all group-hover:bg-black group-hover:text-[#39ff14]">
                  <PackageCheck size={20} />
                </div>

                <p className="mt-4 text-sm font-black">
                  تجهيز باهتمام
                </p>

                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  كل طلب بيتجهز بعناية قبل ما يخرج.
                </p>
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <aside>
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">
                  ملخص الطلب
                </h2>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-[#39ff14]">
                  <ShoppingBag size={17} />
                </div>
              </div>

              <div className="my-6 h-px bg-zinc-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    عدد القطع
                  </span>

                  <span className="font-black">
                    {cartCount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    إجمالي المنتجات
                  </span>

                  <span className="font-black">
                    {formatPrice(subtotal)} جنيه
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    الشحن
                  </span>

                  <span className="font-black">
                    {shipping === 0
                      ? "مجاني"
                      : `${formatPrice(
                          shipping
                        )} جنيه`}
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-zinc-100" />

              <div className="rounded-2xl bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-black">
                    الإجمالي
                  </span>

                  <span className="text-2xl font-black text-[#16a34a]">
                    {formatPrice(total)} جنيه
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#39ff14] font-black text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(57,255,20,0.18)]"
              >
                إتمام الطلب

                <ArrowLeft size={18} />
              </button>

              <p className="mt-4 text-center text-[10px] leading-5 text-zinc-400">
                كمل بياناتك في الخطوة الجاية وإحنا
                نهتم بالباقي.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;