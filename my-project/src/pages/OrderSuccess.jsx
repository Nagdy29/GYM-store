import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Home,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

function OrderSuccess() {
  const [copied, setCopied] = useState(false);

  let order = null;

  try {
    order = JSON.parse(
      localStorage.getItem("hiraql-last-order")
    );
  } catch {
    order = null;
  }

  const copyOrderId = async () => {
    if (!order?.id) return;

    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-50">
      {/* TOP SUCCESS HEADER */}
      <section className="relative overflow-hidden bg-black px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        {/* BACKGROUND EFFECT */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#39ff14]/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-[#39ff14]/5 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* ICON */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#39ff14] text-black shadow-[0_0_60px_rgba(57,255,20,0.2)] sm:h-28 sm:w-28">
            <CheckCircle2
              size={55}
              strokeWidth={2.2}
              className="sm:h-16 sm:w-16"
            />
          </div>

          <span className="mt-7 inline-flex rounded-full border border-[#39ff14]/20 bg-[#39ff14]/10 px-4 py-2 text-xs font-black text-[#39ff14]">
            تم تأكيد الطلب بنجاح 🎉
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
            شكرًا لاختيارك
            <span className="block text-[#39ff14]">
              HIRAQL
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            طلبك اتسجل بنجاح، وهنبدأ في تجهيزه للتوصيل.
            احتفظ برقم الطلب عشان تقدر ترجع له بسهولة.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* ORDER NUMBER */}
        {order?.id && (
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-400">
                  رقم الطلب
                </p>

                <h2 className="mt-1 break-all text-2xl font-black tracking-wide sm:text-3xl">
                  {order.id}
                </h2>

                {orderDate && (
                  <p className="mt-2 text-xs text-zinc-400">
                    تاريخ الطلب: {orderDate}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={copyOrderId}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
              >
                {copied ? (
                  <>
                    <Check size={17} />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy size={17} />
                    نسخ رقم الطلب
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* STATUS */}
        <section className="mt-5 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-black">
            حالة الطلب
          </h2>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-5">
            {/* STEP 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#39ff14] text-black sm:h-14 sm:w-14">
                <Check size={22} strokeWidth={3} />
              </div>

              <p className="mt-3 text-[10px] font-black sm:text-sm">
                تم استلام الطلب
              </p>

              <p className="mt-1 hidden text-xs text-zinc-400 sm:block">
                تم بنجاح
              </p>
            </div>

            {/* STEP 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#39ff14] sm:h-14 sm:w-14">
                <PackageCheck size={21} />
              </div>

              <p className="mt-3 text-[10px] font-black sm:text-sm">
                جاري التجهيز
              </p>

              <p className="mt-1 hidden text-xs text-zinc-400 sm:block">
                قريبًا
              </p>
            </div>

            {/* STEP 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 sm:h-14 sm:w-14">
                <Truck size={21} />
              </div>

              <p className="mt-3 text-[10px] font-black text-zinc-500 sm:text-sm">
                التوصيل
              </p>

              <p className="mt-1 hidden text-xs text-zinc-400 sm:block">
                لاحقًا
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-6 flex items-center px-6 sm:px-10">
            <div className="h-1 flex-1 rounded-full bg-[#39ff14]" />

            <div className="h-1 flex-1 rounded-full bg-zinc-200" />
          </div>
        </section>

        {/* ORDER SUMMARY */}
        {order && (
          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* ITEMS */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    تفاصيل الطلب
                  </h2>

                  <p className="mt-1 text-xs text-zinc-400">
                    المنتجات المطلوبة
                  </p>
                </div>

                <ShoppingBag
                  size={22}
                  className="text-zinc-300"
                />
              </div>

              <div className="mt-6 space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-3 rounded-2xl bg-zinc-50 p-3 sm:gap-4 sm:p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-black sm:text-base">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.size && (
                          <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-zinc-500">
                            المقاس: {item.size}
                          </span>
                        )}

                        {item.color && (
                          <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-zinc-500">
                            اللون: {item.color}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-zinc-400">
                          الكمية: {item.quantity}
                        </span>

                        <span className="text-sm font-black">
                          {item.price * item.quantity} جنيه
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="h-fit rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
              <h2 className="text-xl font-black">
                ملخص الحساب
              </h2>

              <div className="my-6 h-px bg-zinc-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    المنتجات
                  </span>

                  <span className="font-black">
                    {order.subtotal} جنيه
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    الشحن
                  </span>

                  <span className="font-black">
                    {order.shipping === 0
                      ? "مجاني"
                      : `${order.shipping} جنيه`}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-zinc-100" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-black">
                  الإجمالي
                </span>

                <span className="text-2xl font-black text-[#16a34a]">
                  {order.total} جنيه
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs text-zinc-400">
                  طريقة الدفع
                </p>

                <p className="mt-1 font-black">
                  الدفع عند الاستلام
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CUSTOMER INFO */}
        {order?.customer && (
          <section className="mt-5 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
            <h2 className="text-xl font-black">
              بيانات التوصيل
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs text-zinc-400">
                  الاسم
                </p>

                <p className="mt-1 text-sm font-black">
                  {order.customer.name}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs text-zinc-400">
                  رقم الهاتف
                </p>

                <p
                  dir="ltr"
                  className="mt-1 text-right text-sm font-black"
                >
                  {order.customer.phone}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
                <p className="text-xs text-zinc-400">
                  العنوان
                </p>

                <p className="mt-1 text-sm font-black leading-7">
                  {order.customer.governorate} -{" "}
                  {order.customer.address}
                </p>
              </div>

              {order.customer.notes && (
                <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
                  <p className="text-xs text-zinc-400">
                    الملاحظات
                  </p>

                  <p className="mt-1 text-sm font-bold leading-7">
                    {order.customer.notes}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ACTIONS */}
        <section className="mt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-black px-7 font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800"
            >
              <ShoppingBag size={18} />
              مواصلة التسوق
            </Link>

            <Link
              to="/"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-7 font-black transition-all duration-300 hover:-translate-y-1 hover:border-black"
            >
              <Home size={18} />
              الرئيسية
            </Link>
          </div>
        </section>

        {/* FOOT NOTE */}
        <div className="mt-8 text-center">
          <p className="text-xs leading-6 text-zinc-400">
            شكرًا لثقتك في HIRAQL GYM STORE ❤️
            <br />
            هنفضل نطور المتجر ونوفرلك كل جديد.
          </p>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccess;