import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

/**
 * تسجيل دخول الأدمن
 */
export async function loginAdmin(email, password) {
  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    return userCredential.user;
  } catch (error) {
    let message = "حصل خطأ أثناء تسجيل الدخول.";

    switch (error.code) {
      case "auth/invalid-credential":
        message = "الإيميل أو الباسورد غير صحيح.";
        break;

      case "auth/invalid-email":
        message = "الإيميل غير صحيح.";
        break;

      case "auth/user-not-found":
        message = "الحساب غير موجود.";
        break;

      case "auth/wrong-password":
        message = "الباسورد غير صحيح.";
        break;

      case "auth/too-many-requests":
        message =
          "محاولات تسجيل الدخول كتير، حاول بعد شوية.";
        break;

      default:
        message =
          error.message || "تعذر تسجيل الدخول.";
    }

    throw new Error(message);
  }
}

/**
 * تسجيل الخروج
 */
export async function logoutAdmin() {
  await signOut(auth);
}

/**
 * متابعة حالة تسجيل الدخول
 */
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * المستخدم الحالي
 */
export function getCurrentUser() {
  return auth.currentUser;
}