import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Gift,
  KeyRound,
  Lock,
  LoaderCircle,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getProductsFromFirebase } from "../firebase/products";
import { getOrdersFromFirebase } from "../firebase/orders";
import { getSecretChallenges } from "../firebase/secretChallenges";

// Brand accent — kept as the single green already used across the app,
// dialed back from the neon (#39ff14) version for the dark panels.
const ACCENT = "#16a34a";
const ACCENT_SOFT = "#22c55e";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("ar-EG")} جنيه`;
}

function getRewardLabel(challenge) {
  const reward = challenge?.reward;
  if (!reward) return "جائزة غير محددة";

  switch (reward.type) {
    case "percentage":
      return `خصم ${reward.value}%`;
    case "amount":
      return `خصم ${Number(reward.value || 0).toLocaleString("ar-EG")} جنيه`;
    case "freeShipping":
      return "شحن مجاني";
    case "giftTshirt":
      return "تيشيرت هدية";
    case "giftProduct":
      return reward.productName || "منتج هدية";
    default:
      return "جائزة";
  }
}

function isChallengeActive(challenge) {
  if (!challenge?.active) return false;

  const now = new Date();

  if (challenge.startAt) {
    const start = new Date(challenge.startAt);
    if (!Number.isNaN(start.getTime()) && now < start) return false;
  }

  if (challenge.endAt) {
    const end = new Date(challenge.endAt);
    if (!Number.isNaN(end.getTime()) && now > end) return false;
  }

  return true;
}

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [secretChallenges, setSecretChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [firebaseProducts, firebaseOrders, firebaseSecretChallenges] =
        await Promise.all([
          getProductsFromFirebase(),
          getOrdersFromFirebase(),
          getSecretChallenges(),
        ]);

      setProducts(Array.isArray(firebaseProducts) ? firebaseProducts : []);
      setOrders(Array.isArray(firebaseOrders) ? firebaseOrders : []);
      setSecretChallenges(
        Array.isArray(firebaseSecretChallenges) ? firebaseSecretChallenges : []
      );
    } catch (firebaseError) {
      console.error("Dashboard Firebase Error:", firebaseError);
      setError("حصل خطأ أثناء تحميل بيانات لوحة التحكم من Firebase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pendingOrders = useMemo(
    () => orders.filter((o) => !o.status || o.status === "pending").length,
    [orders]
  );
  const confirmedOrders = useMemo(
    () => orders.filter((o) => o.status === "confirmed").length,
    [orders]
  );
  const processingOrders = useMemo(
    () => orders.filter((o) => o.status === "processing").length,
    [orders]
  );
  const shippedOrders = useMemo(
    () => orders.filter((o) => o.status === "shipped").length,
    [orders]
  );
  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === "delivered").length,
    [orders]
  );
  const cancelledOrders = useMemo(
    () => orders.filter((o) => o.status === "cancelled").length,
    [orders]
  );

  const totalSales = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce((total, o) => total + Number(o.total || 0), 0),
    [orders]
  );

  const lowStockProducts = useMemo(
    () => products.filter((p) => Number(p.stock || 0) <= 5).length,
    [products]
  );
  const outOfStockProducts = useMemo(
    () => products.filter((p) => Number(p.stock || 0) <= 0).length,
    [products]
  );

  const activeSecretChallenge = useMemo(
    () => secretChallenges.find((c) => isChallengeActive(c)) || null,
    [secretChallenges]
  );
  const activeSecretChallengesCount = useMemo(
    () => secretChallenges.filter((c) => isChallengeActive(c)).length,
    [secretChallenges]
  );
  const secretHintsCount = Array.isArray(activeSecretChallenge?.hints)
    ? activeSecretChallenge.hints.length
    : 0;

  const stats = [
    { title: "إجمالي المنتجات", value: products.length, icon: Boxes },
    { title: "إجمالي الطلبات", value: orders.length, icon: ClipboardList },
    { title: "طلبات قيد المراجعة", value: pendingOrders, icon: Clock3 },
    { title: "إجمالي المبيعات", value: formatPrice(totalSales), icon: ShoppingCart },
  ];

  // Order status rows — one calm style, one accent colour per status
  // instead of solid pastel tiles.
  const orderStatuses = [
    {
      key: "pending",
      label: "قيد المراجعة",
      value: pendingOrders,
      icon: Clock3,
      dot: "bg-amber-500",
      value_cls: "text-amber-700",
      ring: "bg-amber-50",
    },
    {
      key: "confirmed",
      label: "تم التأكيد",
      value: confirmedOrders,
      icon: CheckCircle2,
      dot: "bg-sky-500",
      value_cls: "text-sky-700",
      ring: "bg-sky-50",
    },
    {
      key: "processing",
      label: "جاري التجهيز",
      value: processingOrders,
      icon: PackageCheck,
      dot: "bg-violet-500",
      value_cls: "text-violet-700",
      ring: "bg-violet-50",
    },
    {
      key: "shipped",
      label: "تم الشحن",
      value: shippedOrders,
      icon: Truck,
      dot: "bg-orange-500",
      value_cls: "text-orange-700",
      ring: "bg-orange-50",
    },
    {
      key: "delivered",
      label: "تم التسليم",
      value: deliveredOrders,
      icon: CheckCircle2,
      dot: "bg-emerald-500",
      value_cls: "text-emerald-700",
      ring: "bg-emerald-50",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold text-[#16a34a]">HIRAQL ADMIN</span>
          <h1 className="mt-2 text-3xl font-black text-zinc-900 sm:text-4xl">
            لوحة التحكم
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            أهلاً بيك في لوحة إدارة متجر HIRAQL. البيانات متصلة بـ Firebase.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          تحديث البيانات
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3 text-sm font-bold text-red-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p>حصل خطأ</p>
              <p className="mt-1 text-xs font-medium leading-6 text-red-600">
                {error}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
          >
            حاول تاني
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-16 text-center">
          <LoaderCircle size={32} className="mx-auto animate-spin text-[#16a34a]" />
          <p className="mt-4 text-sm font-bold text-zinc-800">
            جاري تحميل بيانات المتجر...
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            بنجيب المنتجات والطلبات وتحديات المفتاح الخفي من Firebase.
          </p>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#16a34a]">
                    <Icon size={19} />
                  </div>
                  <p className="mt-5 text-xs font-medium text-zinc-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 sm:text-[26px]">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* SECRET CHALLENGE — the one deliberately bold section on the page */}
          <section className="mt-8 overflow-hidden rounded-[1.75rem] bg-[#12141a] text-white">
            <div className="relative p-6 sm:p-8">
              <div
                className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full blur-3xl"
                style={{ backgroundColor: `${ACCENT_SOFT}14` }}
              />

              <div className="relative">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                      style={{
                        borderColor: `${ACCENT_SOFT}33`,
                        backgroundColor: `${ACCENT_SOFT}14`,
                      }}
                    >
                      <KeyRound size={13} style={{ color: ACCENT_SOFT }} />
                      <span
                        className="text-[10px] font-bold tracking-wide"
                        style={{ color: ACCENT_SOFT }}
                      >
                        HIRAQL SECRET
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                      المفتاح الخفي
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                      إدارة التحدي السري اللي العملاء بيحاولوا يحلوه مقابل جائزة.
                    </p>
                  </div>

                  <Link
                    to="/admin/secret"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-black transition hover:opacity-90"
                    style={{ backgroundColor: ACCENT_SOFT }}
                  >
                    إدارة المفتاح الخفي
                    <ArrowLeft size={15} />
                  </Link>
                </div>

                {activeSecretChallenge ? (
                  <div className="mt-8 grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-zinc-500">
                          التحدي الحالي
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold"
                          style={{
                            backgroundColor: `${ACCENT_SOFT}1a`,
                            color: ACCENT_SOFT,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 animate-pulse rounded-full"
                            style={{ backgroundColor: ACCENT_SOFT }}
                          />
                          فعال الآن
                        </span>
                      </div>
                      <h3 className="mt-4 truncate text-lg font-bold">
                        {activeSecretChallenge.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-500">
                        {activeSecretChallenge.description || "فيه تحدي شغال حاليًا."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-zinc-500">
                          الهنتات
                        </span>
                        <Sparkles size={16} style={{ color: ACCENT_SOFT }} />
                      </div>
                      <p className="mt-4 text-3xl font-black">{secretHintsCount}</p>
                      <p className="mt-1 text-[10px] text-zinc-600">هنت متاح</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-zinc-500">
                          الجائزة
                        </span>
                        <Gift size={16} style={{ color: ACCENT_SOFT }} />
                      </div>
                      <p className="mt-4 truncate text-base font-bold">
                        {getRewardLabel(activeSecretChallenge)}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">للعميل الفائز</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-zinc-500">
                          إجمالي التحديات
                        </span>
                        <KeyRound size={16} style={{ color: ACCENT_SOFT }} />
                      </div>
                      <p className="mt-4 text-3xl font-black">
                        {secretChallenges.length}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        {activeSecretChallengesCount} فعال حاليًا
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col gap-5 rounded-xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-zinc-400">
                        <Lock size={19} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">مفيش تحدي فعال دلوقتي</p>
                        <p className="mt-1 text-xs leading-6 text-zinc-500">
                          عندك{" "}
                          <span className="font-bold text-white">
                            {secretChallenges.length}
                          </span>{" "}
                          تحديات محفوظة في Firebase، لكن مفيش تحدي شغال حاليًا.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/secret"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold transition hover:bg-white/10"
                    >
                      إنشاء تحدي
                      <Sparkles size={14} style={{ color: ACCENT_SOFT }} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ORDER STATUS */}
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">حالة الطلبات</h2>
                <p className="mt-1 text-xs text-zinc-400">
                  متابعة سريعة لحالة كل الطلبات.
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a]"
              >
                إدارة الطلبات
                <ArrowLeft size={14} />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {orderStatuses.map((status) => {
                const Icon = status.icon;
                return (
                  <div
                    key={status.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${status.ring}`}
                      >
                        <Icon size={15} className={status.value_cls} />
                      </span>
                      <span className="text-xs font-medium text-zinc-600">
                        {status.label}
                      </span>
                    </div>
                    <span className={`text-lg font-bold ${status.value_cls}`}>
                      {status.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {cancelledOrders > 0 && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-red-100 bg-red-50/60 p-4">
                <span className="text-xs font-medium text-red-700">
                  الطلبات الملغية
                </span>
                <span className="font-bold text-red-700">{cancelledOrders}</span>
              </div>
            )}
          </section>

          {/* INVENTORY + SALES */}
          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#16a34a]">
                  <Boxes size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">حالة المخزون</h2>
                  <p className="text-xs text-zinc-400">
                    متابعة المنتجات اللي محتاجة انتباه.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs text-zinc-500">مخزون قليل</p>
                  <p className="mt-2 text-2xl font-bold text-amber-700">
                    {lowStockProducts}
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-zinc-400">
                    5 قطع أو أقل.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs text-zinc-500">نفد المخزون</p>
                  <p className="mt-2 text-2xl font-bold text-red-700">
                    {outOfStockProducts}
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-zinc-400">
                    المنتجات اللي رصيدها صفر.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/products"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a]"
              >
                إدارة المنتجات
                <ArrowLeft size={14} />
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#16a34a]">
                  <ShoppingCart size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">المبيعات</h2>
                  <p className="text-xs text-zinc-400">
                    إجمالي الطلبات غير الملغية.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-3xl font-black text-zinc-900">
                {formatPrice(totalSales)}
              </p>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-zinc-50 p-4">
                <span className="text-xs text-zinc-500">إجمالي الطلبات</span>
                <span className="font-bold text-zinc-900">{orders.length}</span>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-50 p-4">
                <span className="text-xs text-zinc-500">الطلبات المسلمة</span>
                <span className="font-bold text-zinc-900">{deliveredOrders}</span>
              </div>

              <Link
                to="/admin/orders"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a]"
              >
                مشاهدة الطلبات
                <ArrowLeft size={14} />
              </Link>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-zinc-900">الوصول السريع</h2>
              <p className="mt-1 text-xs text-zinc-400">
                روح لأي جزء من لوحة التحكم بسرعة.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Link
                to="/admin/products"
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <Boxes size={22} className="text-zinc-700" />
                <h3 className="mt-5 text-sm font-bold text-zinc-900">
                  إدارة المنتجات
                </h3>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  إضافة وتعديل وحذف المنتجات من Firebase.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a]">
                  فتح الصفحة
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </span>
              </Link>

              <Link
                to="/admin/orders"
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <ClipboardList size={22} className="text-zinc-700" />
                <h3 className="mt-5 text-sm font-bold text-zinc-900">
                  إدارة الطلبات
                </h3>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  متابعة الطلبات وتغيير حالتها لحظيًا.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a]">
                  فتح الصفحة
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </span>
              </Link>

              <Link
                to="/admin/reviews"
                className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <MessageSquare size={22} className="text-zinc-700" />
                <h3 className="mt-5 text-sm font-bold text-zinc-900">التقييمات</h3>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  متابعة تقييمات العملاء وإدارتها.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a]">
                  فتح الصفحة
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </span>
              </Link>

              <Link
                to="/admin/secret"
                className="group rounded-2xl border border-zinc-800 bg-[#12141a] p-6 text-white transition hover:border-zinc-700"
              >
                <KeyRound size={22} style={{ color: ACCENT_SOFT }} />
                <h3 className="mt-5 text-sm font-bold">المفتاح الخفي</h3>
                <p className="mt-2 text-xs leading-6 text-zinc-400">
                  إنشاء وإدارة التحديات والهنتات والجوائز.
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold" style={{ color: ACCENT_SOFT }}>
                    {activeSecretChallenge ? "تحدي فعال الآن" : "لا يوجد تحدي فعال"}
                  </span>
                  <ArrowLeft
                    size={14}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </div>
              </Link>
            </div>
          </section>

          {/* FIREBASE STATUS — a quiet footer, not a competing hero */}
          <section className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
              <p className="text-xs font-medium text-zinc-500">
                المتجر مربوط بـ Firebase Firestore — المنتجات والطلبات وتحديات
                المفتاح الخفي بتتحدّث لحظيًا.
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold text-[#16a34a] sm:inline-flex">
              <CheckCircle2 size={14} />
              النظام يعمل
            </span>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;