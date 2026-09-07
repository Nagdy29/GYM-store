import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LoaderCircle,
  MessageSquare,
  PackageCheck,
  RefreshCw,
  ShoppingCart,
  Truck,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getProductsFromFirebase,
} from "../firebase/products";

import {
  getOrdersFromFirebase,
} from "../firebase/orders";

function formatPrice(price) {
  return `${Number(
    price || 0
  ).toLocaleString(
    "ar-EG"
  )} جنيه`;
}

function AdminDashboard() {
  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            firebaseProducts,
            firebaseOrders,
          ] =
            await Promise.all([
              getProductsFromFirebase(),
              getOrdersFromFirebase(),
            ]);

          setProducts(
            Array.isArray(
              firebaseProducts
            )
              ? firebaseProducts
              : []
          );

          setOrders(
            Array.isArray(
              firebaseOrders
            )
              ? firebaseOrders
              : []
          );
        } catch (firebaseError) {
          console.error(
            "Dashboard Firebase Error:",
            firebaseError
          );

          setError(
            "حصل خطأ أثناء تحميل بيانات لوحة التحكم من Firebase."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pendingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            !order.status ||
            order.status ===
              "pending"
        ).length,
      [orders]
    );

  const confirmedOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "confirmed"
        ).length,
      [orders]
    );

  const processingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "processing"
        ).length,
      [orders]
    );

  const shippedOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "shipped"
        ).length,
      [orders]
    );

  const deliveredOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "delivered"
        ).length,
      [orders]
    );

  const cancelledOrders =
    useMemo(
      () =>
        orders.filter(
          (order) =>
            order.status ===
            "cancelled"
        ).length,
      [orders]
    );

  const totalSales =
    useMemo(
      () =>
        orders
          .filter(
            (order) =>
              order.status !==
              "cancelled"
          )
          .reduce(
            (
              total,
              order
            ) =>
              total +
              Number(
                order.total ||
                  0
              ),
            0
          ),
      [orders]
    );

  const lowStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            Number(
              product.stock ||
                0
            ) <= 5
        ).length,
      [products]
    );

  const outOfStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            Number(
              product.stock ||
                0
            ) <= 0
        ).length,
      [products]
    );

  const stats = [
    {
      title:
        "إجمالي المنتجات",
      value:
        products.length,
      icon: Boxes,
    },
    {
      title:
        "إجمالي الطلبات",
      value:
        orders.length,
      icon: ClipboardList,
    },
    {
      title:
        "طلبات قيد المراجعة",
      value:
        pendingOrders,
      icon: Clock3,
    },
    {
      title:
        "إجمالي المبيعات",
      value:
        formatPrice(
          totalSales
        ),
      icon: ShoppingCart,
    },
  ];

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-black text-[#16a34a]">
            ZENGER ADMIN
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            لوحة التحكم
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            أهلاً بيك في لوحة إدارة متجر
            ZENGER. البيانات متصلة بـ Firebase.
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadDashboard
          }
          disabled={
            loading
          }
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-black transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          تحديث البيانات
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3 text-sm font-bold text-red-700">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p>
                حصل خطأ
              </p>

              <p className="mt-1 text-xs font-medium leading-6 text-red-600">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              loadDashboard
            }
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white transition hover:bg-red-700"
          >
            حاول تاني
          </button>
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-16 text-center">
          <LoaderCircle
            size={35}
            className="mx-auto animate-spin text-[#16a34a]"
          />

          <p className="mt-4 text-sm font-black">
            جاري تحميل بيانات المتجر...
          </p>

          <p className="mt-2 text-xs text-zinc-400">
            بنجيب المنتجات والطلبات من Firebase.
          </p>
        </div>
      ) : (
        <>
          {/* STATS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(
              (stat) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={
                      stat.title
                    }
                    className="rounded-3xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
                        <Icon
                          size={21}
                        />
                      </div>

                      <TrendingUp
                        size={18}
                        className="text-[#16a34a]"
                      />
                    </div>

                    <p className="mt-6 text-xs font-bold text-zinc-400">
                      {
                        stat.title
                      }
                    </p>

                    <p className="mt-1 text-2xl font-black sm:text-3xl">
                      {
                        stat.value
                      }
                    </p>
                  </div>
                );
              }
            )}
          </div>

          {/* ORDER STATUS */}

          <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  حالة الطلبات
                </h2>

                <p className="mt-1 text-xs text-zinc-400">
                  متابعة سريعة لحالة كل الطلبات.
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 text-xs font-black text-[#16a34a]"
              >
                إدارة الطلبات
                <ArrowLeft
                  size={15}
                />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl bg-yellow-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Clock3
                    size={18}
                    className="text-yellow-600"
                  />

                  <span className="text-2xl font-black text-yellow-700">
                    {
                      pendingOrders
                    }
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold text-yellow-800">
                  قيد المراجعة
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="text-2xl font-black text-blue-700">
                    {
                      confirmedOrders
                    }
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold text-blue-800">
                  تم التأكيد
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <PackageCheck
                    size={18}
                    className="text-purple-600"
                  />

                  <span className="text-2xl font-black text-purple-700">
                    {
                      processingOrders
                    }
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold text-purple-800">
                  جاري التجهيز
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Truck
                    size={18}
                    className="text-orange-600"
                  />

                  <span className="text-2xl font-black text-orange-700">
                    {
                      shippedOrders
                    }
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold text-orange-800">
                  تم الشحن
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />

                  <span className="text-2xl font-black text-green-700">
                    {
                      deliveredOrders
                    }
                  </span>
                </div>

                <p className="mt-3 text-xs font-bold text-green-800">
                  تم التسليم
                </p>
              </div>
            </div>

            {cancelledOrders >
              0 && (
              <div className="mt-4 rounded-2xl bg-red-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700">
                    الطلبات الملغية
                  </span>

                  <span className="font-black text-red-700">
                    {
                      cancelledOrders
                    }
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* INVENTORY */}

          <section className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
                  <Boxes
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="font-black">
                    حالة المخزون
                  </h2>

                  <p className="text-xs text-zinc-400">
                    متابعة المنتجات اللي محتاجة انتباه.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-yellow-50 p-5">
                  <p className="text-xs text-yellow-700">
                    مخزون قليل
                  </p>

                  <p className="mt-2 text-3xl font-black text-yellow-800">
                    {
                      lowStockProducts
                    }
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-yellow-700">
                    5 قطع أو أقل.
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 p-5">
                  <p className="text-xs text-red-600">
                    نفد المخزون
                  </p>

                  <p className="mt-2 text-3xl font-black text-red-700">
                    {
                      outOfStockProducts
                    }
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-red-600">
                    المنتجات اللي رصيدها صفر.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/products"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#16a34a]"
              >
                إدارة المنتجات
                <ArrowLeft
                  size={15}
                />
              </Link>
            </div>

            {/* SALES */}

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
                  <ShoppingCart
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="font-black">
                    المبيعات
                  </h2>

                  <p className="text-xs text-zinc-400">
                    إجمالي الطلبات غير الملغية.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-4xl font-black">
                {
                  formatPrice(
                    totalSales
                  )
                }
              </p>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-zinc-50 p-4">
                <span className="text-xs text-zinc-500">
                  إجمالي الطلبات
                </span>

                <span className="font-black">
                  {
                    orders.length
                  }
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-zinc-50 p-4">
                <span className="text-xs text-zinc-500">
                  الطلبات المسلمة
                </span>

                <span className="font-black">
                  {
                    deliveredOrders
                  }
                </span>
              </div>

              <Link
                to="/admin/orders"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#16a34a]"
              >
                مشاهدة الطلبات
                <ArrowLeft
                  size={15}
                />
              </Link>
            </div>
          </section>

          {/* QUICK ACTIONS */}

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black">
                  الوصول السريع
                </h2>

                <p className="mt-1 text-xs text-zinc-400">
                  روح لأي جزء من لوحة التحكم بسرعة.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/admin/products"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
              >
                <Boxes
                  size={25}
                />

                <h3 className="mt-5 font-black">
                  إدارة المنتجات
                </h3>

                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  إضافة وتعديل وحذف المنتجات من Firebase.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#16a34a]">
                  فتح الصفحة

                  <ArrowLeft
                    size={15}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </span>
              </Link>

              <Link
                to="/admin/orders"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
              >
                <ClipboardList
                  size={25}
                />

                <h3 className="mt-5 font-black">
                  إدارة الطلبات
                </h3>

                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  متابعة الطلبات وتغيير حالتها لحظيًا.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#16a34a]">
                  فتح الصفحة

                  <ArrowLeft
                    size={15}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </span>
              </Link>

              <Link
                to="/admin/reviews"
                className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
              >
                <MessageSquare
                  size={25}
                />

                <h3 className="mt-5 font-black">
                  التقييمات
                </h3>

                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  متابعة تقييمات العملاء وإدارتها.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#16a34a]">
                  فتح الصفحة

                  <ArrowLeft
                    size={15}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </span>
              </Link>
            </div>
          </section>

          {/* FIREBASE STATUS */}

          <section className="mt-8 overflow-hidden rounded-3xl bg-black p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/20 bg-[#39ff14]/10 px-3 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#39ff14]" />

                  <span className="text-[10px] font-black text-[#39ff14]">
                    FIREBASE CONNECTED
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black">
                  المتجر مربوط بقاعدة البيانات 🔥
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                  المنتجات والطلبات بيتم التعامل معاها من
                  Firebase Firestore، والطلبات الجديدة بتظهر
                  مباشرة في لوحة الإدارة.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={22}
                    className="text-[#39ff14]"
                  />

                  <div>
                    <p className="text-xs font-black">
                      النظام يعمل
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-500">
                      Firebase Firestore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;