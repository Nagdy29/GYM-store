import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  Phone,
  User,
  WalletCards,
} from "lucide-react";

import { useCart } from "../context/CartContext";

import {
  addOrderToFirebase,
} from "../firebase/orders";

function normalizeEgyptianPhone(value) {
  return value
    .replace(/[٠-٩]/g, (digit) =>
      String(
        "٠١٢٣٤٥٦٧٨٩".indexOf(
          digit
        )
      )
    )
    .replace(/\D/g, "");
}

function isValidEgyptianPhone(phone) {
  return /^01(0|1|2|5)\d{8}$/.test(
    phone
  );
}

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    shipping,
    total,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    governorate: "",
    address: "",
    notes: "",
  });

  const [payment, setPayment] =
    useState("cod");

  const [phoneError, setPhoneError] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    if (name === "phone") {
      const normalized =
        normalizeEgyptianPhone(
          value
        ).slice(0, 11);

      setForm((currentForm) => ({
        ...currentForm,
        phone: normalized,
      }));

      if (!normalized) {
        setPhoneError("");
        return;
      }

      if (
        normalized.length >= 3 &&
        !/^01(0|1|2|5)/.test(
          normalized
        )
      ) {
        setPhoneError(
          "رقم الموبايل لازم يبدأ بـ 010 أو 011 أو 012 أو 015."
        );

        return;
      }

      if (
        normalized.length === 11 &&
        !isValidEgyptianPhone(
          normalized
        )
      ) {
        setPhoneError(
          "اكتب رقم موبايل مصري صحيح مكون من 11 رقم."
        );

        return;
      }

      if (
        normalized.length < 11
      ) {
        setPhoneError(
          "رقم الموبايل لازم يكون 11 رقم."
        );

        return;
      }

      setPhoneError("");
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePhoneBlur = () => {
    const phone =
      normalizeEgyptianPhone(
        form.phone
      );

    if (!phone) {
      setPhoneError(
        "رقم الموبايل مطلوب."
      );
      return;
    }

    if (
      !isValidEgyptianPhone(phone)
    ) {
      setPhoneError(
        "رقم الموبايل المصري غير صحيح. لازم يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015."
      );
      return;
    }

    setPhoneError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    const phone =
      normalizeEgyptianPhone(
        form.phone
      );

    if (!isValidEgyptianPhone(phone)) {
      setPhoneError(
        "رقم الموبايل المصري غير صحيح. لازم يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015."
      );

      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    try {
      setSubmitting(true);

      const orderNumber =
        `HRQL-${Date.now()}`;

      const order = {
        orderNumber,

        customer: {
          ...form,
          phone,
        },

        payment,

        items: cartItems.map(
          (item) => ({
            id: item.id,
            name: item.name,
            price: Number(
              item.price
            ) || 0,
            image: item.image || "",
            size: item.size || null,
            color: item.color || null,
            quantity:
              Number(
                item.quantity
              ) || 1,
          })
        ),

        subtotal:
          Number(subtotal) || 0,

        shipping:
          Number(shipping) || 0,

        total:
          Number(total) || 0,

        status: "pending",
      };

      /*
       * SAVE ORDER TO FIREBASE
       *
       * Firebase هو المصدر الأساسي للطلبات.
       */
      const savedOrder =
        await addOrderToFirebase(
          order
        );

      /*
       * SAVE LAST ORDER LOCALLY
       *
       * بنستخدمه فقط في صفحة نجاح الطلب
       * عشان تعرض بيانات الطلب فورًا.
       */
      localStorage.setItem(
        "hiraql-last-order",
        JSON.stringify({
          ...order,
          id: savedOrder.id,
        })
      );

      /*
       * CLEAR CART
       */
      clearCart();

      /*
       * GO TO SUCCESS PAGE
       */
      navigate(
        "/order-success",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Checkout Firebase Error:",
        error
      );

      setSubmitError(
        "حصل خطأ أثناء تسجيل الطلب. اتأكد من الإنترنت وحاول مرة تانية."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#39ff14]/15 text-[#16a34a]">
          <CheckCircle2 size={50} />
        </div>

        <h1 className="mt-6 text-2xl font-black sm:text-3xl">
          مفيش منتجات لإتمام الطلب
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
          السلة فاضية حاليًا. ارجع للمنتجات
          واختار اللي محتاجه الأول.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-4 font-black text-white transition-all hover:-translate-y-0.5"
        >
          ابدأ التسوق
          <ArrowLeft size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* HEADER */}
      <section className="bg-black px-4 py-12 text-white sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-sm font-black text-[#39ff14]">
            HIRAQL GYM STORE
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            إتمام الطلب
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            اكتب بيانات التوصيل واختار طريقة الدفع.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="grid gap-7 lg:grid-cols-[1fr_390px]"
        >
          {/* CUSTOMER INFO */}
          <section className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7">
            <div>
              <h2 className="text-xl font-black sm:text-2xl">
                بيانات التوصيل
              </h2>

              <p className="mt-2 text-xs leading-6 text-zinc-500">
                البيانات دي هنستخدمها لتوصيل الطلب ليك.
              </p>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {/* NAME */}
              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <User size={16} />
                  الاسم بالكامل
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="اكتب اسمك بالكامل"
                  autoComplete="name"
                  minLength={3}
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <Phone size={16} />
                  رقم الهاتف
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handlePhoneBlur}
                  placeholder="01xxxxxxxxx"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={11}
                  className={`h-14 w-full rounded-2xl border bg-zinc-50 px-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 focus:bg-white ${
                    phoneError
                      ? "border-red-400 focus:border-red-500"
                      : "border-zinc-200 focus:border-black"
                  }`}
                />

                {phoneError ? (
                  <p className="mt-2 text-xs font-bold text-red-500">
                    {phoneError}
                  </p>
                ) : (
                  <p className="mt-2 text-[10px] text-zinc-400">
                    مثال: 01012345678
                  </p>
                )}
              </div>

              {/* GOVERNORATE */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <MapPin size={16} />
                  المحافظة
                </label>

                <input
                  required
                  name="governorate"
                  value={
                    form.governorate
                  }
                  onChange={handleChange}
                  placeholder="المحافظة"
                  autoComplete="address-level1"
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white"
                />
              </div>

              {/* ADDRESS */}
              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <MapPin size={16} />
                  العنوان بالتفصيل
                </label>

                <textarea
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="4"
                  minLength={8}
                  placeholder="الشارع، رقم العقار، الدور، الشقة..."
                  autoComplete="street-address"
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white"
                />
              </div>

              {/* NOTES */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-black">
                  ملاحظات إضافية

                  <span className="mr-2 text-xs font-normal text-zinc-400">
                    اختياري
                  </span>
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="مثلاً: اتصل بيا قبل التوصيل..."
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <div className="my-8 h-px bg-zinc-100" />

            {/* PAYMENT */}
            <div>
              <div className="flex items-center gap-2">
                <WalletCards size={20} />

                <h2 className="text-xl font-black">
                  طريقة الدفع
                </h2>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                حاليًا الدفع المتاح هو الدفع عند الاستلام.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-black bg-zinc-50 p-4 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    payment === "cod"
                  }
                  onChange={(event) =>
                    setPayment(
                      event.target.value
                    )
                  }
                  className="mt-1 h-4 w-4 accent-[#39ff14]"
                />

                <div className="min-w-0">
                  <p className="font-black">
                    الدفع عند الاستلام
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    ادفع المبلغ عند وصول الطلب ليك.
                  </p>
                </div>
              </label>

              <label className="flex cursor-not-allowed items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  disabled
                  className="mt-1 h-4 w-4"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">
                      الدفع الإلكتروني
                    </p>

                    <span className="rounded-full bg-black px-2 py-1 text-[9px] font-black text-[#39ff14]">
                      قريبًا
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    هيتم تفعيله بعد ربط بوابة الدفع.
                  </p>
                </div>
              </label>
            </div>

            {/* FIREBASE ERROR */}
            {submitError && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-bold leading-6 text-red-600">
                  {submitError}
                </p>
              </div>
            )}
          </section>

          {/* ORDER SUMMARY */}
          <aside>
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 lg:sticky lg:top-28">
              <h2 className="text-xl font-black">
                ملخص الطلب
              </h2>

              <div className="mt-5 max-h-[420px] space-y-4 overflow-y-auto pl-1">
                {cartItems.map(
                  (item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs font-black">
                          {item.name}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.size && (
                            <span className="text-[9px] text-zinc-400">
                              مقاس{" "}
                              {item.size}
                            </span>
                          )}

                          {item.color && (
                            <span className="text-[9px] text-zinc-400">
                              •{" "}
                              {item.color}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] text-zinc-400">
                          الكمية:{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-black">
                        {(
                          Number(
                            item.price
                          ) *
                          Number(
                            item.quantity
                          )
                        ).toLocaleString(
                          "ar-EG"
                        )}{" "}
                        جنيه
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="my-6 h-px bg-zinc-100" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    المنتجات
                  </span>

                  <span className="font-black">
                    {Number(
                      subtotal
                    ).toLocaleString(
                      "ar-EG"
                    )}{" "}
                    جنيه
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    الشحن
                  </span>

                  <span className="font-black">
                    {shipping === 0
                      ? "مجاني"
                      : `${Number(
                          shipping
                        ).toLocaleString(
                          "ar-EG"
                        )} جنيه`}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-zinc-100" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-black">
                  الإجمالي
                </span>

                <span className="text-2xl font-black">
                  {Number(
                    total
                  ).toLocaleString(
                    "ar-EG"
                  )}{" "}
                  جنيه
                </span>
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  Boolean(phoneError)
                }
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#39ff14] font-black text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(57,255,20,0.18)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
              >
                <LockKeyhole size={18} />

                {submitting
                  ? "جاري تسجيل الطلب..."
                  : "تأكيد الطلب"}
              </button>

              <Link
                to="/cart"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 text-sm font-black transition-all hover:border-black"
              >
                الرجوع للسلة
              </Link>

              <p className="mt-4 text-center text-[10px] leading-5 text-zinc-400">
                بالضغط على تأكيد الطلب، يتم تسجيل
                الطلب في النظام وبدء تجهيزه.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;