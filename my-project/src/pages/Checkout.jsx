import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Phone,
  Sparkles,
  User,
  WalletCards,
} from "lucide-react";

import { useCart } from "../context/CartContext";

import {
  addOrderToFirebase,
} from "../firebase/orders";

import {
  getPendingSecretClaims,
} from "../firebase/secretChallenges";

import {
  getShippingRates,
} from "../firebase/shipping";

function normalizeEgyptianPhone(
  value
) {
  return String(value || "")
    .replace(
      /[٠-٩]/g,
      (digit) =>
        String(
          "٠١٢٣٤٥٦٧٨٩".indexOf(
            digit
          )
        )
    )
    .replace(
      /\D/g,
      ""
    );
}

function isValidEgyptianPhone(
  phone
) {
  return /^01(0|1|2|5)\d{8}$/.test(
    phone
  );
}

function formatCurrency(
  value
) {
  return Number(
    value || 0
  ).toLocaleString(
    "ar-EG"
  );
}

function getRewardLabel(
  claim
) {
  const reward =
    claim?.reward;

  if (!reward) {
    return "مكافأة";
  }

  switch (reward.type) {
    case "percentage":
      return `خصم ${reward.value}%`;

    case "amount":
      return `خصم ${reward.value} جنيه`;

    case "freeShipping":
      return "شحن مجاني";

    case "giftTshirt":
      return "تيشيرت هدية";

    case "giftProduct":
      return (
        reward.productName ||
        "منتج هدية"
      );

    default:
      return "مكافأة";
  }
}

function calculateSecretDiscount(
  claim,
  subtotal
) {
  if (!claim?.reward) {
    return 0;
  }

  const reward =
    claim.reward;

  const numericSubtotal =
    Number(subtotal) || 0;

  switch (reward.type) {
    case "percentage": {
      const percentage =
        Number(
          reward.value
        ) || 0;

      const discount =
        numericSubtotal *
        (percentage / 100);

      return Math.min(
        Math.max(
          discount,
          0
        ),
        numericSubtotal
      );
    }

    case "amount": {
      const amount =
        Number(
          reward.value
        ) || 0;

      return Math.min(
        Math.max(
          amount,
          0
        ),
        numericSubtotal
      );
    }

    default:
      return 0;
  }
}

function Checkout() {
  const navigate =
    useNavigate();

  const {
    cartItems,
    subtotal,
    clearCart,
  } = useCart();

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      governorate: "",
      address: "",
      notes: "",
    });

  const [payment, setPayment] =
    useState("cod");

  const [
    phoneError,
    setPhoneError,
  ] = useState("");

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /*
   * SHIPPING
   */

  const [
    shippingRates,
    setShippingRates,
  ] = useState([]);

  const [
    loadingShipping,
    setLoadingShipping,
  ] = useState(true);

  /*
   * SECRET CLAIM
   */

  const [
    secretClaim,
    setSecretClaim,
  ] = useState(null);

  const [
    loadingSecretClaim,
    setLoadingSecretClaim,
  ] = useState(true);

  /*
   * ==================================================
   * LOAD SHIPPING
   * ==================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadShipping =
      async () => {
        try {
          setLoadingShipping(
            true
          );

          const rates =
            await getShippingRates();

          if (!mounted) {
            return;
          }

          setShippingRates(
            Array.isArray(rates)
              ? rates.filter(
                  (item) =>
                    item.active !==
                    false
                )
              : []
          );
        } catch (error) {
          console.error(
            "Load shipping rates error:",
            error
          );

          if (mounted) {
            setShippingRates(
              []
            );
          }
        } finally {
          if (mounted) {
            setLoadingShipping(
              false
            );
          }
        }
      };

    loadShipping();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ==================================================
   * LOAD SECRET REWARD
   * ==================================================
   */

  useEffect(() => {
    let mounted = true;

    const loadSecretReward =
      async () => {
        try {
          setLoadingSecretClaim(
            true
          );

          const claims =
            await getPendingSecretClaims();

          if (!mounted) {
            return;
          }

          const pendingClaim =
            Array.isArray(
              claims
            )
              ? claims[0] || null
              : null;

          setSecretClaim(
            pendingClaim
          );
        } catch (error) {
          console.error(
            "Load secret claim error:",
            error
          );

          if (mounted) {
            setSecretClaim(
              null
            );
          }
        } finally {
          if (mounted) {
            setLoadingSecretClaim(
              false
            );
          }
        }
      };

    loadSecretReward();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ==================================================
   * CURRENT SHIPPING RATE
   * ==================================================
   */

  const selectedShipping =
    useMemo(() => {
      if (
        !form.governorate
      ) {
        return null;
      }

      return (
        shippingRates.find(
          (rate) =>
            rate.name ===
            form.governorate
        ) || null
      );
    }, [
      form.governorate,
      shippingRates,
    ]);

  /*
   * ==================================================
   * TOTALS
   * ==================================================
   */

  const calculatedTotals =
    useMemo(() => {
      const safeSubtotal =
        Number(subtotal) || 0;

      const regularShipping =
        selectedShipping
          ? Number(
              selectedShipping.shippingPrice
            ) || 0
          : 0;

      const discount =
        calculateSecretDiscount(
          secretClaim,
          safeSubtotal
        );

      const isFreeShipping =
        secretClaim?.reward?.type ===
        "freeShipping";

      const finalShipping =
        isFreeShipping
          ? 0
          : regularShipping;

      const finalTotal =
        Math.max(
          0,
          safeSubtotal -
            discount +
            finalShipping
        );

      return {
        subtotal:
          safeSubtotal,

        regularShipping,

        shipping:
          finalShipping,

        discount,

        finalTotal,

        originalTotal:
          safeSubtotal +
          regularShipping,
      };
    }, [
      subtotal,
      selectedShipping,
      secretClaim,
    ]);

  /*
   * ==================================================
   * FORM CHANGE
   * ==================================================
   */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (
      name === "phone"
    ) {
      const normalized =
        normalizeEgyptianPhone(
          value
        ).slice(0, 11);

      setForm(
        (currentForm) => ({
          ...currentForm,
          phone: normalized,
        })
      );

      if (!normalized) {
        setPhoneError("");
        return;
      }

      if (
        normalized.length >=
          3 &&
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
        normalized.length ===
          11 &&
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
        normalized.length <
        11
      ) {
        setPhoneError(
          "رقم الموبايل لازم يكون 11 رقم."
        );

        return;
      }

      setPhoneError("");
      return;
    }

    setForm(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      })
    );

    if (
      name === "governorate"
    ) {
      setSubmitError("");
    }
  };

  /*
   * ==================================================
   * PHONE BLUR
   * ==================================================
   */

  const handlePhoneBlur =
    () => {
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
        !isValidEgyptianPhone(
          phone
        )
      ) {
        setPhoneError(
          "رقم الموبايل المصري غير صحيح. لازم يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015."
        );

        return;
      }

      setPhoneError("");
    };

  /*
   * ==================================================
   * SUBMIT ORDER
   * ==================================================
   */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setSubmitError("");

      const phone =
        normalizeEgyptianPhone(
          form.phone
        );

      if (
        !isValidEgyptianPhone(
          phone
        )
      ) {
        setPhoneError(
          "رقم الموبايل المصري غير صحيح. لازم يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015."
        );

        return;
      }

      if (
        cartItems.length ===
        0
      ) {
        return;
      }

      if (
        !form.governorate
      ) {
        setSubmitError(
          "اختار المحافظة الأول عشان نحدد تكلفة الشحن."
        );

        return;
      }

      if (
        !selectedShipping
      ) {
        setSubmitError(
          "المحافظة المختارة مش متاحة للشحن حاليًا."
        );

        return;
      }

      try {
        setSubmitting(true);

        /*
         * ==================================================
         * REFRESH SECRET CLAIM
         * ==================================================
         */

        let activeClaim =
          secretClaim;

        try {
          const pendingClaims =
            await getPendingSecretClaims();

          if (
            Array.isArray(
              pendingClaims
            )
          ) {
            activeClaim =
              pendingClaims[0] ||
              null;
          }
        } catch (
          claimRefreshError
        ) {
          console.error(
            "Secret claim refresh error:",
            claimRefreshError
          );
        }

        /*
         * ==================================================
         * REFRESH SHIPPING
         * ==================================================
         */

        let latestShippingRates =
          shippingRates;

        try {
          latestShippingRates =
            await getShippingRates();
        } catch (
          shippingRefreshError
        ) {
          console.error(
            "Shipping refresh error:",
            shippingRefreshError
          );
        }

        const latestShipping =
          latestShippingRates.find(
            (rate) =>
              rate.name ===
                form.governorate &&
              rate.active !==
                false
          );

        if (!latestShipping) {
          setSubmitError(
            "المحافظة دي مبقتش متاحة للشحن. اختار محافظة تانية."
          );

          return;
        }

        /*
         * ==================================================
         * FINAL CALCULATION
         * ==================================================
         */

        const safeSubtotal =
          Number(subtotal) || 0;

        const regularShipping =
          Number(
            latestShipping.shippingPrice
          ) || 0;

        const secretDiscount =
          calculateSecretDiscount(
            activeClaim,
            safeSubtotal
          );

        const freeShipping =
          activeClaim?.reward
            ?.type ===
          "freeShipping";

        const finalShipping =
          freeShipping
            ? 0
            : regularShipping;

        const finalTotal =
          Math.max(
            0,
            safeSubtotal -
              secretDiscount +
              finalShipping
          );

        const orderNumber =
          `HRQL-${Date.now()}`;

        /*
         * ==================================================
         * ORDER ITEMS
         * ==================================================
         */

        const orderItems =
          cartItems.map(
            (item) => ({
              id:
                item.id || "",

              name:
                item.name || "",

              price:
                Number(
                  item.price
                ) || 0,

              image:
                item.image || "",

              size:
                item.size ||
                null,

              color:
                item.color ||
                null,

              quantity:
                Number(
                  item.quantity
                ) || 1,
            })
          );

        /*
         * ==================================================
         * SECRET REWARD SNAPSHOT
         * ==================================================
         */

        const secretReward =
          activeClaim
            ? {
                claimId:
                  activeClaim.id ||
                  "",

                challengeId:
                  activeClaim.challengeId ||
                  "",

                challengeTitle:
                  activeClaim.challengeTitle ||
                  "",

                couponCode:
                  activeClaim.couponCode ||
                  "",

                rewardType:
                  activeClaim.reward
                    ?.type ||
                  "",

                rewardValue:
                  activeClaim.reward
                    ?.value ??
                  null,

                rewardProductId:
                  activeClaim.reward
                    ?.productId ||
                  "",

                rewardProductName:
                  activeClaim.reward
                    ?.productName ||
                  "",

                /*
                 * القيمة الفعلية اللي اتخصمت
                 * من الطلب.
                 */

                discount:
                  Number(
                    secretDiscount
                  ) || 0,

                freeShipping:
                  Boolean(
                    freeShipping
                  ),

                /*
                 * هيتأكد نهائيًا داخل
                 * Firebase Transaction.
                 */

                used: true,
              }
            : null;

        /*
         * ==================================================
         * CREATE ORDER
         * ==================================================
         *
         * مهم:
         * addOrderToFirebase دلوقتي بيعمل
         * Transaction لو فيه secretReward.
         *
         * يعني:
         * Order + Used Claim
         * بيتسجلوا مع بعض.
         */

        const order = {
          orderNumber,

          customer: {
            ...form,
            phone,
          },

          shippingGovernorate:
            latestShipping.name,

          payment,

          items:
            orderItems,

          subtotal:
            safeSubtotal,

          shipping:
            finalShipping,

          shippingBeforeReward:
            regularShipping,

          discount:
            Number(
              secretDiscount
            ) || 0,

          total:
            finalTotal,

          originalTotal:
            safeSubtotal +
            regularShipping,

          secretReward,

          status:
            "pending",
        };

        const savedOrder =
          await addOrderToFirebase(
            order
          );

        /*
         * ==================================================
         * LAST ORDER
         * ==================================================
         */

        localStorage.setItem(
          "hiraql-last-order",
          JSON.stringify({
            ...order,

            id:
              savedOrder.id,

            shippingGovernorate:
              latestShipping.name,

            shippingBeforeReward:
              regularShipping,

            secretCoupon:
              activeClaim?.couponCode ||
              "",

            finalTotal,

            secretReward,
          })
        );

        /*
         * ==================================================
         * CLEAR CART
         * ==================================================
         */

        clearCart();

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

        if (
          error?.code ===
          "SECRET_CLAIM_ALREADY_USED"
        ) {
          setSubmitError(
            "المكافأة دي اتستخدمت بالفعل في طلب سابق، ومينفعش تستخدمها مرة تانية."
          );

          setSecretClaim(null);

          return;
        }

        if (
          error?.code ===
          "SECRET_CLAIM_NOT_FOUND"
        ) {
          setSubmitError(
            "المكافأة دي مبقتش موجودة. ارجع للمفتاح الخفي وحاول تحصل على مكافأة جديدة."
          );

          setSecretClaim(null);

          return;
        }

        if (
          error?.code ===
          "SECRET_CLAIM_NOT_PENDING"
        ) {
          setSubmitError(
            "المكافأة دي مش متاحة للاستخدام حاليًا."
          );

          setSecretClaim(null);

          return;
        }

        if (
          error?.code ===
          "SECRET_CLAIM_CODE_MISMATCH"
        ) {
          setSubmitError(
            "حصل تعارض في كود المكافأة. حاول تحديث الصفحة وإعادة المحاولة."
          );

          return;
        }

        setSubmitError(
          "حصل خطأ أثناء تسجيل الطلب. اتأكد من الإنترنت وحاول مرة تانية."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /*
   * ==================================================
   * EMPTY CART
   * ==================================================
   */

  if (
    cartItems.length ===
    0
  ) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 text-center"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#39ff14]/15 text-[#16a34a]">
          <CheckCircle2
            size={50}
          />
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
          <ArrowLeft
            size={18}
          />
        </Link>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-zinc-50"
    >
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
            اكتب بيانات التوصيل واختار المحافظة
            عشان نحسب الشحن تلقائيًا.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <form
          onSubmit={
            handleSubmit
          }
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
                  <User
                    size={16}
                  />
                  الاسم بالكامل
                </label>

                <input
                  required
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="اكتب اسمك بالكامل"
                  autoComplete="name"
                  minLength={3}
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none transition-all placeholder:text-zinc-400 focus:border-black focus:bg-white"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <Phone
                    size={16}
                  />
                  رقم الهاتف
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  onBlur={
                    handlePhoneBlur
                  }
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
                  <MapPin
                    size={16}
                  />
                  المحافظة
                </label>

                <select
                  required
                  name="governorate"
                  value={
                    form.governorate
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    loadingShipping ||
                    shippingRates.length ===
                      0
                  }
                  className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none transition-all focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingShipping
                      ? "جاري تحميل المحافظات..."
                      : shippingRates.length ===
                        0
                      ? "لا توجد محافظات متاحة"
                      : "اختار المحافظة"}
                  </option>

                  {shippingRates.map(
                    (rate) => (
                      <option
                        key={
                          rate.id
                        }
                        value={
                          rate.name
                        }
                      >
                        {
                          rate.name
                        }{" "}
                        —{" "}
                        {formatCurrency(
                          rate.shippingPrice
                        )}{" "}
                        جنيه شحن
                      </option>
                    )
                  )}
                </select>

                {selectedShipping &&
                  form.governorate && (
                    <div className="mt-2 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
                      <span className="text-[10px] text-zinc-400">
                        سعر الشحن
                      </span>

                      <span className="text-xs font-black text-[#16a34a]">
                        {secretClaim?.reward
                          ?.type ===
                        "freeShipping"
                          ? "مجاني 🎉"
                          : `${formatCurrency(
                              selectedShipping.shippingPrice
                            )} جنيه`}
                      </span>
                    </div>
                  )}
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <MapPin
                    size={16}
                  />
                  العنوان بالتفصيل
                </label>

                <textarea
                  required
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
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
                  value={
                    form.notes
                  }
                  onChange={
                    handleChange
                  }
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
                <WalletCards
                  size={20}
                />

                <h2 className="text-xl font-black">
                  طريقة الدفع
                </h2>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                حاليًا الدفع المتاح هو الدفع عند الاستلام.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-black bg-zinc-50 p-4">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    payment ===
                    "cod"
                  }
                  onChange={(
                    event
                  ) =>
                    setPayment(
                      event.target
                        .value
                    )
                  }
                  className="mt-1 h-4 w-4 accent-[#39ff14]"
                />

                <div>
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
                  disabled
                  className="mt-1 h-4 w-4"
                />

                <div>
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

            {/* SECRET */}

            {secretClaim && (
              <div className="mt-7 overflow-hidden rounded-2xl border border-[#39ff14]/20 bg-[#39ff14]/5">
                <div className="h-1 bg-[#39ff14]" />

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                      <Sparkles
                        size={19}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#16a34a]">
                        مكافأة المفتاح الخفي
                      </p>

                      <p className="mt-1 text-sm font-black text-zinc-900">
                        {getRewardLabel(
                          secretClaim
                        )}
                      </p>

                      {secretClaim.reward
                        ?.type ===
                        "percentage" ||
                      secretClaim.reward
                        ?.type ===
                        "amount" ? (
                        <p className="mt-1 text-xs font-black text-[#16a34a]">
                          الخصم المتوقع:{" "}
                          {formatCurrency(
                            calculatedTotals.discount
                          )}{" "}
                          جنيه
                        </p>
                      ) : null}

                      <p className="mt-2 text-[11px] leading-6 text-zinc-500">
                        المكافأة هتتطبق تلقائيًا عند تأكيد الطلب.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR */}

            {submitError && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-bold leading-6 text-red-600">
                  {submitError}
                </p>
              </div>
            )}
          </section>

          {/* SUMMARY */}

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
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs font-black">
                          {
                            item.name
                          }
                        </p>

                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.size && (
                            <span className="text-[9px] text-zinc-400">
                              مقاس{" "}
                              {
                                item.size
                              }
                            </span>
                          )}

                          {item.color && (
                            <span className="text-[9px] text-zinc-400">
                              •{" "}
                              {
                                item.color
                              }
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] text-zinc-400">
                          الكمية:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-black">
                        {formatCurrency(
                          Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )
                        )}{" "}
                        جنيه
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="my-6 h-px bg-zinc-100" />

              <div className="space-y-4 text-sm">
                {/* PRODUCTS */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">
                    المنتجات
                  </span>

                  <span className="font-black">
                    {formatCurrency(
                      calculatedTotals.subtotal
                    )}{" "}
                    جنيه
                  </span>
                </div>

                {/* SHIPPING */}

                {form.governorate && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-500">
                      الشحن —{" "}
                      {
                        form.governorate
                      }
                    </span>

                    <span className="font-black">
                      {calculatedTotals.shipping ===
                      0
                        ? "مجاني"
                        : `${formatCurrency(
                            calculatedTotals.shipping
                          )} جنيه`}
                    </span>
                  </div>
                )}

                {!form.governorate && (
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                    <p className="text-xs font-bold leading-6 text-zinc-500">
                      اختار المحافظة عشان يظهر سعر الشحن.
                    </p>
                  </div>
                )}

                {/* SECRET DISCOUNT */}

                {calculatedTotals.discount >
                  0 && (
                  <div className="rounded-2xl border border-[#39ff14]/20 bg-[#39ff14]/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Gift
                          size={17}
                          className="text-[#16a34a]"
                        />

                        <span className="font-black text-[#16a34a]">
                          خصم المفتاح الخفي
                        </span>
                      </div>

                      <span className="font-black text-[#16a34a]">
                        -{" "}
                        {formatCurrency(
                          calculatedTotals.discount
                        )}{" "}
                        جنيه
                      </span>
                    </div>

                    {secretClaim?.couponCode && (
                      <div className="mt-3 border-t border-[#39ff14]/10 pt-3">
                        <p className="text-[10px] text-zinc-500">
                          كود المكافأة
                        </p>

                        <code
                          dir="ltr"
                          className="mt-1 block text-center text-xs font-black tracking-[0.12em] text-zinc-900"
                        >
                          {
                            secretClaim.couponCode
                          }
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {/* FREE SHIPPING */}

                {secretClaim?.reward
                  ?.type ===
                  "freeShipping" && (
                  <div className="rounded-2xl border border-[#39ff14]/20 bg-[#39ff14]/5 px-4 py-3">
                    <p className="text-xs font-black text-[#16a34a]">
                      🎉 تم تفعيل الشحن المجاني
                    </p>

                    {secretClaim?.couponCode && (
                      <p className="mt-1 text-[10px] font-bold text-zinc-500">
                        كود المكافأة:{" "}
                        {
                          secretClaim.couponCode
                        }
                      </p>
                    )}
                  </div>
                )}

                {/* GIFT */}

                {(secretClaim?.reward
                  ?.type ===
                  "giftTshirt" ||
                  secretClaim?.reward
                    ?.type ===
                    "giftProduct") && (
                  <div className="rounded-2xl border border-[#39ff14]/20 bg-[#39ff14]/5 px-4 py-3">
                    <p className="text-xs font-black text-[#16a34a]">
                      🎁 المكافأة:{" "}
                      {getRewardLabel(
                        secretClaim
                      )}
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-zinc-500">
                      المكافأة هتتسجل مع الطلب عشان تظهر للأدمن أثناء التجهيز.
                    </p>
                  </div>
                )}
              </div>

              <div className="my-5 h-px bg-zinc-100" />

              {/* FINAL TOTAL */}

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-lg font-black">
                    الإجمالي
                  </span>

                  {calculatedTotals.discount >
                    0 && (
                    <p className="mt-1 text-[10px] font-bold text-zinc-400">
                      بعد تطبيق المكافأة
                    </p>
                  )}
                </div>

                <span className="text-2xl font-black">
                  {formatCurrency(
                    calculatedTotals.finalTotal
                  )}{" "}
                  جنيه
                </span>
              </div>

              {form.governorate &&
                calculatedTotals.originalTotal !==
                  calculatedTotals.finalTotal && (
                  <p className="mt-2 text-right text-xs text-zinc-400 line-through">
                    {formatCurrency(
                      calculatedTotals.originalTotal
                    )}{" "}
                    جنيه
                  </p>
                )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  Boolean(
                    phoneError
                  ) ||
                  loadingShipping ||
                  shippingRates.length ===
                    0 ||
                  !form.governorate
                }
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#39ff14] font-black text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(57,255,20,0.18)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />

                    جاري تسجيل الطلب...
                  </>
                ) : (
                  <>
                    <LockKeyhole
                      size={18}
                    />

                    تأكيد الطلب
                  </>
                )}
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

              {!loadingSecretClaim &&
                secretClaim && (
                  <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                    <p className="text-center text-[10px] leading-6 text-zinc-500">
                      مكافأة المفتاح الخفي متاحة
                      لهذا الطلب فقط، وبعد نجاح
                      الطلب لن يمكن استخدامها مرة
                      أخرى على نفس الجهاز.
                    </p>
                  </div>
                )}
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
