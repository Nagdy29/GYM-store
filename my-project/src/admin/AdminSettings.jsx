import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";

import { auth } from "../firebase/config";

function AdminSettings() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [success, setSuccess] =
    useState("");

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

    if (success) {
      setSuccess("");
    }
  };

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!user) {
      setError(
        "جلسة الأدمن انتهت. سجل دخول مرة تانية."
      );

      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    if (!form.currentPassword) {
      setError(
        "اكتب الباسورد الحالي."
      );
      return;
    }

    if (!form.newPassword) {
      setError(
        "اكتب الباسورد الجديد."
      );
      return;
    }

    if (form.newPassword.length < 6) {
      setError(
        "الباسورد الجديد لازم يكون 6 أحرف على الأقل."
      );
      return;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setError(
        "تأكيد الباسورد مش مطابق للباسورد الجديد."
      );
      return;
    }

    if (
      form.currentPassword ===
      form.newPassword
    ) {
      setError(
        "الباسورد الجديد لازم يكون مختلف عن الحالي."
      );
      return;
    }

    try {
      setSaving(true);

      const credential =
        EmailAuthProvider.credential(
          user.email,
          form.currentPassword
        );

      /*
       * Firebase محتاج إعادة التحقق من
       * هوية الأدمن قبل تغيير الباسورد.
       */

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        form.newPassword
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess(
        "تم تغيير الباسورد بنجاح ✅"
      );
    } catch (firebaseError) {
      console.error(
        "Change password error:",
        firebaseError
      );

      switch (
        firebaseError?.code
      ) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError(
            "الباسورد الحالي غير صحيح."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "تمت محاولات كثيرة. جرّب بعد شوية."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "مشكلة في الإنترنت. حاول مرة تانية."
          );
          break;

        case "auth/weak-password":
          setError(
            "الباسورد الجديد ضعيف. استخدم باسورد أقوى."
          );
          break;

        default:
          setError(
            firebaseError?.message ||
              "حصل خطأ أثناء تغيير الباسورد."
          );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut(auth);

      navigate("/admin/login", {
        replace: true,
      });
    } catch (logoutError) {
      console.error(
        "Logout error:",
        logoutError
      );

      setError(
        "حصل خطأ أثناء تسجيل الخروج. جرّب تاني."
      );

      setLoggingOut(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-zinc-50"
    >
      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-lime-600">
                HIRAQL ADMIN
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                الإعدادات
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500">
                إدارة بيانات حساب الأدمن وتغيير
                كلمة المرور بأمان.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={18} />

              {loggingOut
                ? "جاري تسجيل الخروج..."
                : "تسجيل الخروج"}
            </button>
          </div>
        </div>

        {/* STATUS */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-sm font-bold leading-6 text-emerald-700">
              {success}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <p className="text-sm font-bold leading-6 text-red-600">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">

          {/* ACCOUNT CARD */}

          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-600">
              <ShieldCheck size={27} />
            </div>

            <h2 className="mt-5 text-xl font-black text-zinc-950">
              حساب الأدمن
            </h2>

            <p className="mt-2 text-xs leading-6 text-zinc-500">
              الحساب المستخدم حاليًا لإدارة متجر
              HIRAQL GYM STORE.
            </p>

            <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-[10px] font-black text-zinc-400">
                البريد الإلكتروني
              </p>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-500 shadow-sm">
                  <Mail size={17} />
                </div>

                <p
                  dir="ltr"
                  className="min-w-0 break-all text-sm font-black text-zinc-800"
                >
                  {user?.email ||
                    "غير متاح"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-lime-200 bg-lime-50 p-4">
              <div className="flex items-start gap-3">
                <KeyRound
                  size={18}
                  className="mt-0.5 shrink-0 text-lime-700"
                />

                <div>
                  <p className="text-xs font-black text-lime-800">
                    حماية الحساب
                  </p>

                  <p className="mt-1 text-[11px] leading-6 text-lime-700/70">
                    قبل تغيير كلمة المرور لازم
                    تدخل كلمة المرور الحالية
                    للتأكد من هوية الأدمن.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-sm font-black text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={17} />

              {loggingOut
                ? "جاري تسجيل الخروج..."
                : "تسجيل الخروج"}
            </button>
          </section>

          {/* PASSWORD CARD */}

          <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-black text-lime-400">
                <KeyRound size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-950 sm:text-2xl">
                  تغيير كلمة المرور
                </h2>

                <p className="mt-1 text-xs leading-6 text-zinc-500">
                  غيّر كلمة مرور حساب الإدارة
                  بشكل آمن.
                </p>
              </div>
            </div>

            <form
              onSubmit={
                handleChangePassword
              }
              className="mt-7 space-y-5"
            >

              {/* CURRENT */}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-black text-zinc-800"
                >
                  كلمة المرور الحالية
                </label>

                <div className="relative">
                  <KeyRound
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.currentPassword
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="current-password"
                    placeholder="اكتب الباسورد الحالي"
                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pe-12 ps-12 text-sm font-bold text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label={
                      showCurrentPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* NEW */}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-black text-zinc-800"
                >
                  كلمة المرور الجديدة
                </label>

                <div className="relative">
                  <KeyRound
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.newPassword
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="new-password"
                    placeholder="اكتب الباسورد الجديد"
                    minLength={6}
                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pe-12 ps-12 text-sm font-bold text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label={
                      showNewPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-zinc-400">
                  استخدم 6 أحرف على الأقل ويفضل
                  يكون فيه أرقام وحروف.
                </p>
              </div>

              {/* CONFIRM */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-black text-zinc-800"
                >
                  تأكيد كلمة المرور الجديدة
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="new-password"
                    placeholder="اكتب الباسورد مرة تانية"
                    minLength={6}
                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pe-12 ps-12 text-sm font-bold text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label={
                      showConfirmPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={saving}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-black text-lime-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-900 hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-lime-400/30 border-t-lime-400" />
                    جاري تغيير الباسورد...
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      size={19}
                    />
                    حفظ كلمة المرور
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminSettings;
