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

  try {
    /*
     * نحاول الأول نجيب المنتجات مرتبة
     * حسب تاريخ الإضافة.
     */

    const productsQuery = query(
      productsRef,
      orderBy("createdAt", "desc")
    );

    const snapshot =
      await getDocs(productsQuery);

    return snapshot.docs.map(
      (item) => ({
        id: item.id,
        ...item.data(),
      })
    );
  } catch (error) {
    console.warn(
      "Products ordered query failed, loading without orderBy:",
      error
    );

    /*
     * fallback
     *
     * لو فيه منتجات قديمة بدون createdAt
     * أو حصلت مشكلة في orderBy،
     * نجيب كل المنتجات عادي.
     */

    const snapshot =
      await getDocs(productsRef);

    const products =
      snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

    /*
     * ترتيب يدوي من الأحدث للأقدم
     * لو createdAt موجود.
     */

    products.sort(
      (a, b) => {
        const aSeconds =
          a?.createdAt?.seconds ||
          0;

        const bSeconds =
          b?.createdAt?.seconds ||
          0;

        return (
          bSeconds -
          aSeconds
        );
      }
    );

    return products;
  }
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

  try {
    const productRef =
      doc(
        db,
        PRODUCTS_COLLECTION,
        productId
      );

    const snapshot =
      await getDoc(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    throw error;
  }
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
    name:
      String(
        product?.name || ""
      ).trim(),

    description:
      String(
        product?.description || ""
      ).trim(),

    price:
      Number(product?.price) || 0,

    oldPrice:
      Number(
        product?.oldPrice
      ) || 0,

    discount:
      Number(
        product?.discount
      ) || 0,

    /*
     * هنا بنحفظ Firebase Category ID
     */

    category:
      String(
        product?.category || ""
      ).trim(),

    categoryName:
      String(
        product?.categoryName || ""
      ).trim(),

    /*
     * رابط الصورة
     */

    image:
      String(
        product?.image || ""
      ).trim(),

    sizes:
      Array.isArray(
        product?.sizes
      )
        ? product.sizes
        : [],

    colors:
      Array.isArray(
        product?.colors
      )
        ? product.colors
        : [],

    badge:
      String(
        product?.badge || ""
      ).trim(),

    /*
     * التقييمات تبدأ من صفر
     */

    rating: 0,

    reviews: 0,

    stock:
      Number(
        product?.stock
      ) || 0,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

  const productsRef =
    collection(
      db,
      PRODUCTS_COLLECTION
    );

  const document =
    await addDoc(
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

  const productRef =
    doc(
      db,
      PRODUCTS_COLLECTION,
      productId
    );

  const productData = {
    name:
      String(
        product?.name || ""
      ).trim(),

    description:
      String(
        product?.description || ""
      ).trim(),

    price:
      Number(product?.price) || 0,

    oldPrice:
      Number(
        product?.oldPrice
      ) || 0,

    discount:
      Number(
        product?.discount
      ) || 0,

    category:
      String(
        product?.category || ""
      ).trim(),

    categoryName:
      String(
        product?.categoryName || ""
      ).trim(),

    image:
      String(
        product?.image || ""
      ).trim(),

    sizes:
      Array.isArray(
        product?.sizes
      )
        ? product.sizes
        : [],

    colors:
      Array.isArray(
        product?.colors
      )
        ? product.colors
        : [],

    badge:
      String(
        product?.badge || ""
      ).trim(),

    stock:
      Number(
        product?.stock
      ) || 0,

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

  const productRef =
    doc(
      db,
      PRODUCTS_COLLECTION,
      productId
    );

  await deleteDoc(
    productRef
  );

  return true;
}
