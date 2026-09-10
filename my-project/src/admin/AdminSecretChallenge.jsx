import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Gift,
  KeyRound,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  addSecretChallenge,
  deleteSecretChallenge,
  getSecretChallenges,
  updateSecretChallenge,
} from "../firebase/secretChallenges";

const CURRENT_YEAR =
  new Date().getFullYear();

const EMPTY_FORM = {
  title: "",
  description: "",
  year: String(CURRENT_YEAR),
  question: "",
  answer: "",
  hints: [""],

  rewardType: "percentage",
  rewardValue: "",
  productId: "",
  productName: "",
  customRewardText: "",

  active: true,
  startAt: "",
  endAt: "",
};

function getRewardLabel(challenge) {
  const reward =
    challenge?.reward;

  if (!reward) {
    return "جائزة";
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

    case "custom":
      return (
        reward.customRewardText ||
        "هدية مخصصة"
      );

    default:
      return "جائزة";
  }
}

function AdminSecretChallenge() {
  const [challenges, setChallenges] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const loadChallenges =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getSecretChallenges();

        setChallenges(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Admin Secret Error:",
          err
        );

        setError(
          "حصلت مشكلة أثناء تحميل تحديات المفتاح الخفي."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const activeChallenge =
    useMemo(
      () =>
        challenges.find(
          (challenge) =>
            challenge.active ===
            true
        ),
      [challenges]
    );

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      year: String(
        CURRENT_YEAR
      ),
      hints: [""],
    });

    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setForm({
      ...EMPTY_FORM,
      year: String(
        CURRENT_YEAR
      ),
      hints: [""],
    });

    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (
    challenge
  ) => {
    setEditingId(
      challenge.id
    );

    setForm({
      title:
        challenge.title || "",

      description:
        challenge.description ||
        "",

      year:
        challenge.year !==
          undefined &&
        challenge.year !==
          null &&
        challenge.year !== ""
          ? String(
              challenge.year
            )
          : String(
              CURRENT_YEAR
            ),

      question:
        challenge.question ||
        "",

      answer:
        challenge.answer ||
        "",

      hints:
        Array.isArray(
          challenge.hints
        ) &&
        challenge.hints.length
          ? [
              ...challenge.hints,
            ]
              .sort(
                (a, b) =>
                  Number(
                    a.order || 0
                  ) -
                  Number(
                    b.order || 0
                  )
              )
              .map(
                (hint) =>
                  hint.text || ""
              )
          : [""],

      rewardType:
        challenge.reward
          ?.type ||
        "percentage",

      rewardValue:
        challenge.reward
          ?.value ?? "",

      productId:
        challenge.reward
          ?.productId || "",

      productName:
        challenge.reward
          ?.productName || "",

      customRewardText:
        challenge.reward
          ?.customRewardText ||
        "",

      active:
        challenge.active ===
        true,

      startAt:
        challenge.startAt || "",

      endAt:
        challenge.endAt || "",
    });

    setError("");
    setShowForm(true);
  };

  const updateForm = (
    key,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const addHint = () => {
    setForm((current) => ({
      ...current,
      hints: [
        ...current.hints,
        "",
      ],
    }));
  };

  const removeHint = (
    index
  ) => {
    setForm((current) => {
      const next =
        current.hints.filter(
          (_, itemIndex) =>
            itemIndex !== index
        );

      return {
        ...current,
        hints:
          next.length
            ? next
            : [""],
      };
    });
  };

  const updateHint = (
    index,
    value
  ) => {
    setForm((current) => ({
      ...current,

      hints:
        current.hints.map(
          (
            hint,
            itemIndex
          ) =>
            itemIndex ===
            index
              ? value
              : hint
        ),
    }));
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !form.title.trim()
      ) {
        setError(
          "اكتب اسم التحدي."
        );
        return;
      }

      if (
        String(
          form.year
        ).trim() === ""
      ) {
        setError(
          "حدد سنة السؤال."
        );
        return;
      }

      const numericYear =
        Number(form.year);

      if (
        !Number.isInteger(
          numericYear
        ) ||
        numericYear < 1900 ||
        numericYear > 2100
      ) {
        setError(
          "اكتب سنة صحيحة بين 1900 و 2100."
        );
        return;
      }

      const question =
        form.question.trim();

      if (!question) {
        setError(
          "اكتب السؤال اليدوي."
        );
        return;
      }

      const answer =
        form.answer.trim();

      if (!answer) {
        setError(
          "اكتب الإجابة الصحيحة."
        );
        return;
      }

      const hints =
        form.hints
          .map(
            (hint) =>
              String(
                hint || ""
              ).trim()
          )
          .filter(Boolean)
          .map(
            (hint, index) => ({
              order:
                index + 1,
              text: hint,
            })
          );

      if (
        hints.length === 0
      ) {
        setError(
          "اكتب هنت واحد على الأقل."
        );
        return;
      }

      if (
        form.rewardType ===
          "percentage" &&
        (!form.rewardValue ||
          Number(
            form.rewardValue
          ) <= 0)
      ) {
        setError(
          "اكتب نسبة الخصم."
        );
        return;
      }

      if (
        form.rewardType ===
          "percentage" &&
        Number(
          form.rewardValue
        ) > 100
      ) {
        setError(
          "نسبة الخصم لا يمكن أن تكون أكبر من 100%."
        );
        return;
      }

      if (
        form.rewardType ===
          "amount" &&
        (!form.rewardValue ||
          Number(
            form.rewardValue
          ) <= 0)
      ) {
        setError(
          "اكتب قيمة الخصم."
        );
        return;
      }

      if (
        form.rewardType ===
          "giftProduct" &&
        !form.productName.trim()
      ) {
        setError(
          "اكتب اسم المنتج الهدية."
        );
        return;
      }

      if (
        form.rewardType ===
          "custom" &&
        !form.customRewardText.trim()
      ) {
        setError(
          "اكتب الهدية المخصصة اللي العميل هيكسبها."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");

        const data = {
          title:
            form.title.trim(),

          description:
            form.description.trim(),

          year:
            numericYear,

          question,

          answer,

          hints,

          reward: {
            type:
              form.rewardType,

            value:
              form.rewardValue,

            productId:
              form.productId.trim(),

            productName:
              form.productName.trim(),

            customRewardText:
              form.customRewardText.trim(),
          },

          active:
            form.active ===
            true,

          startAt:
            form.startAt || "",

          endAt:
            form.endAt || "",
        };

        if (!editingId) {
          if (data.active) {
            const activeItems =
              challenges.filter(
                (item) =>
                  item.active ===
                  true
              );

            for (const item of activeItems) {
              await updateSecretChallenge(
                item.id,
                {
                  title:
                    item.title ||
                    "",

                  description:
                    item.description ||
                    "",

                  year:
                    item.year ||
                    CURRENT_YEAR,

                  question:
                    item.question ||
                    "",

                  answer:
                    item.answer ||
                    "",

                  hints:
                    item.hints ||
                    [],

                  reward:
                    item.reward || {
                      type:
                        "percentage",
                      value: "",
                      productId: "",
                      productName: "",
                      customRewardText: "",
                    },

                  active:
                    false,

                  startAt:
                    item.startAt ||
                    "",

                  endAt:
                    item.endAt ||
                    "",
                }
              );
            }
          }

          await addSecretChallenge(
            data
          );
        } else {
          if (data.active) {
            const activeItems =
              challenges.filter(
                (item) =>
                  item.active ===
                    true &&
                  item.id !==
                    editingId
              );

            for (const item of activeItems) {
              await updateSecretChallenge(
                item.id,
                {
                  title:
                    item.title ||
                    "",

                  description:
                    item.description ||
                    "",

                  year:
                    item.year ||
                    CURRENT_YEAR,

                  question:
                    item.question ||
                    "",

                  answer:
                    item.answer ||
                    "",

                  hints:
                    item.hints ||
                    [],

                  reward:
                    item.reward || {
                      type:
                        "percentage",
                      value: "",
                      productId: "",
                      productName: "",
                      customRewardText: "",
                    },

                  active:
                    false,

                  startAt:
                    item.startAt ||
                    "",

                  endAt:
                    item.endAt ||
                    "",
                }
              );
            }
          }

          await updateSecretChallenge(
            editingId,
            data
          );
        }

        await loadChallenges();

        resetForm();
      } catch (err) {
        console.error(
          "Save Secret Challenge Error:",
          err
        );

        setError(
          err?.message ||
            "حصلت مشكلة أثناء حفظ التحدي."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDelete =
    async (challenge) => {
      const confirmed =
        window.confirm(
          `متأكد إنك عايز تحذف تحدي "${challenge.title}"؟`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          challenge.id
        );

        setError("");

        await deleteSecretChallenge(
          challenge.id
        );

        await loadChallenges();

        if (
          editingId ===
          challenge.id
        ) {
          resetForm();
        }
      } catch (err) {
        console.error(
          "Delete Secret Challenge Error:",
          err
        );

        setError(
          err?.message ||
            "حصلت مشكلة أثناء حذف التحدي."
        );
      } finally {
        setDeletingId("");
      }
    };

  const toggleActive =
    async (challenge) => {
      try {
        setError("");

        const nextActive =
          challenge.active !==
          true;

        if (nextActive) {
          const activeItems =
            challenges.filter(
              (item) =>
                item.active ===
                  true &&
                item.id !==
                  challenge.id
            );

          for (const item of activeItems) {
            await updateSecretChallenge(
              item.id,
              {
                title:
                  item.title ||
                  "",

                description:
                  item.description ||
                  "",

                year:
                  item.year ||
                  CURRENT_YEAR,

                question:
                  item.question ||
                  "",

                answer:
                  item.answer ||
                  "",

                hints:
                  item.hints ||
                  [],

                reward:
                  item.reward || {
                    type:
                      "percentage",
                    value: "",
                    productId: "",
                    productName: "",
                    customRewardText: "",
                  },

                active:
                  false,

                startAt:
                  item.startAt ||
                  "",

                endAt:
                  item.endAt ||
                  "",
              }
            );
          }
        }

        await updateSecretChallenge(
          challenge.id,
          {
            title:
              challenge.title ||
              "",

            description:
              challenge.description ||
              "",

            year:
              challenge.year ||
              CURRENT_YEAR,

            question:
              challenge.question ||
              "",

            answer:
              challenge.answer ||
              "",

            hints:
              challenge.hints ||
              [],

            reward:
              challenge.reward || {
                type:
                  "percentage",
                value: "",
                productId: "",
                productName: "",
                customRewardText: "",
              },

            active:
              nextActive,

            startAt:
              challenge.startAt ||
              "",

            endAt:
              challenge.endAt ||
              "",
          }
        );

        await loadChallenges();
      } catch (err) {
        console.error(
          "Toggle Secret Challenge Error:",
          err
        );

        setError(
          err?.message ||
            "مش قادرين نغير حالة التحدي."
        );
      }
    };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-zinc-50"
    >
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
                <KeyRound size={23} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-900">
                    المفتاح الخفي
                  </h1>

                  {activeChallenge && (
                    <span className="rounded-full bg-[#39ff14]/15 px-3 py-1 text-[9px] font-black text-green-700">
                      فعال الآن
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-zinc-500">
                  إدارة التحديات والهنتات والجوائز.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  loadChallenges
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-800 transition hover:border-black hover:bg-zinc-100"
              >
                <RefreshCw
                  size={17}
                />
                تحديث
              </button>

              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                <Plus
                  size={18}
                  className="text-[#39ff14]"
                />
                إنشاء تحدي
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-bold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {showForm && (
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "تعديل التحدي"
                    : "إنشاء تحدي جديد"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  اكتب أي سؤال وحدد السنة والجائزة اللي أنت عايزها.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  resetForm
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-black hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="grid gap-6 p-6 lg:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-black">
                  اسم التحدي
                </label>

                <input
                  value={
                    form.title
                  }
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target
                        .value
                    )
                  }
                  placeholder="مثال: سر التيشيرت الأسود"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <CalendarDays
                    size={16}
                  />
                  سنة السؤال
                </label>

                <input
                  type="number"
                  min="1900"
                  max="2100"
                  step="1"
                  value={
                    form.year
                  }
                  onChange={(event) =>
                    updateForm(
                      "year",
                      event.target
                        .value
                    )
                  }
                  placeholder="مثال: 2026"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-black outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                  dir="ltr"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-black">
                  حالة التحدي
                </label>

                <button
                  type="button"
                  onClick={() =>
                    updateForm(
                      "active",
                      !form.active
                    )
                  }
                  className={`flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-sm font-black transition ${
                    form.active
                      ? "border-[#39ff14]/30 bg-[#39ff14]/10 text-green-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500"
                  }`}
                >
                  <span>
                    {form.active
                      ? "التحدي فعال"
                      : "التحدي غير فعال"}
                  </span>

                  <span
                    className={`h-3 w-3 rounded-full ${
                      form.active
                        ? "bg-[#39ff14]"
                        : "bg-zinc-300"
                    }`}
                  />
                </button>
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-black">
                  وصف التحدي
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target
                        .value
                    )
                  }
                  rows={3}
                  placeholder="وصف بسيط يظهر للعميل قبل السؤال."
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />
              </div>

              <div className="lg:col-span-2">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-black">
                    السؤال اليدوي
                  </label>

                  <span className="rounded-full bg-[#39ff14]/10 px-3 py-1 text-[9px] font-black text-green-700">
                    اكتب أي سؤال من دماغك
                  </span>
                </div>

                <textarea
                  value={
                    form.question
                  }
                  onChange={(event) =>
                    updateForm(
                      "question",
                      event.target
                        .value
                    )
                  }
                  rows={4}
                  placeholder="اكتب السؤال اللي أنت عايزه..."
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-black">
                  الإجابة الصحيحة
                </label>

                <input
                  value={
                    form.answer
                  }
                  onChange={(event) =>
                    updateForm(
                      "answer",
                      event.target
                        .value
                    )
                  }
                  placeholder="الإجابة اللي لازم العميل يكتبها"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />
              </div>

              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <label className="text-sm font-black">
                      الهنتات
                    </label>

                    <p className="mt-1 text-xs text-zinc-400">
                      عدد الهنتات بيتحدد بعدد السطور اللي تضيفها هنا.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addHint
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-black transition hover:border-black hover:bg-zinc-100"
                  >
                    <Plus size={15} />
                    إضافة هنت
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {form.hints.map(
                    (
                      hint,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-xs font-black text-[#39ff14]">
                          {index + 1}
                        </div>

                        <textarea
                          value={
                            hint
                          }
                          onChange={(
                            event
                          ) =>
                            updateHint(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                          rows={2}
                          placeholder={`الهنت رقم ${
                            index + 1
                          }...`}
                          className="min-h-[48px] flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeHint(
                              index
                            )
                          }
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* REWARD */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-[#39ff14]">
                    <Gift size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">
                      الجائزة
                    </h3>

                    <p className="text-xs text-zinc-400">
                      اختار العميل هياخد إيه بعد الإجابة الصحيحة.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      value:
                        "percentage",
                      label:
                        "خصم نسبة %",
                    },
                    {
                      value:
                        "amount",
                      label:
                        "خصم مبلغ",
                    },
                    {
                      value:
                        "freeShipping",
                      label:
                        "شحن مجاني",
                    },
                    {
                      value:
                        "giftTshirt",
                      label:
                        "تيشيرت هدية",
                    },
                    {
                      value:
                        "giftProduct",
                      label:
                        "منتج هدية",
                    },
                    {
                      value:
                        "custom",
                      label:
                        "🎁 هدية من دماغي",
                    },
                  ].map(
                    (item) => (
                      <button
                        key={
                          item.value
                        }
                        type="button"
                        onClick={() =>
                          updateForm(
                            "rewardType",
                            item.value
                          )
                        }
                        className={`rounded-2xl border p-4 text-right transition-all ${
                          form.rewardType ===
                          item.value
                            ? "border-[#39ff14]/40 bg-[#39ff14]/10"
                            : "border-zinc-200 bg-white hover:border-zinc-400"
                        }`}
                      >
                        <p className="text-sm font-black">
                          {
                            item.label
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-400">
                          {item.value ===
                          "percentage"
                            ? "مثال: 20%"
                            : item.value ===
                              "amount"
                            ? "مثال: 100 جنيه"
                            : item.value ===
                              "custom"
                            ? "اكتب أي هدية بنفسك"
                            : "جائزة مباشرة"}
                        </p>
                      </button>
                    )
                  )}
                </div>

                {(form.rewardType ===
                  "percentage" ||
                  form.rewardType ===
                    "amount") && (
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-black text-zinc-600">
                      قيمة الجائزة
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        form.rewardValue
                      }
                      onChange={(event) =>
                        updateForm(
                          "rewardValue",
                          event.target
                            .value
                        )
                      }
                      placeholder={
                        form.rewardType ===
                        "percentage"
                          ? "20"
                          : "100"
                      }
                      className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-black outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                    />
                  </div>
                )}

                {form.rewardType ===
                  "giftProduct" && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <input
                      value={
                        form.productId
                      }
                      onChange={(event) =>
                        updateForm(
                          "productId",
                          event.target
                            .value
                        )
                      }
                      placeholder="ID المنتج"
                      className="h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none focus:border-[#39ff14]"
                      dir="ltr"
                    />

                    <input
                      value={
                        form.productName
                      }
                      onChange={(event) =>
                        updateForm(
                          "productName",
                          event.target
                            .value
                        )
                      }
                      placeholder="اسم المنتج الهدية"
                      className="h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none focus:border-[#39ff14]"
                    />
                  </div>
                )}

                {form.rewardType ===
                  "custom" && (
                  <div className="mt-4 rounded-2xl border border-[#39ff14]/20 bg-[#39ff14]/5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Gift
                        size={17}
                        className="text-green-600"
                      />

                      <label className="text-xs font-black text-zinc-800">
                        اكتب الهدية اللي في دماغك
                      </label>
                    </div>

                    <textarea
                      value={
                        form.customRewardText
                      }
                      onChange={(event) =>
                        updateForm(
                          "customRewardText",
                          event.target
                            .value
                        )
                      }
                      rows={3}
                      placeholder="مثال: كاب HIRAQL هدية 🎁 أو شنطة جيم مجانية أو اشتراك أسبوع..."
                      className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-[#39ff14] focus:ring-4 focus:ring-[#39ff14]/10"
                    />

                    <p className="mt-2 text-[10px] font-semibold text-zinc-400">
                      اكتب أي هدية أو مكافأة أنت عايزها، ومش لازم تكون من الاختيارات الجاهزة.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <CalendarDays
                    size={16}
                  />
                  يبدأ من
                </label>

                <input
                  type="datetime-local"
                  value={
                    form.startAt
                  }
                  onChange={(event) =>
                    updateForm(
                      "startAt",
                      event.target
                        .value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none focus:border-[#39ff14]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black">
                  <CalendarDays
                    size={16}
                  />
                  ينتهي في
                </label>

                <input
                  type="datetime-local"
                  value={
                    form.endAt
                  }
                  onChange={(event) =>
                    updateForm(
                      "endAt",
                      event.target
                        .value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none focus:border-[#39ff14]"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end lg:col-span-2">
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-100"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-7 py-3 text-sm font-black text-white transition hover:bg-zinc-800 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={17}
                        className="text-[#39ff14]"
                      />
                      {editingId
                        ? "حفظ التعديل"
                        : "إنشاء التحدي"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-[2rem] border border-zinc-200 bg-white p-5"
                >
                  <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200" />
                  <div className="mt-4 h-20 animate-pulse rounded-2xl bg-zinc-100" />
                  <div className="mt-4 h-12 animate-pulse rounded-2xl bg-zinc-100" />
                </div>
              )
            )}
          </div>
        ) : challenges.length ===
          0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
              <KeyRound size={29} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              مفيش تحديات لسه
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              ابدأ بإنشاء أول تحدي للمفتاح الخفي.
            </p>

            <button
              type="button"
              onClick={
                openAdd
              }
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-black text-white"
            >
              <Plus size={17} />
              إنشاء أول تحدي
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map(
              (challenge) => (
                <article
                  key={
                    challenge.id
                  }
                  className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="border-b border-zinc-100 bg-black p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                        <KeyRound size={20} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[9px] font-black ${
                          challenge.active
                            ? "bg-[#39ff14] text-black"
                            : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        {challenge.active
                          ? "فعال"
                          : "غير فعال"}
                      </span>
                    </div>

                    <h2 className="mt-5 text-lg font-black">
                      {
                        challenge.title
                      }
                    </h2>

                    {challenge.year && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                        <CalendarDays
                          size={12}
                          className="text-[#39ff14]"
                        />

                        <span className="text-[10px] font-black text-zinc-300">
                          سنة السؤال:{" "}
                          {
                            challenge.year
                          }
                        </span>
                      </div>
                    )}

                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-500">
                      {
                        challenge.description
                      }
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-bold text-zinc-400">
                          السؤال اليدوي
                        </p>

                        {challenge.year && (
                          <span className="text-[10px] font-black text-green-700">
                            {
                              challenge.year
                            }
                          </span>
                        )}
                      </div>

                      <p className="mt-2 line-clamp-3 text-sm font-black text-zinc-800">
                        {challenge.question ||
                          "لا يوجد سؤال محفوظ"}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-zinc-50 p-3">
                        <p className="text-[9px] text-zinc-400">
                          عدد الهنتات
                        </p>

                        <p className="mt-1 text-lg font-black">
                          {Array.isArray(
                            challenge.hints
                          )
                            ? challenge.hints
                                .length
                            : 0}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-zinc-50 p-3">
                        <p className="text-[9px] text-zinc-400">
                          الجائزة
                        </p>

                        <p className="mt-1 truncate text-xs font-black">
                          {getRewardLabel(
                            challenge
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-zinc-100 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Gift
                          size={15}
                          className="text-[#16a34a]"
                        />

                        <span className="text-xs font-black">
                          {
                            getRewardLabel(
                              challenge
                            )
                          }
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleActive(
                            challenge
                          )
                        }
                        className={`rounded-xl px-3 py-3 text-[10px] font-black transition ${
                          challenge.active
                            ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            : "bg-[#39ff14]/15 text-green-700 hover:bg-[#39ff14]/25"
                        }`}
                      >
                        {challenge.active
                          ? "تعطيل"
                          : "تفعيل"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEdit(
                            challenge
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-zinc-200 px-3 py-3 text-[10px] font-black text-zinc-700 transition hover:border-black hover:bg-zinc-100"
                      >
                        <Pencil
                          size={13}
                        />
                        تعديل
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          challenge.id
                        }
                        onClick={() =>
                          handleDelete(
                            challenge
                          )
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-50 px-3 py-3 text-[10px] font-black text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                      >
                        {deletingId ===
                        challenge.id ? (
                          <RefreshCw
                            size={13}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2
                            size={13}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminSecretChallenge;