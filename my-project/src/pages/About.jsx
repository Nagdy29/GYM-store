import {
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

function About() {
  const features = [
    {
      icon: Dumbbell,
      title: "اختيارات للجيم",
      text: "منتجات مصممة لعشاق التدريب والتمرين وتناسب أسلوب الحياة الرياضي.",
    },
    {
      icon: ShieldCheck,
      title: "جودة نهتم بها",
      text: "نهتم باختيار المنتجات بعناية حتى تحصل على تجربة شراء أفضل.",
    },
    {
      icon: Zap,
      title: "تجربة سهلة",
      text: "من تصفح المنتجات لحد التواصل والطلب، بنحاول نخلي كل حاجة بسيطة.",
    },
    {
      icon: Users,
      title: "أنت جزء مننا",
      text: "هدفنا نبني مجتمع يهتم بالرياضة، التطور، والثقة بالنفس.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#39ff14]/10 blur-3xl" />
          <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] rounded-full bg-[#39ff14]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 border border-[#39ff14]/30 bg-[#39ff14]/5 px-4 py-2 text-xs font-black text-[#39ff14]">
              <Sparkles size={15} />
              HIRAQL GYM STORE
            </span>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              إحنا مش مجرد متجر
              <span className="block text-[#39ff14]">
                إحنا جزء من رحلتك
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-zinc-400 sm:text-base">
              في HIRAQL GYM STORE بنحاول نوفر لك تجربة مختلفة في عالم
              الملابس والمستلزمات الرياضية، باختيارات عملية وشكل عصري
              يناسب الأشخاص اللي بيحبوا الرياضة وبيسعوا دايمًا للتطور.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#39a800]">
              من نحن
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              بنبني براند يفهم احتياجاتك
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-8 text-zinc-600 sm:text-base">
              <p>
                HIRAQL GYM STORE هو متجر متخصص في المنتجات الرياضية
                والملابس المناسبة للتمرين والجيم.
              </p>

              <p>
                بنركز على تقديم منتجات باختيارات مدروسة، شكل عصري،
                وتجربة شراء سهلة وسريعة.
              </p>

              <p>
                وطموحنا مش مجرد بيع المنتجات، لكن إننا نكون اختيارك
                المفضل كل ما تحتاج حاجة جديدة للتمرين أو ستايل رياضي
                يناسبك.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
              <div className="flex aspect-square items-center justify-center bg-black">
                <img
                  src="/hiraql-logo.jpg"
                  alt="HIRAQL GYM STORE"
                  className="max-h-32 max-w-[75%] object-contain"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden bg-[#39ff14] px-6 py-4 sm:block">
              <p className="text-xs font-black text-black">
                TRAIN HARD
              </p>
              <p className="text-lg font-black text-black">
                STAY STRONG
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="text-xs font-black text-[#39a800]">
              ليه HIRAQL؟
            </span>

            <h2 className="mt-2 text-3xl font-black">
              حاجات بنهتم بيها
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center bg-black text-[#39ff14] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-lg font-black">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Target
            size={38}
            className="mx-auto text-[#39ff14]"
          />

          <h2 className="mt-6 text-3xl font-black sm:text-4xl">
            هدفنا بسيط
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-zinc-400 sm:text-base">
            نخلي تجربة شراء المنتجات الرياضية أسهل، ونوفر لك اختيارات
            تساعدك تظهر بالشكل اللي تحبه وتكمل رحلتك في التمرين بثقة.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;