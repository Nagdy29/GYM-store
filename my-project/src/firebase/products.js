import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./config";

const PRODUCTS_COLLECTION = "products";

/*
========================================
GET ALL PRODUCTS
========================================
*/

export async function getProductsFromFirebase() {
  const productsRef = collection(
    db,
    PRODUCTS_COLLECTION
  );

  const productsQuery = query(
    productsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    productsQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/*
========================================
GET SINGLE PRODUCT
========================================
*/

export async function getProductByIdFromFirebase(
  productId
) {
  if (!productId) {
    return null;
  }

  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  );

  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/*
========================================
ADD PRODUCT
========================================
*/

export async function addProductToFirebase(
  product
) {
  const productData = {
    name: product.name?.trim() || "",

    description:
      product.description?.trim() || "",

    price: Number(product.price) || 0,

    oldPrice:
      Number(product.oldPrice) || 0,

    discount:
      Number(product.discount) || 0,

    category:
      product.category || "",

    categoryName:
      product.categoryName || "",

    /*
    الصورة URL عادي
    بدون Firebase Storage
    */

    image:
      product.image?.trim() || "",

    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : [],

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    badge:
      product.badge?.trim() || "",

    rating: 0,

    reviews: 0,

    stock:
      Number(product.stock) || 0,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

  const productsRef = collection(
    db,
    PRODUCTS_COLLECTION
  );

  const document = await addDoc(
    productsRef,
    productData
  );

  return {
    id: document.id,
    ...productData,
  };
}

/*
========================================
UPDATE PRODUCT
========================================
*/

export async function updateProductInFirebase(
  productId,
  product
) {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  );

  const productData = {
    name: product.name?.trim() || "",

    description:
      product.description?.trim() || "",

    price:
      Number(product.price) || 0,

    oldPrice:
      Number(product.oldPrice) || 0,

    discount:
      Number(product.discount) || 0,

    category:
      product.category || "",

    categoryName:
      product.categoryName || "",

    image:
      product.image?.trim() || "",

    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : [],

    colors: Array.isArray(product.colors)
      ? product.colors
      : [],

    badge:
      product.badge?.trim() || "",

    stock:
      Number(product.stock) || 0,

    updatedAt:
      serverTimestamp(),
  };

  await updateDoc(
    productRef,
    productData
  );

  return {
    id: productId,
    ...productData,
  };
}

/*
========================================
DELETE PRODUCT
========================================
*/

export async function deleteProductFromFirebase(
  productId
) {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  const productRef = doc(
    db,
    PRODUCTS_COLLECTION,
    productId
  );

  await deleteDoc(productRef);

  return true;
}