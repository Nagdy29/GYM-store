import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  Gift,
  HelpCircle,
  KeyRound,
  Lock,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getActiveSecretChallenge,
} from "../firebase/secretChallenges";

/* =====================================================
   HELPERS
===================================================== */

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getRewardText(reward) {
  if (!reward) {
    return "جائزة مفاجأة 🎁";
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
      return "جائزة مفاجأة 🎁";
  }
}

/* =====================================================
   PAGE
===================================================== */

function SecretChallenge() {
  const [
    challenge,
    setChallenge,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [
    revealedHints,
    setRevealedHints,
  ] = useState(0);

  const [solved, setSolved] =
    useState(false);

  const [
    wrongAnswer,
    setWrongAnswer,
  ] = useState(false);

  const [copied, setCopied] =
    useState(false);

  /* =====================================================
     LOAD CURRENT CHALLENGE
  ====================================================== */

  useEffect(() => {
    let mounted = true;

    const loadChallenge =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getActiveSecretChallenge();

          if (!mounted) {
            return;
          }

          setChallenge(data);
        } catch (firebaseError) {
          console.error(
            "Secret Challenge Load Error:",
            firebaseError
          );

          if (!mounted) {
            return;
          }

          setError(
            "مش قادرين نحمل المفتاح الخفي حاليًا."
          );
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadChallenge();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     HINTS
  ====================================================== */

  const hints = useMemo(() => {
    if (
      !challenge ||
      !Array.isArray(
        challenge.hints
      )
    ) {
      return [];
    }

    return [...challenge.hints].sort(
      (a, b) =>
        Number(
          a.order || 0
        ) -
        Number(
          b.order || 0
        )
    );
  }, [challenge]);

  /* =====================================================
     REWARD
  ====================================================== */

  const rewardText =
    getRewardText(
      challenge?.reward
    );

  /* =====================================================
     REVEAL NEXT HINT
  ====================================================== */

  const revealNextHint = () => {
    if (
      revealedHints >=
      hints.length
    ) {
      return;
    }

    setRevealedHints(
      (current) =>
        current + 1
    );
  };

  /* =====================================================
     CHECK ANSWER
  ====================================================== */

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setWrongAnswer(false);

    if (!answer.trim()) {
      setWrongAnswer(true);
      return;
    }

    const correctAnswer =
      normalizeAnswer(answer) ===
      normalizeAnswer(
        challenge?.answer
      );

    if (!correctAnswer) {
      setWrongAnswer(true);
      return;
    }

    setSolved(true);
  };

  /* =====================================================
     COPY REWARD
  ====================================================== */

  const copyReward =
    async () => {
      try {
        await navigator.clipboard.writeText(
          rewardText
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch (copyError) {
        console.error(
          "Copy reward error:",
          copyError
        );
      }
    };

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex min-h-[75vh] max-w-xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#39ff14]/10 bg-[#39ff14]/[0.05] text-[#39ff14]">
              <RefreshCw
                size={28}
                className="animate-spin"
              />
            </div>

            <h1 className="mt-5 text-xl font-black">
              بنجهز المفتاح الخفي...
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              ثواني ونكون جاهزين.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     ERROR
  ====================================================== */

  if (error) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex min-h-[75vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-red-500/10 bg-[#0a0a0a] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <KeyRound size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-black">
              حصلت مشكلة
            </h1>

            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {error}
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#39ff14] px-6 py-3 text-sm font-black text-black transition-all hover:-translate-y-1 hover:bg-[#4dff2d]"
            >
              الرجوع للرئيسية
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     HERO + NO CHALLENGE
  ====================================================== */

  if (!challenge) {
    return (
      <main
        dir="rtl"
        className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      >
        {/* BACKGROUND */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#39ff14]/[0.055] blur-[150px]" />

        <div className="pointer-events-none absolute -left-40 top-[45%] h-[450px] w-[450px] rounded-full bg-[#39ff14]/[0.025] blur-[140px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:70px_70px]" />

        {/* HERO */}

        <section className="relative min-h-[75vh] overflow-hidden">
          <div className="mx-auto flex min-h-[75vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/15 bg-[#39ff14]/[0.04] px-4 py-2">
                <KeyRound
                  size={15}
                  className="text-[#39ff14]"
                />

                <span className="text-[10px] font-black tracking-[0.2em] text-[#39ff14]">
                  HIRAQL SECRET
                </span>
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[92px]">
                المفتاح

                <span className="block text-[#39ff14]">
                  الخفي 🔐
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-zinc-500 sm:text-base sm:leading-9">
                كل فترة بنخبي سر جديد في HIRAQL.
                حل اللغز، استخدم الهنتات،
                وافتح مفاجأتك.
              </p>

              <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                  <Lock size={19} />
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-white">
                    السر لسه مستخبي
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    مفيش تحدي شغال دلوقتي
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d]"
              >
                الرجوع للمتجر
                <ArrowLeft size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =====================================================
     MAIN PAGE
  ====================================================== */

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      {/* GLOBAL BACKGROUND */}

      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#39ff14]/[0.045] blur-[140px]" />

      <div className="pointer-events-none absolute -left-40 top-[55%] h-[450px] w-[450px] rounded-full bg-[#39ff14]/[0.025] blur-[140px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:70px_70px]" />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* BADGE */}

            <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-[#39ff14]/15 bg-[#39ff14]/[0.04] px-4 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#39ff14]" />

              <span className="text-[10px] font-black tracking-[0.2em] text-[#39ff14]">
                HIRAQL SECRET
              </span>

              <KeyRound
                size={14}
                className="text-[#39ff14]"
              />
            </div>

            {/* TITLE */}

            <h1 className="hero-reveal-delay mt-7 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[88px]">
              مش كل سر

              <span className="block text-[#39ff14]">
                بيتشاف.
              </span>
            </h1>

            <p className="hero-reveal-delay-2 mx-auto mt-7 max-w-2xl text-sm leading-8 text-zinc-500 sm:text-base sm:leading-9">
              في HIRAQL بنخبي لك تحديات من وقت للتاني.
              ركز في السؤال، افتح الهنتات بذكاء،
              وحاول تكتشف المفتاح قبل ما يخلص التحدي.
            </p>

            {/* HERO FEATURES */}

            <div className="hero-reveal-delay-3 mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <KeyRound
                  size={19}
                  className="mx-auto text-[#39ff14]"
                />

                <p className="mt-3 text-xs font-black text-white">
                  تحدي سري
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  سؤال جديد من وقت للتاني
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <Sparkles
                  size={19}
                  className="mx-auto text-[#39ff14]"
                />

                <p className="mt-3 text-xs font-black text-white">
                  هنتات
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  استخدمهم عشان توصل للحل
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <Gift
                  size={19}
                  className="mx-auto text-[#39ff14]"
                />

                <p className="mt-3 text-xs font-black text-white">
                  جائزة
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  كل تحدي له مفاجأة
                </p>
              </div>
            </div>

            {/* SCROLL */}

            <button
              type="button"
              onClick={() => {
                document
                  .getElementById(
                    "secret-challenge"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                    block: "start",
                  });
              }}
              className="hero-reveal-delay-4 mx-auto mt-12 flex flex-col items-center gap-2 text-zinc-600 transition-colors hover:text-[#39ff14]"
            >
              <span className="text-[9px] font-black tracking-[0.2em]">
                اكتشف التحدي
              </span>

              <ArrowDown
                size={17}
                className="animate-bounce"
              />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          DIVIDER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* =====================================================
          CHALLENGE SECTION
      ====================================================== */}

      <section
        id="secret-challenge"
        className="relative scroll-mt-24"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {/* SECTION TITLE */}

          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/10 bg-[#39ff14]/[0.035] px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

              <span className="text-[10px] font-black text-[#39ff14]">
                التحدي الحالي
              </span>

              <span className="text-[10px] text-zinc-700">
                /
              </span>

              <span className="text-[10px] font-black text-zinc-600">
                SECRET CHALLENGE
              </span>
            </span>

            <h2 className="mt-5 text-3xl font-black sm:text-5xl">
              جاهز تفتح
              <span className="text-[#39ff14]">
                {" "}
                المفتاح؟
              </span>
            </h2>
          </div>

          {/* CHALLENGE */}

          <section className="overflow-hidden rounded-[2.5rem] border border-white/[0.07] bg-[#0a0a0a] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="h-1 bg-[#39ff14]" />

            <div className="p-5 sm:p-8 lg:p-10">
              {!solved ? (
                <>
                  {/* HEADER */}

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="text-[10px] font-black tracking-[0.15em] text-[#39ff14]">
                        SECRET CHALLENGE
                      </span>

                      <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                        {challenge.title}
                      </h3>

                      {challenge.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500">
                          {
                            challenge.description
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#39ff14]/10 bg-[#39ff14]/[0.05] text-[#39ff14]">
                      <KeyRound size={24} />
                    </div>
                  </div>

                  {/* QUESTION */}

                  <div className="mt-8 rounded-[1.8rem] border border-white/[0.07] bg-black/20 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                        <HelpCircle size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-zinc-600">
                          السؤال
                        </p>

                        <h4 className="mt-2 text-base font-black leading-8 text-white sm:text-lg">
                          {
                            challenge.question
                          }
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* HINTS */}

                  <div className="mt-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h4 className="text-base font-black">
                          الهنتات
                        </h4>

                        <p className="mt-1 text-xs leading-6 text-zinc-600">
                          خد بالك، مش لازم تستخدم كل الهنتات 😉
                        </p>
                      </div>

                      <span className="w-fit rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[10px] font-black text-zinc-500">
                        {revealedHints} /{" "}
                        {hints.length}
                      </span>
                    </div>

                    {hints.length > 0 ? (
                      <div className="mt-4 grid gap-3">
                        {hints.map(
                          (
                            hint,
                            index
                          ) => {
                            const unlocked =
                              index <
                              revealedHints;

                            return (
                              <div
                                key={`${hint.order}-${index}`}
                                className={`rounded-2xl border p-4 transition-all duration-300 ${
                                  unlocked
                                    ? "border-[#39ff14]/15 bg-[#39ff14]/[0.035]"
                                    : "border-white/[0.05] bg-white/[0.02]"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                      unlocked
                                        ? "bg-[#39ff14] text-black"
                                        : "bg-white/[0.04] text-zinc-600"
                                    }`}
                                  >
                                    {unlocked ? (
                                      <Sparkles
                                        size={16}
                                      />
                                    ) : (
                                      <Lock
                                        size={15}
                                      />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-black tracking-[0.12em] text-zinc-600">
                                      HINT{" "}
                                      {index +
                                        1}
                                    </p>

                                    {unlocked ? (
                                      <p className="mt-1 text-xs leading-7 text-zinc-300 sm:text-sm">
                                        {
                                          hint.text
                                        }
                                      </p>
                                    ) : (
                                      <p className="mt-1 text-xs text-zinc-700">
                                        الهنت مقفول لسه
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-5 text-center text-xs text-zinc-600">
                        مفيش هنتات مضافة للتحدي.
                      </div>
                    )}

                    {revealedHints <
                      hints.length && (
                      <button
                        type="button"
                        onClick={
                          revealNextHint
                        }
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#39ff14]/15 bg-[#39ff14]/[0.05] px-5 py-3 text-xs font-black text-[#39ff14] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#39ff14]/30 hover:bg-[#39ff14]/10"
                      >
                        <Sparkles
                          size={15}
                        />

                        إظهار الهنت التالي
                      </button>
                    )}
                  </div>

                  {/* ANSWER */}

                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="mt-8"
                  >
                    <label className="mb-2 block text-sm font-black text-white">
                      اكتب الإجابة
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={answer}
                        onChange={(
                          event
                        ) => {
                          setAnswer(
                            event
                              .target
                              .value
                          );

                          if (
                            wrongAnswer
                          ) {
                            setWrongAnswer(
                              false
                            );
                          }
                        }}
                        placeholder="اكتب المفتاح هنا..."
                        autoComplete="off"
                        className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm font-bold text-white outline-none transition-all duration-300 placeholder:text-zinc-700 focus:border-[#39ff14]/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-[#39ff14]/5"
                      />

                      <button
                        type="submit"
                        className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#39ff14] px-7 text-sm font-black text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4dff2d] hover:shadow-[0_15px_40px_rgba(57,255,20,0.12)]"
                      >
                        افتح المفتاح

                        <ArrowLeft
                          size={17}
                        />
                      </button>
                    </div>

                    {wrongAnswer && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.045] px-4 py-3 text-xs font-bold text-red-400">
                        <span>✕</span>

                        <span>
                          الإجابة مش صحيحة لسه 😏
                          راجع الهنتات وجرب تاني.
                        </span>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                /* =================================================
                   SUCCESS
                ================================================== */

                <div className="py-8 text-center sm:py-12">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#39ff14] text-black shadow-[0_15px_55px_rgba(57,255,20,0.14)]">
                    <Trophy size={35} />
                  </div>

                  <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#39ff14]/15 bg-[#39ff14]/[0.05] px-4 py-2 text-[10px] font-black text-[#39ff14]">
                    <CheckCircle2
                      size={13}
                    />

                    ANSWER CORRECT
                  </div>

                  <h2 className="mt-5 text-3xl font-black sm:text-5xl">
                    مبروك! 🎉
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-zinc-500">
                    إنت قدرت تفتح المفتاح الخفي.
                    الجائزة دي بقت مستنيّاك.
                  </p>

                  <div className="mx-auto mt-8 max-w-xl rounded-[2rem] border border-[#39ff14]/15 bg-[#39ff14]/[0.04] p-6 sm:p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
                      <Gift size={25} />
                    </div>

                    <p className="mt-5 text-[10px] font-black tracking-[0.2em] text-zinc-600">
                      YOUR REWARD
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-[#39ff14] sm:text-3xl">
                      {rewardText}
                    </h3>

                    {challenge.reward
                      ?.type ===
                      "giftProduct" &&
                      challenge.reward
                        ?.productName && (
                        <p className="mt-3 text-sm font-bold text-zinc-400">
                          المنتج:
                          <span className="mr-1 text-white">
                            {
                              challenge
                                .reward
                                .productName
                            }
                          </span>
                        </p>
                      )}

                    <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-zinc-500">
                      احتفظ بتفاصيل الجائزة
                      واستخدمها حسب شروط المتجر.
                    </p>

                    <button
                      type="button"
                      onClick={
                        copyReward
                      }
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-5 py-3 text-xs font-black text-white transition-all hover:border-[#39ff14]/20 hover:text-[#39ff14]"
                    >
                      {copied
                        ? "تم النسخ ✅"
                        : "نسخ تفاصيل الجائزة"}
                    </button>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#39ff14] px-7 py-4 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#4dff2d]"
                    >
                      كمل التسوق

                      <ArrowLeft
                        size={17}
                      />
                    </Link>

                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:border-[#39ff14]/20 hover:text-[#39ff14]"
                    >
                      الرئيسية
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* BOTTOM NOTE */}

          <div className="mt-7 text-center">
            <p className="text-[10px] leading-6 text-zinc-700">
              المفتاح الخفي بيتغير من وقت للتاني...
              خليك متابع 🔐
            </p>
          </div>
        </div>
      </section>

      {/* ANIMATIONS */}

      <style>{`
        @keyframes secretReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-reveal {
          animation: secretReveal 0.8s ease-out both;
        }

        .hero-reveal-delay {
          animation: secretReveal 0.8s ease-out 0.1s both;
        }

        .hero-reveal-delay-2 {
          animation: secretReveal 0.8s ease-out 0.2s both;
        }

        .hero-reveal-delay-3 {
          animation: secretReveal 0.8s ease-out 0.3s both;
        }

        .hero-reveal-delay-4 {
          animation: secretReveal 0.8s ease-out 0.4s both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}

export default SecretChallenge;
