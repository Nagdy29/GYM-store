import { useState } from "react";

import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const WHATSAPP_NUMBER = "201021142677";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = [
      "مرحباً HIRAQL GYM STORE 👋",
      "",
      `الاسم: ${form.name}`,
      `رقم الهاتف: ${form.phone}`,
      "",
      `الرسالة: ${form.message}`,
    ].join("\n");

    const url = `${whatsappUrl}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#39ff14]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <span className="text-xs font-black tracking-[0.2em] text-[#39ff14]">
            CONTACT US
          </span>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            تواصل معنا
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-zinc-400 sm:text-base">
            عندك سؤال عن منتج؟ عايز تعرف تفاصيل الطلب؟ أو محتاج
            مساعدة؟ ابعتلنا وإحنا معاك.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact Info */}
          <div>
            <div className="mb-7">
              <span className="text-xs font-black text-[#39a800]">
                GET IN TOUCH
              </span>

              <h2 className="mt-2 text-3xl font-black">
                إحنا هنا علشانك
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                أسرع طريقة للتواصل معانا هي واتساب. اضغط على الزر
                وهتقدر تبدأ المحادثة مباشرة.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group mb-8 flex items-center gap-4 bg-[#39ff14] p-5 text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-black text-[#39ff14]">
                <MessageCircle size={24} />
              </div>

              <div>
                <p className="text-xs font-bold">
                  واتساب
                </p>

                <p
                  dir="ltr"
                  className="mt-1 text-lg font-black"
                >
                  010 2114 2677
                </p>
              </div>
            </a>

            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                <div className="flex h-11 w-11 items-center justify-center bg-zinc-100">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    الهاتف
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 text-sm font-bold"
                  >
                    010 2114 2677
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                <div className="flex h-11 w-11 items-center justify-center bg-zinc-100">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    البريد الإلكتروني
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    تواصل معنا عبر واتساب
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
                <div className="flex h-11 w-11 items-center justify-center bg-zinc-100">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    مواعيد التواصل
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    يومياً
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center bg-zinc-100">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs text-zinc-400">
                    الموقع
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    مصر
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="border border-zinc-200 bg-zinc-50 p-5 sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-black">
                ابعتلنا رسالة
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                اكتب بياناتك ورسالتك، وهيتم تجهيزها وإرسالها على
                واتساب مباشرة.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold"
                >
                  الاسم
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="اكتب اسمك"
                  className="w-full border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-[#39ff14] focus:ring-2 focus:ring-[#39ff14]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold"
                >
                  رقم الهاتف
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="010xxxxxxxx"
                  className="w-full border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-[#39ff14] focus:ring-2 focus:ring-[#39ff14]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold"
                >
                  الرسالة
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="اكتب استفسارك هنا..."
                  className="w-full resize-none border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-[#39ff14] focus:ring-2 focus:ring-[#39ff14]/10"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 bg-black px-5 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#39ff14] hover:text-black"
              >
                <Send size={18} />
                إرسال عبر واتساب
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black px-4 py-14 text-center text-white sm:px-6">
        <MessageCircle
          size={32}
          className="mx-auto text-[#39ff14]"
        />

        <h2 className="mt-4 text-2xl font-black">
          محتاج رد سريع؟
        </h2>

        <p className="mt-3 text-sm text-zinc-400">
          كلمنا مباشرة على واتساب.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-3 bg-[#39ff14] px-7 py-3 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1"
        >
          <MessageCircle size={18} />
          افتح واتساب
        </a>
      </section>
    </div>
  );
}

export default Contact;