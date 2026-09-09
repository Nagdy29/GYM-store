import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";

import { auth } from "./config";

/**
 * =========================================================
 * تسجيل دخول الأدمن
 * =========================================================
 */

export async function loginAdmin(
  email,
  password
) {
  try {
    const cleanEmail = String(
      email || ""
    ).trim();

    const cleanPassword = String(
      password || ""
    );

    if (!cleanEmail) {
      throw new Error(
        "من فضلك اكتب البريد الإلكتروني."
      );
    }

    if (!cleanPassword) {
      throw new Error(
        "من فضلك اكتب كلمة المرور."
      );
    }

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );

    return userCredential.user;
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    let message =
      "حصل خطأ أثناء تسجيل الدخول.";

    switch (error?.code) {
      case "auth/invalid-credential":
        message =
          "الإيميل أو الباسورد غير صحيح.";
        break;

      case "auth/invalid-email":
        message =
          "الإيميل غير صحيح.";
        break;

      case "auth/user-not-found":
        message =
          "الحساب غير موجود.";
        break;

      case "auth/wrong-password":
        message =
          "الباسورد غير صحيح.";
        break;

      case "auth/user-disabled":
        message =
          "الحساب ده متوقف حاليًا.";
        break;

      case "auth/too-many-requests":
        message =
          "محاولات تسجيل الدخول كتير، حاول بعد شوية.";
        break;

      case "auth/network-request-failed":
        message =
          "مشكلة في الإنترنت. اتأكد من الاتصال وحاول تاني.";
        break;

      default:
        message =
          error?.message ||
          "تعذر تسجيل الدخول.";
    }

    throw new Error(message);
  }
}

/**
 * =========================================================
 * تغيير باسورد الأدمن
 * =========================================================
 */

export async function changeAdminPassword(
  currentPassword,
  newPassword
) {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "جلسة الأدمن انتهت. سجل دخول مرة تانية."
    );
  }

  if (!user.email) {
    throw new Error(
      "مش قادرين نحدد إيميل حساب الأدمن."
    );
  }

  const current = String(
    currentPassword || ""
  );

  const next = String(
    newPassword || ""
  );

  if (!current) {
    throw new Error(
      "اكتب الباسورد الحالي."
    );
  }

  if (!next) {
    throw new Error(
      "اكتب الباسورد الجديد."
    );
  }

  if (next.length < 6) {
    throw new Error(
      "الباسورد الجديد لازم يكون 6 أحرف على الأقل."
    );
  }

  if (current === next) {
    throw new Error(
      "الباسورد الجديد لازم يكون مختلف عن الحالي."
    );
  }

  try {
    /*
     * Firebase بيطلب إعادة التحقق من الحساب
     * قبل تغيير كلمة المرور.
     */

    const credential =
      EmailAuthProvider.credential(
        user.email,
        current
      );

    await reauthenticateWithCredential(
      user,
      credential
    );

    /*
     * بعد نجاح إعادة التحقق،
     * نغيّر كلمة المرور.
     */

    await updatePassword(
      user,
      next
    );

    /*
     * نعمل refresh للمستخدم الحالي
     * عشان الـAuth State تفضل محدثة.
     */

    await user.reload();

    return auth.currentUser;
  } catch (error) {
    console.error(
      "Change admin password error:",
      error
    );

    let message =
      "حصل خطأ أثناء تغيير كلمة المرور.";

    switch (error?.code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        message =
          "الباسورد الحالي غير صحيح.";
        break;

      case "auth/weak-password":
        message =
          "الباسورد الجديد ضعيف. استخدم 6 أحرف على الأقل ويفضل تضيف أرقام وحروف.";
        break;

      case "auth/requires-recent-login":
        message =
          "لازم تسجل دخول من جديد قبل تغيير الباسورد.";
        break;

      case "auth/too-many-requests":
        message =
          "المحاولات كتير. حاول بعد شوية.";
        break;

      case "auth/network-request-failed":
        message =
          "مشكلة في الإنترنت. اتأكد من الاتصال وحاول تاني.";
        break;

      case "auth/user-disabled":
        message =
          "حساب الأدمن متوقف حاليًا.";
        break;

      default:
        message =
          error?.message ||
          "تعذر تغيير كلمة المرور.";
    }

    throw new Error(message);
  }
}

/**
 * =========================================================
 * تسجيل الخروج
 * =========================================================
 */

export async function logoutAdmin() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(
      "Admin logout error:",
      error
    );

    throw new Error(
      "حصل خطأ أثناء تسجيل الخروج."
    );
  }
}

/**
 * =========================================================
 * متابعة حالة تسجيل الدخول
 * =========================================================
 */

export function watchAuthState(
  callback
) {
  return onAuthStateChanged(
    auth,
    callback
  );
}

/**
 * =========================================================
 * المستخدم الحالي
 * =========================================================
 */

export function getCurrentUser() {
  return auth.currentUser;
}
