import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Copy,
  Gift,
  KeyRound,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

import {
  getActiveSecretChallenge,
  createSecretChallengeClaim,
  getSecretChallengeClaim,
} from "../firebase/secretChallenges";

const WHATSAPP_NUMBER =
  "201099170161";

const normalizeAnswer = (
  value
) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
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
      return "تيشيرت جيم هدية";

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

function getRewardMessage(challenge) {
  const reward =
    challenge?.reward;

  if (!reward) {
    return "استفد من جائزتك في طلبك القادم.";
  }

  switch (reward.type) {
    case "percentage":
      return `أنت كسبت خصم ${reward.value}% على الطلب.`;

    case "amount":
      return `أنت كسبت خصم ${reward.value} جنيه على الطلب.`;

    case "freeShipping":
      return "أنت كسبت شحن مجاني على الطلب.";

    case "giftTshirt":
      return "أنت كسبت تيشيرت جيم هدية مع الطلب.";

    case "giftProduct":
      return `أنت كسبت ${
        reward.productName ||
        "منتج هدية"
      } مع الطلب.`;

    case "custom":
      return `أنت كسبت ${
        reward.customRewardText ||
        "هدية مخصصة"
      } مع الطلب.`;

    default:
      return "أنت كسبت جائزة مع الطلب.";
  }
}

function SecretChallenge() {
  const [
    challenge,
    setChallenge,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    checking,
    setChecking,
  ] = useState(false);

  const [
    claim,
    setClaim,
  ] = useState(null);

  const [
    alreadyClaimed,
    setAlreadyClaimed,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    hintIndex,
    setHintIndex,
  ] = useState(0);

  const loadChallenge =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const activeChallenge =
            await getActiveSecretChallenge();

          setChallenge(
            activeChallenge
          );

          if (!activeChallenge) {
            setAlreadyClaimed(false);
            setClaim(null);
            setSubmitted(false);
            return;
          }

          const existingClaim =
            await getSecretChallengeClaim(
              activeChallenge.id
            );

          if (existingClaim) {
            setAlreadyClaimed(true);
            setClaim(existingClaim);

            if (
              existingClaim.status ===
              "pending"
            ) {
              setSubmitted(true);
            }
          } else {
            setAlreadyClaimed(false);
            setClaim(null);
            setSubmitted(false);
          }
        } catch (firebaseError) {
          console.error(
            "Secret Challenge Error:",
            firebaseError
          );

          setError(
            "حصلت مشكلة أثناء تحميل التحدي. جرّب مرة تانية."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const hints = useMemo(() => {
    if (
      !Array.isArray(
        challenge?.hints
      )
    ) {
      return [];
    }

    return [
      ...challenge.hints,
    ].sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );
  }, [challenge]);

  const visibleHints =
    hints.slice(
      0,
      hintIndex
    );

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        checking ||
        alreadyClaimed ||
        !challenge
      ) {
        return;
      }

      const cleanAnswer =
        normalizeAnswer(answer);

      if (!cleanAnswer) {
        setError(
          "اكتب إجابتك الأول."
        );
        return;
      }

      setChecking(true);
      setError("");
      setSubmitted(false);

      try {
        const result =
          await createSecretChallengeClaim(
            challenge,
            cleanAnswer
          );

        if (
          result.success
        ) {
          setClaim(
            result.claim
          );

          setSubmitted(true);
          setAlreadyClaimed(true);

          const whatsappMessage =
            [
              "مرحباً HIRAQL GYM STORE 👋",
              "",
              "حليت المفتاح الخفي والإجابة كانت صحيحة ✅",
              "",
              `التحدي: ${challenge.title}`,
              `الجائزة: ${getRewardLabel(
                challenge
              )}`,
              `كود المكافأة: ${result.claim.couponCode}`,
              "",
              "هرفق Screenshot للنتيجة على واتساب.",
              "",
              "وأعرف إن لازم أعمل Order فعلي عشان أستفيد من المكافأة.",
            ].join("\n");

          const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              whatsappMessage
            )}`;

          window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
          );
        } else if (
          result.reason ===
          "already-claimed"
        ) {
          setAlreadyClaimed(true);

          setClaim(
            result.claim ||
              null
          );

          setError(
            "الجهاز ده استخدم مكافأة التحدي قبل كده."
          );
        } else {
          setSubmitted(false);

          setError(
            "الإجابة مش صحيحة. جرّب تاني أو استخدم هنت."
          );
        }
      } catch (submitError) {
        console.error(
          "Secret answer error:",
          submitError
        );

        setError(
          "حصلت مشكلة أثناء تسجيل المكافأة. جرّب تاني."
        );
      } finally {
        setChecking(false);
      }
    };

  const handleNextHint =
    () => {
      if (
        hintIndex <
        hints.length
      ) {
        setHintIndex(
          (current) =>
            Math.min(
              current + 1,
              hints.length
            )
        );
      }
    };

  const handleCopy =
    async () => {
      if (
        !claim?.couponCode
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          claim.couponCode
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        setError(
          "انسخ الكود يدويًا لأن المتصفح منع النسخ التلقائي."
        );
      }
    };

  const openWhatsapp =
    () => {
      if (
        !claim?.couponCode ||
        !challenge
      ) {
        return;
      }

      const message =
        [
          "مرحباً HIRAQL GYM STORE 👋",
          "",
          "أنا حليت المفتاح الخفي ✅",
          "",
          `التحدي: ${challenge.title}`,
          `الجائزة: ${getRewardLabel(
            challenge
          )}`,
          `كود المكافأة: ${claim.couponCode}`,
          "",
          "هرفق Screenshot للنتيجة.",
          "",
          "وعرفت إن المكافأة بتتربط مع Order فعلي.",
        ].join("\n");

      const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          message
        )}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    };

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white"
      >
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-[#39ff14]/20 bg-[#39ff14]/10 text-[#39ff14] shadow-[0_0_45px_rgba(57,255,20,0.10)]">
            <RefreshCw
              size={30}
              className="animate-spin"
            />
          </div>

          <p className="mt-5 text-sm font-black">
            جاري تجهيز التحدي...
          </p>

          <p className="mt-2 text-[11px] text-zinc-600">
            HIRAQL SECRET
          </p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#050505] px-4 py-16 text-white"
      >
        <main className="mx-auto max-w-3xl">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]">
            <div className="relative overflow-hidden px-6 py-16 text-center sm:px-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#39ff14]/10 blur-[80px]" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#39ff14]/20 bg-[#39ff14]/10 text-[#39ff14]">
                <KeyRound size={36} />
              </div>

              <div className="relative mt-6">
                <span className="text-[10px] font-black tracking-[0.25em] text-[#39ff14]">
                  HIRAQL SECRET
                </span>

                <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                  المفتاح الخفي مش متاح حاليًا
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-zinc-500">
                  مفيش تحدي فعال دلوقتي.
                  ارجع بعدين وجرب مرة تانية،
                  يمكن الجائزة الجاية تكون ليك.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const isUsed =
    claim?.status === "used";

  const isPending =
    claim?.status === "pending";

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none fixed -right-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-[#39ff14]/[0.06] blur-[130px]" />

      <div className="pointer-events-none fixed -bottom-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-[#39ff14]/[0.05] blur-[130px]" />

      <main className="relative mx-auto max-w-5xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0b0b0b] shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,255,20,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(57,255,20,0.06),transparent_30%)]" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/20 bg-[#39ff14]/[0.06] px-4 py-2">
                <Sparkles
                  size={14}
                  className="text-[#39ff14]"
                />

                <span className="text-[10px] font-black tracking-[0.24em] text-[#39ff14]">
                  HIRAQL SECRET
                </span>
              </div>

              <div className="mt-7 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-[#39ff14]/20 bg-[#39ff14]/10 text-[#39ff14] shadow-[0_0_50px_rgba(57,255,20,0.10)]">
                <KeyRound size={36} />
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {challenge.title}
              </h1>

              <p className="mt-4 max-w-2xl text-base font-bold leading-8 text-zinc-400 sm:text-lg">
                فك المفتاح...
                <span className="mx-2 text-[#39ff14]">
                  خُد الجائزة.
                </span>
              </p>

              <p className="mt-2 max-w-xl text-xs leading-7 text-zinc-600">
                تحدي سريع لعشاق HIRAQL GYM
                — الإجابة الصح تديك مكافأة
                تستخدمها في طلبك.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2.5">
                  <Zap
                    size={14}
                    className="text-[#39ff14]"
                  />

                  <span className="text-[10px] font-black text-zinc-300">
                    فرصة واحدة للجهاز
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2.5">
                  <Gift
                    size={14}
                    className="text-yellow-400"
                  />

                  <span className="text-[10px] font-black text-zinc-300">
                    الجائزة:{" "}
                    {getRewardLabel(
                      challenge
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {challenge.description && (
          <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-center">
            <p className="text-xs leading-7 text-zinc-500">
              {challenge.description}
            </p>
          </div>
        )}

        {claim && (
          <section className="mt-7 overflow-hidden rounded-[2rem] border border-[#39ff14]/20 bg-[#0b0b0b] shadow-[0_20px_70px_rgba(57,255,20,0.06)]">
            <div className="h-1 bg-[#39ff14]" />

            <div className="p-6 sm:p-8 lg:p-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#39ff14] text-black shadow-[0_0_30px_rgba(57,255,20,0.18)]">
                  {isUsed ? (
                    <CheckCircle2
                      size={28}
                    />
                  ) : (
                    <Trophy
                      size={28}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#39ff14]/10 px-3 py-1.5 text-[10px] font-black text-[#39ff14]">
                      {isUsed
                        ? "تم استخدام المكافأة"
                        : "إجابة صحيحة 🎉"}
                    </span>

                    {!isUsed && (
                      <span className="rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 text-[10px] font-black text-yellow-300">
                        مكافأة جاهزة
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                    {isUsed
                      ? "المكافأة اتستخدمت بالفعل"
                      : "مبروك يا بطل! كسبت 👑"}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-8 text-zinc-400">
                    {isUsed
                      ? "المكافأة اتربطت بطلب سابق ومينفعش تتستخدم مرة تانية."
                      : getRewardMessage(
                          challenge
                        )}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#39ff14]/15 bg-[#39ff14]/[0.04] p-5">
                  <p className="text-[10px] font-black text-zinc-600">
                    الجائزة
                  </p>

                  <p className="mt-2 break-words text-xl font-black text-[#39ff14]">
                    {getRewardLabel(
                      challenge
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <p className="text-[10px] font-black text-zinc-600">
                    كود المكافأة
                  </p>

                  <code
                    dir="ltr"
                    className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap text-xl font-black tracking-[0.16em] text-white"
                  >
                    {claim.couponCode}
                  </code>
                </div>
              </div>

              {!isUsed && (
                <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-5">
                  <div className="flex items-start gap-3">
                    <Gift
                      size={21}
                      className="mt-0.5 shrink-0 text-yellow-400"
                    />

                    <div>
                      <p className="text-sm font-black text-yellow-300">
                        خد بالك يا بطل
                      </p>

                      <p className="mt-1 text-xs leading-7 text-zinc-400">
                        لازم تعمل{" "}
                        <span className="font-black text-white">
                          Order فعلي
                        </span>{" "}
                        من المتجر عشان تستفيد
                        من المكافأة.
                        حل المفتاح أو إرسال
                        Screenshot لوحده مش
                        بيفعّل المكافأة.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={
                    handleCopy
                  }
                  disabled={isUsed}
                  className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#39ff14] px-5 py-4 text-sm font-black text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy size={18} />

                  {copied
                    ? "تم نسخ الكود"
                    : "نسخ كود المكافأة"}
                </button>

                {!isUsed && (
                  <button
                    type="button"
                    onClick={
                      openWhatsapp
                    }
                    className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20bd5a]"
                  >
                    <MessageCircle
                      size={19}
                    />

                    إرسال Screenshot واتساب
                  </button>
                )}
              </div>

              {!isUsed && (
                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                  <p className="text-[10px] leading-6 text-zinc-600">
                    📸 خد Screenshot للنتيجة
                    وابعتها على واتساب مع الكود
                    عشان فريق HIRAQL يعرف إنك
                    كسبت التحدي.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {error && (
          <div
            className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
              error.includes(
                "مش صحيحة"
              )
                ? "border-red-500/20 bg-red-500/[0.05] text-red-300"
                : "border-yellow-500/20 bg-yellow-500/[0.05] text-yellow-300"
            }`}
          >
            {error.includes(
              "مش صحيحة"
            ) ? (
              <XCircle
                size={19}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <Lightbulb
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <span className="text-xs font-bold leading-6">
              {error}
            </span>
          </div>
        )}

        {!alreadyClaimed && (
          <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0b0b0b]">
            <div className="border-b border-white/[0.07] bg-white/[0.015] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] text-[#39ff14]">
                    SECRET QUESTION
                  </p>

                  <h2 className="mt-3 text-xl font-black leading-8 sm:text-2xl">
                    {challenge.question}
                  </h2>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39ff14]/10 text-[#39ff14] sm:flex">
                  <KeyRound
                    size={22}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <form
                onSubmit={
                  handleSubmit
                }
              >
                <label className="mb-3 block text-sm font-black">
                  إجابتك
                </label>

                <input
                  value={
                    answer
                  }
                  onChange={(
                    event
                  ) =>
                    setAnswer(
                      event.target
                        .value
                    )
                  }
                  placeholder="اكتب الإجابة هنا..."
                  autoComplete="off"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black px-5 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#39ff14]/50 focus:ring-4 focus:ring-[#39ff14]/5"
                />

                <button
                  type="submit"
                  disabled={
                    checking
                  }
                  className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#39ff14] text-sm font-black text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_15px_45px_rgba(57,255,20,0.16)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {checking ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="animate-spin"
                      />

                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <KeyRound
                        size={18}
                      />

                      افتح المفتاح
                    </>
                  )}
                </button>
              </form>

              {hints.length > 0 && (
                <div className="mt-8 border-t border-white/[0.07] pt-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb
                        size={17}
                        className="text-yellow-400"
                      />

                      <p className="text-sm font-black">
                        الهنتات
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-500/5 px-3 py-1.5 text-[10px] font-bold text-zinc-600">
                      {visibleHints.length}/
                      {hints.length}
                    </span>
                  </div>

                  {visibleHints.length >
                    0 && (
                    <div className="mt-4 space-y-3">
                      {visibleHints.map(
                        (
                          hint,
                          index
                        ) => (
                          <div
                            key={`${hint.order}-${index}`}
                            className="rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.04] p-4"
                          >
                            <div className="flex items-start gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-xs font-black text-black">
                                {index +
                                  1}
                              </span>

                              <p className="text-xs leading-7 text-zinc-400">
                                {hint.text}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {hintIndex <
                    hints.length && (
                    <button
                      type="button"
                      onClick={
                        handleNextHint
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] px-4 py-2.5 text-xs font-black text-yellow-300 transition-all hover:bg-yellow-500/10"
                    >
                      <Lightbulb
                        size={15}
                      />

                      {visibleHints.length ===
                      0
                        ? "اظهر أول هنت"
                        : "اظهر الهنت التالي"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-7 rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39ff14]/10 text-[#39ff14]">
            <Sparkles size={21} />
          </div>

          <h3 className="mt-4 text-lg font-black">
            جاهز تثبت إنك من أبطال HIRAQL؟
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-7 text-zinc-600">
            حل السؤال، كسب الجائزة، وبعدها
            استخدم المكافأة في Order حقيقي
            من المتجر.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-black text-zinc-700">
            <span>
              HIRAQL GYM STORE
            </span>

            <span>•</span>

            <span>
              مرة واحدة لكل جهاز لكل تحدي
            </span>
          </div>
        </section>

        <div className="pb-5 pt-7 text-center">
          <p className="text-[10px] font-bold tracking-wide text-zinc-800">
            HIRAQL GYM STORE • TRAIN HARD • STAY CONSISTENT
          </p>
        </div>
      </main>
    </div>
  );
}

export default SecretChallenge;