import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./config";

const ORDERS_COLLECTION = "orders";

export const ORDER_STATUSES = [
  {
    value: "pending",
    label: "قيد المراجعة",
  },
  {
    value: "confirmed",
    label: "تم التأكيد",
  },
  {
    value: "processing",
    label: "جاري التجهيز",
  },
  {
    value: "shipped",
    label: "تم الشحن",
  },
  {
    value: "delivered",
    label: "تم التسليم",
  },
  {
    value: "cancelled",
    label: "ملغي",
  },
];

export function getOrderStatusLabel(status) {
  const found = ORDER_STATUSES.find(
    (item) => item.value === status
  );

  return found?.label || "قيد المراجعة";
}

export async function addOrderToFirebase(order) {
  const orderData = {
    orderNumber:
      order.orderNumber ||
      order.id ||
      `ZG-${Date.now()}`,

    customer: {
      name:
        order.customer?.name?.trim() || "",

      phone:
        order.customer?.phone?.trim() || "",

      governorate:
        order.customer?.governorate?.trim() || "",

      address:
        order.customer?.address?.trim() || "",

      notes:
        order.customer?.notes?.trim() || "",
    },

    payment: order.payment || "cod",

    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          id: item.id || "",
          name: item.name || "",
          price: Number(item.price) || 0,
          image: item.image || "",
          size: item.size || null,
          color: item.color || null,
          quantity:
            Number(item.quantity) || 1,
        }))
      : [],

    subtotal:
      Number(order.subtotal) || 0,

    shipping:
      Number(order.shipping) || 0,

    total:
      Number(order.total) || 0,

    status:
      order.status || "pending",

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

  const ordersRef =
    collection(
      db,
      ORDERS_COLLECTION
    );

  const document =
    await addDoc(
      ordersRef,
      orderData
    );

  return {
    id: document.id,
    ...orderData,
  };
}

export async function getOrdersFromFirebase() {
  const ordersRef =
    collection(
      db,
      ORDERS_COLLECTION
    );

  const ordersQuery =
    query(
      ordersRef,
      orderBy(
        "createdAt",
        "desc"
      )
    );

  const snapshot =
    await getDocs(
      ordersQuery
    );

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}

/**
 * متابعة الطلبات بشكل لحظي.
 *
 * callback:
 * (orders, changes) => {}
 *
 * changes فيها الطلبات الجديدة/المعدلة/المحذوفة.
 */
export function subscribeToOrders(
  callback,
  onError
) {
  const ordersRef =
    collection(
      db,
      ORDERS_COLLECTION
    );

  const ordersQuery =
    query(
      ordersRef,
      orderBy(
        "createdAt",
        "desc"
      )
    );

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders =
        snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

      const changes =
        snapshot.docChanges().map(
          (change) => ({
            type:
              change.type,
            order: {
              id:
                change.doc.id,
              ...change.doc.data(),
            },
          })
        );

      callback(
        orders,
        changes
      );
    },
    (error) => {
      console.error(
        "Orders realtime listener error:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );
}

export async function updateOrderStatusInFirebase(
  orderId,
  status
) {
  if (!orderId) {
    throw new Error(
      "رقم الطلب غير موجود."
    );
  }

  const allowedStatus =
    ORDER_STATUSES.some(
      (item) =>
        item.value === status
    );

  if (!allowedStatus) {
    throw new Error(
      "حالة الطلب غير صحيحة."
    );
  }

  const orderRef =
    doc(
      db,
      ORDERS_COLLECTION,
      orderId
    );

  await updateDoc(
    orderRef,
    {
      status,
      updatedAt:
        serverTimestamp(),
    }
  );

  return true;
}

export async function deleteOrderFromFirebase(
  orderId
) {
  if (!orderId) {
    throw new Error(
      "رقم الطلب غير موجود."
    );
  }

  const orderRef =
    doc(
      db,
      ORDERS_COLLECTION,
      orderId
    );

  await deleteDoc(
    orderRef
  );

  return true;
}