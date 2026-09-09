import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dumbbell,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { loginAdmin } from "../firebase/auth";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    const email =
      form.email.trim();

    const password =
      form.password;

    if (!email || !password) {
      setError(
        "من فضلك اكتب الإيميل والباسورد."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "LOGIN START",
        {
          email,
          hasPassword:
            Boolean(password),
        }
      );

      const user =
        await loginAdmin(
          email,
          password
        );

      console.log(
        "LOGIN SUCCESS",
        {
          uid: user?.uid,
          email: user?.email,
        }
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGIN FAILED",
        error
      );

      setError(
        error?.message ||
          "الإيميل أو الباسورد غير صحيح."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full">

          {/* BRAND */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-lime-400/30 bg-lime-400/10 shadow-[0_0_40px_rgba(57,255,20,0.08)] transition-all duration-300 hover:scale-105 hover:border-lime-400/50 hover:bg-lime-400/15 hover:shadow-[0_0_50px_rgba(57,255,20,0.16)]">
              <Dumbbell
                size={38}
                className="text-lime-400 transition-transform duration-300 hover:rotate-[-8deg]"
              />
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              HIRAQL
              <span className="text-lime-400">
                {" "}
                GYM
              </span>
            </h1>

            <p className="mt-2 text-sm font-medium text-zinc-400">
              تسجيل دخول لوحة التحكم
            </p>

            <p className="mt-1 text-[10px] font-black tracking-[0.2em] text-zinc-700">
              STORE ADMIN PANEL
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl shadow-black/40 sm:p-7">

            {/* ADMIN INFO */}

            <div className="mb-7 flex items-center gap-3 rounded-2xl border border-lime-400/10 bg-lime-400/5 p-4 transition-all duration-300 hover:border-lime-400/20 hover:bg-lime-400/[0.07]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-400/10">
                <ShieldCheck
                  size={22}
                  className="text-lime-400"
                />
              </div>

              <div>
                <p className="font-bold text-white">
                  منطقة الإدارة
                </p>

                <p className="text-xs text-zinc-500">
                  الدخول مخصص للمسؤول فقط
                </p>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm leading-6 text-red-400">
                  {error}
                </p>

                <p className="mt-2 text-[10px] leading-5 text-red-500/60">
                  افتح Console في المتصفح
                  وشوف الخطأ الموجود تحت
                  LOGIN FAILED.
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div className="group">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-zinc-300"
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-white/[0.04] transition-all duration-300 group-focus-within:bg-lime-400/10">
                    <Mail
                      size={18}
                      className="text-zinc-500 transition-all duration-300 group-hover:text-zinc-300 group-focus-within:scale-110 group-focus-within:text-lime-400"
                    />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={
                      handleChange
                    }
                    autoComplete="username"
                    inputMode="email"
                    spellCheck="false"
                    autoCapitalize="none"
                    placeholder="admin@example.com"
                    dir="ltr"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3.5 pe-14 ps-4 text-left text-sm font-medium text-white outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-zinc-700 focus:border-lime-400/60 focus:bg-zinc-900/80 focus:ring-4 focus:ring-lime-400/5"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-zinc-300"
                >
                  كلمة المرور
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-white/[0.04]">
                    <LockKeyhole
                      size={18}
                      className="text-zinc-500"
                    />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3.5 pe-14 ps-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-700 hover:border-zinc-700 focus:border-lime-400/60 focus:bg-zinc-900/80 focus:ring-4 focus:ring-lime-400/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute left-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-600 transition-all duration-300 hover:bg-white/[0.04] hover:text-white"
                    aria-label={
                      showPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 py-3.5 font-black text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-300 hover:shadow-[0_15px_40px_rgba(57,255,20,0.12)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <ShieldCheck
                      size={19}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />

                    دخول لوحة التحكم
                  </>
                )}
              </button>
            </form>

            {/* BACK TO STORE */}

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="mt-5 w-full text-center text-sm font-medium text-zinc-500 transition-all duration-300 hover:text-lime-400"
            >
              العودة إلى المتجر
            </button>
          </div>

          {/* FOOTER */}

          <p className="mt-6 text-center text-xs font-bold text-zinc-600">
            HIRAQL GYM STORE © 2026
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
