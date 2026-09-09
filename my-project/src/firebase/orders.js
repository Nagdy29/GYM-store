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

/*
=========================================================
ADD ORDER
=========================================================
*/

export async function addOrderToFirebase(order) {
  const orderData = {
    orderNumber:
      order.orderNumber ||
      order.id ||
      `HRQL-${Date.now()}`,

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

    payment:
      order.payment || "cod",

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

    discount:
      Number(order.discount) || 0,

    originalTotal:
      Number(order.originalTotal) || 0,

    total:
      Number(order.total) || 0,

    secretReward:
      order.secretReward || null,

    status:
      order.status || "pending",

    /*
     * ==================================================
     * ADMIN NOTIFICATION
     * ==================================================
     *
     * الطلب الجديد يبدأ Unread.
     *
     * مجرد ظهور الإشعار أو اختفائه من الشاشة
     * لا يحذف الطلب.
     *
     * لما الأدمن يشوفه، هنغير:
     * adminNotificationSeen = true
     */

    adminNotificationSeen: false,

    adminNotificationSeenAt: null,

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

/*
=========================================================
GET ORDERS
=========================================================
*/

export async function getOrdersFromFirebase() {
  const ordersRef =
    collection(
      db,
      ORDERS_COLLECTION
    );

  try {
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
  } catch (error) {
    console.error(
      "Ordered orders query failed:",
      error
    );

    const snapshot =
      await getDocs(
        ordersRef
      );

    const orders =
      snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

    return orders.sort(
      (a, b) => {
        const aTime =
          a.createdAt?.seconds || 0;

        const bTime =
          b.createdAt?.seconds || 0;

        return (
          bTime - aTime
        );
      }
    );
  }
}

/*
=========================================================
REALTIME ORDERS
=========================================================
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

/*
=========================================================
MARK ORDER NOTIFICATION AS SEEN
=========================================================
*/

export async function markOrderNotificationAsSeen(
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

  await updateDoc(
    orderRef,
    {
      /*
       * الطلب يفضل موجود.
       * إحنا بنغير حالة الإشعار فقط.
       */

      adminNotificationSeen:
        true,

      adminNotificationSeenAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );

  return true;
}

/*
=========================================================
UPDATE ORDER STATUS
=========================================================
*/

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

/*
=========================================================
DELETE ORDER
=========================================================
*/

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
