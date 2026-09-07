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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("من فضلك اكتب الإيميل والباسورد.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginAdmin(
        form.email,
        form.password
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      setError(error.message);
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
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-lime-400/30 bg-lime-400/10 shadow-[0_0_40px_rgba(57,255,20,0.08)]">
              <Dumbbell
                size={38}
                className="text-lime-400"
              />
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              ZENGER
              <span className="text-lime-400">
                {" "}
                GYM
              </span>
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              تسجيل دخول لوحة التحكم
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl sm:p-7">
            <div className="mb-7 flex items-center gap-3 rounded-2xl border border-lime-400/10 bg-lime-400/5 p-4">
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

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-zinc-300"
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3.5 pe-12 ps-4 text-sm text-white outline-none transition focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-zinc-300"
                >
                  كلمة المرور
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3.5 pe-12 ps-12 text-sm text-white outline-none transition focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-zinc-500 transition hover:text-white"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 py-3.5 font-black text-black transition hover:bg-lime-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={19} />
                    دخول لوحة التحكم
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-5 w-full text-center text-sm text-zinc-500 transition hover:text-lime-400"
            >
              العودة إلى المتجر
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-600">
            ZENGER GYM STORE © 2026
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;