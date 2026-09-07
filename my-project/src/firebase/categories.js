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
 * جلب الأقسام
 */
export async function getCategoriesFromFirebase() {
  const categoriesRef = collection(
    db,
    CATEGORIES_COLLECTION
  );

  const categoriesQuery = query(
    categoriesRef,
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(categoriesQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/**
 * إضافة قسم
 */
export async function addCategoryToFirebase(category) {
  const categoryData = {
    name: category.name || "",
    slug: category.slug || "",
    description: category.description || "",
    image: category.image || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const categoriesRef = collection(
    db,
    CATEGORIES_COLLECTION
  );

  const document = await addDoc(
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
  const categoryRef = doc(
    db,
    CATEGORIES_COLLECTION,
    categoryId
  );

  const categoryData = {
    name: category.name || "",
    slug: category.slug || "",
    description: category.description || "",
    image: category.image || "",
    updatedAt: serverTimestamp(),
  };

  await updateDoc(categoryRef, categoryData);

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
  const categoryRef = doc(
    db,
    CATEGORIES_COLLECTION,
    categoryId
  );

  await deleteDoc(categoryRef);

  return true;
}