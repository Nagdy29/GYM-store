import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  ClipboardList,
  Loader2,
  Package,
  RefreshCw,
  Trash2,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import {
  deleteOrderFromFirebase,
  getOrderStatusLabel,
  getOrdersFromFirebase,
  ORDER_STATUSES,
  updateOrderStatusInFirebase,
} from "../firebase/orders";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString(
    "ar-EG"
  )} جنيه`;
}

function formatDate(value) {
  if (!value) {
    return "بدون تاريخ";
  }

  try {
    const date =
      typeof value?.toDate === "function"
        ? value.toDate()
        : new Date(value);

    return date.toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "بدون تاريخ";
  }
}

function getStatusClasses(status) {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-purple-100 text-purple-700";

    case "shipped":
      return "bg-orange-100 text-orange-700";

    case "delivered":
      return "bg-[#39ff14]/20 text-[#15803d]";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] =
    useState(null);
  const [deletingId, setDeletingId] =
    useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getOrdersFromFirebase();

      setOrders(data);
    } catch (firebaseError) {
      console.error(
        "Admin Orders Firebase Error:",
        firebaseError
      );

      setError(
        "مش قادرين نحمل الطلبات من Firebase حاليًا."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);

      await updateOrderStatusInFirebase(
        orderId,
        status
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (firebaseError) {
      console.error(
        "Update Order Status Error:",
        firebaseError
      );

      window.alert(
        "حصل خطأ أثناء تحديث حالة الطلب."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف الطلب؟ العملية دي لا يمكن التراجع عنها."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(orderId);

      await deleteOrderFromFirebase(
        orderId
      );

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );
    } catch (firebaseError) {
      console.error(
        "Delete Order Error:",
        firebaseError
      );

      window.alert(
        "حصل خطأ أثناء حذف الطلب."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div>
          <span className="text-xs font-black text-[#16a34a]">
            ADMIN / ORDERS
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            الطلبات
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            متابعة وإدارة طلبات العملاء.
          </p>
        </div>

        <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-3xl border border-zinc-200 bg-white">
          <div className="text-center">
            <Loader2
              size={35}
              className="mx-auto animate-spin text-[#16a34a]"
            />

            <p className="mt-4 text-sm font-bold text-zinc-500">
              جاري تحميل الطلبات...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-black text-[#16a34a]">
            ADMIN / ORDERS
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            الطلبات
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            متابعة وإدارة طلبات العملاء من Firebase.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={17} />
          تحديث
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-red-700">
                حصل خطأ
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={loadOrders}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white"
            >
              حاول تاني
            </button>
          </div>
        </div>
      )}

      {/* COUNT */}
      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-[#39ff14]">
          <ClipboardList size={20} />
        </div>

        <div>
          <p className="text-xs text-zinc-400">
            إجمالي الطلبات
          </p>

          <p className="text-xl font-black">
            {orders.length}
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {orders.length === 0 && !error ? (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <ClipboardList
            size={45}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-5 text-xl font-black">
            مفيش طلبات حاليًا
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            أول ما عميل يعمل طلب، هيظهر هنا تلقائيًا.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {orders.map((order) => {
            const status =
              order.status || "pending";

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
              >
                {/* TOP */}
                <div className="border-b border-zinc-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold text-zinc-400">
                          رقم الطلب
                        </span>

                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black">
                          {order.orderNumber ||
                            order.id}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                        <ClipboardList
                          size={14}
                        />
                        {formatDate(
                          order.createdAt
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-2 text-[10px] font-black ${getStatusClasses(
                          status
                        )}`}
                      >
                        {getOrderStatusLabel(
                          status
                        )}
                      </span>

                      <span className="rounded-full bg-black px-4 py-2 text-xs font-black text-[#39ff14]">
                        {formatPrice(
                          order.total
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER */}
                <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <User size={15} />

                      <p className="text-[10px]">
                        العميل
                      </p>
                    </div>

                    <p className="mt-2 text-sm font-black">
                      {order.customer?.name ||
                        "غير محدد"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-[10px] text-zinc-400">
                      الهاتف
                    </p>

                    <p
                      dir="ltr"
                      className="mt-2 text-right text-sm font-black"
                    >
                      {order.customer?.phone ||
                        "غير محدد"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-[10px] text-zinc-400">
                      المحافظة
                    </p>

                    <p className="mt-2 text-sm font-black">
                      {order.customer?.governorate ||
                        "غير محدد"}
                    </p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="px-5 pb-5 sm:px-6">
                  <div className="rounded-2xl border border-zinc-100 bg-white p-4">
                    <p className="text-[10px] font-bold text-zinc-400">
                      العنوان
                    </p>

                    <p className="mt-2 text-sm font-bold text-zinc-700">
                      {order.customer?.address ||
                        "غير محدد"}
                    </p>

                    {order.customer?.notes && (
                      <>
                        <p className="mt-4 text-[10px] font-bold text-zinc-400">
                          ملاحظات العميل
                        </p>

                        <p className="mt-2 text-sm text-zinc-600">
                          {order.customer.notes}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* ITEMS */}
                <div className="px-5 pb-5 sm:px-6">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <Package size={17} />

                      <h3 className="text-sm font-black">
                        المنتجات
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {Array.isArray(
                        order.items
                      ) &&
                        order.items.map(
                          (item, index) => (
                            <div
                              key={`${item.id}-${index}`}
                              className="flex items-center gap-3 rounded-xl bg-white p-3"
                            >
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={
                                      item.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-zinc-300">
                                    <Package
                                      size={18}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-black">
                                  {item.name}
                                </p>

                                <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-zinc-400">
                                  <span>
                                    الكمية:{" "}
                                    {item.quantity ||
                                      1}
                                  </span>

                                  {item.size && (
                                    <span>
                                      المقاس:{" "}
                                      {item.size}
                                    </span>
                                  )}

                                  {item.color && (
                                    <span>
                                      اللون:{" "}
                                      {item.color}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="shrink-0 text-xs font-black">
                                {formatPrice(
                                  Number(
                                    item.price
                                  ) *
                                    Number(
                                      item.quantity ||
                                        1
                                    )
                                )}
                              </span>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>

                {/* SUMMARY */}
                <div className="grid gap-3 border-t border-zinc-100 p-5 sm:grid-cols-3 sm:p-6">
                  <div>
                    <p className="text-[10px] text-zinc-400">
                      المنتجات
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {formatPrice(
                        order.subtotal
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-zinc-400">
                      الشحن
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {Number(
                        order.shipping
                      ) === 0
                        ? "مجاني"
                        : formatPrice(
                            order.shipping
                          )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-zinc-400">
                      الإجمالي
                    </p>

                    <p className="mt-1 text-lg font-black text-[#16a34a]">
                      {formatPrice(
                        order.total
                      )}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                    {status === "delivered" ? (
                      <CheckCircle2
                        size={16}
                        className="text-[#16a34a]"
                      />
                    ) : status ===
                      "cancelled" ? (
                      <XCircle
                        size={16}
                        className="text-red-500"
                      />
                    ) : (
                      <Truck
                        size={16}
                        className="text-zinc-500"
                      />
                    )}

                    الدفع عند الاستلام
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={status}
                      disabled={
                        updatingId === order.id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-black outline-none focus:border-[#16a34a]"
                    >
                      {ORDER_STATUSES.map(
                        (item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label}
                          </option>
                        )
                      )}
                    </select>

                    {updatingId ===
                      order.id && (
                      <div className="flex items-center justify-center rounded-xl bg-white px-4">
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={
                        deletingId === order.id
                      }
                      onClick={() =>
                        handleDelete(order.id)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-black text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId ===
                      order.id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}

                      حذف الطلب
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;