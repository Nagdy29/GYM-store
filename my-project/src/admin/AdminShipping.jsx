import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  LoaderCircle,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import {
  addShippingRate,
  deleteShippingRate,
  getShippingRates,
  seedDefaultShippingRates,
  toggleShippingRate,
  updateShippingRate,
} from "../firebase/shipping";

const emptyForm = {
  name: "",
  shippingPrice: "",
  active: true,
};

function formatPrice(
  value
) {
  return `${Number(
    value || 0
  ).toLocaleString(
    "ar-EG"
  )} جنيه`;
}

function AdminShipping() {
  const [
    shippingRates,
    setShippingRates,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    seeding,
    setSeeding,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingRate,
    setEditingRate,
  ] = useState(null);

  const [
    deleteRate,
    setDeleteRate,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState(
    emptyForm
  );

  /*
  =========================================================
  LOAD
  =========================================================
  */

  const loadRates =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const rates =
            await getShippingRates();

          setShippingRates(
            Array.isArray(rates)
              ? rates
              : []
          );
        } catch (error) {
          console.error(
            "Shipping rates error:",
            error
          );

          setError(
            "حصل خطأ في تحميل أسعار الشحن من Firebase."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  /*
  =========================================================
  STATS
  =========================================================
  */

  const activeCount =
    useMemo(
      () =>
        shippingRates.filter(
          (item) =>
            item.active !==
            false
        ).length,
      [shippingRates]
    );

  const inactiveCount =
    shippingRates.length -
    activeCount;

  /*
  =========================================================
  OPEN ADD
  =========================================================
  */

  const openAdd = () => {
    setEditingRate(
      null
    );

    setDeleteRate(
      null
    );

    setForm({
      ...emptyForm,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /*
  =========================================================
  OPEN EDIT
  =========================================================
  */

  const openEdit = (
    rate
  ) => {
    setEditingRate(
      rate
    );

    setDeleteRate(
      null
    );

    setForm({
      name:
        rate.name || "",

      shippingPrice:
        rate.shippingPrice ??
        "",

      active:
        rate.active !==
        false,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /*
  =========================================================
  CLOSE MODAL
  =========================================================
  */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingRate(
      null
    );

    setForm({
      ...emptyForm,
    });

    setError("");
  };

  /*
  =========================================================
  SAVE
  =========================================================
  */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const name =
        form.name.trim();

      const price = Number(
        form.shippingPrice
      );

      if (!name) {
        setError(
          "اكتب اسم المحافظة."
        );
        return;
      }

      if (
        Number.isNaN(price) ||
        price < 0
      ) {
        setError(
          "اكتب سعر شحن صحيح."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        if (
          editingRate
        ) {
          await updateShippingRate(
            editingRate.id,
            {
              name,
              shippingPrice:
                price,
              active:
                form.active,
            }
          );

          setSuccess(
            "تم تعديل سعر الشحن بنجاح ✅"
          );
        } else {
          await addShippingRate(
            {
              name,
              shippingPrice:
                price,
              active:
                form.active,
            }
          );

          setSuccess(
            "تم إضافة المحافظة بنجاح ✅"
          );
        }

        await loadRates();

        setTimeout(() => {
          setShowModal(
            false
          );

          setEditingRate(
            null
          );

          setForm({
            ...emptyForm,
          });

          setSuccess("");
        }, 700);
      } catch (error) {
        console.error(
          "Save shipping rate error:",
          error
        );

        setError(
          error?.message ||
            "حصل خطأ أثناء حفظ سعر الشحن."
        );
      } finally {
        setSaving(false);
      }
    };

  /*
  =========================================================
  SEED
  =========================================================
  */

  const handleSeed =
    async () => {
      if (seeding) {
        return;
      }

      try {
        setSeeding(true);
        setError("");
        setSuccess("");

        const result =
          await seedDefaultShippingRates();

        await loadRates();

        if (
          result.addedCount ===
          0
        ) {
          setSuccess(
            "المحافظات الافتراضية موجودة بالفعل ✅"
          );
        } else {
          setSuccess(
            `تم إضافة ${result.addedCount} محافظة بأسعار مبدئية ✅`
          );
        }
      } catch (error) {
        console.error(
          "Seed shipping error:",
          error
        );

        setError(
          "حصل خطأ أثناء إضافة المحافظات الافتراضية."
        );
      } finally {
        setSeeding(false);
      }
    };

  /*
  =========================================================
  TOGGLE
  =========================================================
  */

  const handleToggle =
    async (rate) => {
      try {
        setError("");
        setSuccess("");

        await toggleShippingRate(
          rate.id,
          rate.active ===
            false
        );

        setShippingRates(
          (
            current
          ) =>
            current.map(
              (item) =>
                item.id ===
                rate.id
                  ? {
                      ...item,
                      active:
                        rate.active ===
                        false,
                    }
                  : item
            )
        );

        setSuccess(
          rate.active ===
            false
            ? "تم تفعيل المحافظة ✅"
            : "تم تعطيل المحافظة ✅"
        );
      } catch (error) {
        console.error(
          "Toggle shipping error:",
          error
        );

        setError(
          "حصل خطأ أثناء تغيير حالة المحافظة."
        );
      }
    };

  /*
  =========================================================
  DELETE
  =========================================================
  */

  const handleDelete =
    async () => {
      if (!deleteRate) {
        return;
      }

      try {
        setDeleting(true);
        setError("");
        setSuccess("");

        await deleteShippingRate(
          deleteRate.id
        );

        setShippingRates(
          (
            current
          ) =>
            current.filter(
              (item) =>
                item.id !==
                deleteRate.id
            )
        );

        setSuccess(
          "تم حذف المحافظة بنجاح 🗑️"
        );

        setDeleteRate(
          null
        );
      } catch (error) {
        console.error(
          "Delete shipping error:",
          error
        );

        setError(
          "حصل خطأ أثناء حذف المحافظة."
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
    <div dir="rtl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <span className="text-xs font-black text-[#16a34a]">
            ADMIN / SHIPPING
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            الشحن والمحافظات
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500">
            حدد سعر الشحن لكل محافظة، والعميل
            هيختار المحافظة في صفحة إتمام الطلب.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={
              loadRates
            }
            disabled={
              loading ||
              seeding
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            تحديث
          </button>

          <button
            type="button"
            onClick={
              openAdd
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            <Plus size={18} />

            إضافة محافظة
          </button>

        </div>
      </div>

      {/* ALERT */}

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-black text-green-700">
          <CheckCircle2
            size={19}
          />

          {success}
        </div>
      )}

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="mt-7 grid gap-4 sm:grid-cols-3">

        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
              <MapPin size={19} />
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                إجمالي المحافظات
              </p>

              <p className="mt-1 text-2xl font-black">
                {
                  shippingRates.length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                شحن مفعل
              </p>

              <p className="mt-1 text-2xl font-black">
                {activeCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
              <Truck size={19} />
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                محافظات متوقفة
              </p>

              <p className="mt-1 text-2xl font-black">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          DEFAULT DATA
      ====================================================== */}
{/* 
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#39ff14]/20 bg-black p-5 text-white sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
              <Truck size={21} />
            </div>

            <div>
              <h2 className="font-black">
                محافظات وأسعار مبدئية
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-6 text-zinc-400">
                ضيف المحافظات الافتراضية مرة واحدة،
                وبعدها عدّل الأسعار من الجدول على
                حسب أسعار الشحن الحقيقية عندك.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={
              handleSeed
            }
            disabled={
              seeding
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#39ff14] px-5 py-3 text-xs font-black text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {seeding ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />

                جاري تجهيز المحافظات...
              </>
            ) : (
              <>
                <Plus size={16} />

                إضافة المحافظات الافتراضية
              </>
            )}
          </button>

        </div>
      </div> */}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading ? (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-16 text-center">
          <LoaderCircle
            size={35}
            className="mx-auto animate-spin text-[#16a34a]"
          />

          <p className="mt-4 text-sm font-black">
            جاري تحميل أسعار الشحن...
          </p>
        </div>
      ) : shippingRates.length ===
        0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">

          <Truck
            size={38}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-5 text-xl font-black">
            مفيش أسعار شحن لسه
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-zinc-500">
            اضغط على إضافة المحافظات الافتراضية
            عشان نجهزلك المحافظات والأسعار
            المبدئية.
          </p>

          <button
            type="button"
            onClick={
              handleSeed
            }
            disabled={
              seeding
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#39ff14] px-5 py-3 text-sm font-black text-black"
          >
            {seeding ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Plus size={17} />
            )}

            إضافة المحافظات
          </button>

        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">

          {/* DESKTOP */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[760px] text-right">

              <thead className="bg-zinc-50">

                <tr>
                  <th className="px-5 py-4 text-xs font-black">
                    المحافظة
                  </th>

                  <th className="px-5 py-4 text-xs font-black">
                    سعر الشحن
                  </th>

                  <th className="px-5 py-4 text-xs font-black">
                    الحالة
                  </th>

                  <th className="px-5 py-4 text-xs font-black">
                    الإجراءات
                  </th>
                </tr>

              </thead>

              <tbody>

                {shippingRates.map(
                  (rate) => (
                    <tr
                      key={
                        rate.id
                      }
                      className="border-t border-zinc-100 transition hover:bg-zinc-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#39ff14]">
                            <MapPin size={17} />
                          </div>

                          <span className="text-sm font-black">
                            {
                              rate.name
                            }
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="text-sm font-black">
                          {formatPrice(
                            rate.shippingPrice
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleToggle(
                              rate
                            )
                          }
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-[10px]
                            font-black
                            transition
                            ${
                              rate.active !==
                              false
                                ? "bg-[#39ff14]/15 text-[#16a34a]"
                                : "bg-zinc-100 text-zinc-500"
                            }
                          `}
                        >
                          {rate.active !==
                          false
                            ? "مفعل"
                            : "متوقف"}
                        </button>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                rate
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-black transition hover:bg-black hover:text-white"
                          >
                            <Edit3 size={14} />
                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteRate(
                                rate
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                            aria-label="حذف المحافظة"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>
            </table>

          </div>

          {/* MOBILE */}

          <div className="grid gap-3 p-4 md:hidden">

            {shippingRates.map(
              (rate) => (
                <div
                  key={
                    rate.id
                  }
                  className="rounded-2xl border border-zinc-200 p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-[#39ff14]">
                      <MapPin size={17} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <h3 className="font-black">
                            {
                              rate.name
                            }
                          </h3>

                          <p className="mt-1 text-xs text-zinc-400">
                            سعر الشحن:{" "}
                            <span className="font-black text-zinc-800">
                              {formatPrice(
                                rate.shippingPrice
                              )}
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggle(
                              rate
                            )
                          }
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-[9px]
                            font-black
                            ${
                              rate.active !==
                              false
                                ? "bg-[#39ff14]/15 text-[#16a34a]"
                                : "bg-zinc-100 text-zinc-500"
                            }
                          `}
                        >
                          {rate.active !==
                          false
                            ? "مفعل"
                            : "متوقف"}
                        </button>

                      </div>

                      <div className="mt-4 flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(
                              rate
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5 text-xs font-black transition hover:bg-black hover:text-white"
                        >
                          <Edit3 size={14} />
                          تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteRate(
                              rate
                            )
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </div>
                  </div>

                </div>
              )
            )}

          </div>

        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-100 p-5">

              <div>
                <h2 className="text-xl font-black">
                  {editingRate
                    ? "تعديل المحافظة"
                    : "إضافة محافظة"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  حدد اسم المحافظة وسعر الشحن.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-black"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5"
            >

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold leading-6 text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-black">
                  اسم المحافظة
                </label>

                <input
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        name:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  placeholder="مثال: القاهرة"
                  className="h-13 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-bold outline-none transition focus:border-black focus:bg-white"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-black">
                  سعر الشحن
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="0"
                    value={
                      form.shippingPrice
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          shippingPrice:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="60"
                    className="h-13 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 pl-20 text-sm font-bold outline-none transition focus:border-black focus:bg-white"
                  />

                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-400">
                    جنيه
                  </span>

                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl bg-zinc-50 p-4">

                <input
                  type="checkbox"
                  checked={
                    form.active
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,
                        active:
                          event
                            .target
                            .checked,
                      })
                    )
                  }
                  className="h-4 w-4 accent-[#39ff14]"
                />

                <div>
                  <p className="text-sm font-black">
                    المحافظة متاحة للشحن
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-400">
                    لو عطلتها مش هتظهر للعميل في الـCheckout.
                  </p>
                </div>

              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                  className="flex-1 rounded-2xl border border-zinc-200 px-5 py-3.5 text-sm font-black text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />

                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={18}
                      />

                      {editingRate
                        ? "حفظ التعديل"
                        : "إضافة المحافظة"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteRate && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={24} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              حذف المحافظة؟
            </h2>

            <p className="mt-2 text-sm leading-7 text-zinc-500">
              هتحذف:
              <span className="font-black text-zinc-900">
                {" "}
                {deleteRate.name}
              </span>
            </p>

            <p className="mt-2 text-xs text-red-500">
              بعد الحذف مش هتظهر للعميل في الـCheckout.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeleteRate(
                    null
                  )
                }
                disabled={
                  deleting
                }
                className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  deleting
                }
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-50"
              >

                {deleting ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    حذف نهائي
                  </>
                )}

              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminShipping;
