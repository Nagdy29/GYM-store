import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./config";

const CATEGORIES_COLLECTION = "categories";

/**
 * جلب الأقسام من Firebase
 */
export async function getCategoriesFromFirebase() {
  const categoriesRef = collection(
    db,
    CATEGORIES_COLLECTION
  );

  try {
    const categoriesQuery = query(
      categoriesRef,
      orderBy("createdAt", "asc")
    );

    const snapshot =
      await getDocs(
        categoriesQuery
      );

    return snapshot.docs.map(
      (item) => ({
        id: item.id,
        ...item.data(),
      })
    );
  } catch (error) {
    console.error(
      "Get Categories Firebase Error:",
      error
    );

    /*
     * في حالة وجود بيانات قديمة بدون createdAt
     * نحاول جلب الأقسام بدون orderBy.
     */
    const snapshot =
      await getDocs(
        categoriesRef
      );

    return snapshot.docs.map(
      (item) => ({
        id: item.id,
        ...item.data(),
      })
    );
  }
}

/**
 * إضافة قسم
 */
export async function addCategoryToFirebase(
  category
) {
  const categoryData = {
    name:
      String(
        category?.name || ""
      ).trim(),

    slug:
      String(
        category?.slug || ""
      ).trim(),

    description:
      String(
        category?.description || ""
      ).trim(),

    image:
      String(
        category?.image || ""
      ).trim(),

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

  const categoriesRef =
    collection(
      db,
      CATEGORIES_COLLECTION
    );

  const document =
    await addDoc(
      categoriesRef,
      categoryData
    );

  return {
    id: document.id,
    ...categoryData,
  };
}

/**
 * تعديل قسم
 */
export async function updateCategoryInFirebase(
  categoryId,
  category
) {
  if (!categoryId) {
    throw new Error(
      "معرف القسم غير موجود."
    );
  }

  const categoryRef =
    doc(
      db,
      CATEGORIES_COLLECTION,
      categoryId
    );

  const categoryData = {
    name:
      String(
        category?.name || ""
      ).trim(),

    slug:
      String(
        category?.slug || ""
      ).trim(),

    description:
      String(
        category?.description || ""
      ).trim(),

    image:
      String(
        category?.image || ""
      ).trim(),

    updatedAt:
      serverTimestamp(),
  };

  console.log(
    "Updating category:",
    {
      id: categoryId,
      data: categoryData,
    }
  );

  await updateDoc(
    categoryRef,
    categoryData
  );

  return {
    id: categoryId,
    ...categoryData,
  };
}

/**
 * حذف قسم
 */
export async function deleteCategoryFromFirebase(
  categoryId
) {
  if (!categoryId) {
    throw new Error(
      "معرف القسم غير موجود."
    );
  }

  const categoryRef =
    doc(
      db,
      CATEGORIES_COLLECTION,
      categoryId
    );

  await deleteDoc(
    categoryRef
  );

  return true;
}