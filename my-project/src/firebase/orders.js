import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./config";

const ORDERS_COLLECTION =
  "orders";

const CLAIMS_COLLECTION =
  "secretChallengeClaims";

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

export function getOrderStatusLabel(
  status
) {
  const found =
    ORDER_STATUSES.find(
      (item) =>
        item.value === status
    );

  return (
    found?.label ||
    "قيد المراجعة"
  );
}

/*
=========================================================
CLEAN ORDER DATA
=========================================================
*/

function buildOrderData(order) {
  return {
    orderNumber:
      order.orderNumber ||
      order.id ||
      `HRQL-${Date.now()}`,

    customer: {
      name:
        order.customer?.name
          ?.trim() || "",

      phone:
        order.customer?.phone
          ?.trim() || "",

      governorate:
        order.customer?.governorate
          ?.trim() || "",

      address:
        order.customer?.address
          ?.trim() || "",

      notes:
        order.customer?.notes
          ?.trim() || "",
    },

    /*
     * المحافظة وسعر الشحن وقت الطلب.
     */

    shippingGovernorate:
      order.shippingGovernorate ||
      order.customer?.governorate ||
      "",

    payment:
      order.payment || "cod",

    items:
      Array.isArray(order.items)
        ? order.items.map(
            (item) => ({
              id:
                item.id || "",

              name:
                item.name || "",

              price:
                Number(
                  item.price
                ) || 0,

              image:
                item.image || "",

              size:
                item.size ||
                null,

              color:
                item.color ||
                null,

              quantity:
                Number(
                  item.quantity
                ) || 1,
            })
          )
        : [],

    subtotal:
      Number(
        order.subtotal
      ) || 0,

    shipping:
      Number(
        order.shipping
      ) || 0,

    /*
     * سعر الشحن قبل المكافأة.
     * مفيد جدًا لو المكافأة شحن مجاني.
     */

    shippingBeforeReward:
      Number(
        order.shippingBeforeReward
      ) || 0,

    /*
     * الخصم الفعلي بالجنيه.
     */

    discount:
      Number(
        order.discount
      ) || 0,

    /*
     * الإجمالي قبل الخصم/المكافأة.
     */

    originalTotal:
      Number(
        order.originalTotal
      ) || 0,

    /*
     * الإجمالي النهائي المدفوع.
     */

    total:
      Number(
        order.total
      ) || 0,

    /*
     * Snapshot كامل للمكافأة وقت الطلب.
     *
     * مهم:
     * إحنا بنحفظ بيانات المكافأة نفسها
     * داخل Order عشان لو الأدمن عدل التحدي
     * بعد كده، الطلب القديم يفضل محتفظ
     * بالمعلومة اللي حصلت وقت الشراء.
     */

    secretReward:
      order.secretReward
        ? {
            claimId:
              order.secretReward
                .claimId || "",

            challengeId:
              order.secretReward
                .challengeId || "",

            challengeTitle:
              order.secretReward
                .challengeTitle || "",

            couponCode:
              order.secretReward
                .couponCode || "",

            rewardType:
              order.secretReward
                .rewardType || "",

            rewardValue:
              order.secretReward
                .rewardValue ??
              null,

            rewardProductId:
              order.secretReward
                .rewardProductId || "",

            rewardProductName:
              order.secretReward
                .rewardProductName || "",

            discount:
              Number(
                order.secretReward
                  .discount
              ) || 0,

            freeShipping:
              Boolean(
                order.secretReward
                  .freeShipping
              ),

            used:
              order.secretReward
                .used !== false,
          }
        : null,

    status:
      order.status ||
      "pending",

    adminNotificationSeen:
      false,

    adminNotificationSeenAt:
      null,

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };
}

/*
=========================================================
ADD ORDER
=========================================================

لو الطلب فيه secretReward + claimId:
- بنقرأ الـ Claim داخل Transaction.
- لازم يكون pending.
- بننشئ الطلب.
- بنغير الـ Claim إلى used.
- الاتنين يتموا مع بعض.

وبالتالي مينفعش نفس المكافأة تدخل في طلبين.
=========================================================
*/

export async function addOrderToFirebase(
  order
) {
  const orderData =
    buildOrderData(order);

  const ordersRef =
    collection(
      db,
      ORDERS_COLLECTION
    );

  const claimId =
    order.secretReward
      ?.claimId || "";

  /*
   * ======================================================
   * ORDER WITHOUT SECRET REWARD
   * ======================================================
   */

  if (!claimId) {
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
   * ======================================================
   * ORDER WITH SECRET REWARD
   * ======================================================
   */

  const claimRef =
    doc(
      db,
      CLAIMS_COLLECTION,
      claimId
    );

  const orderRef =
    doc(ordersRef);

  await runTransaction(
    db,
    async (transaction) => {
      const claimSnapshot =
        await transaction.get(
          claimRef
        );

      if (
        !claimSnapshot.exists()
      ) {
        const error =
          new Error(
            "المكافأة غير موجودة."
          );

        error.code =
          "SECRET_CLAIM_NOT_FOUND";

        throw error;
      }

      const claim =
        claimSnapshot.data();

      /*
       * المكافأة مستخدمة بالفعل.
       */

      if (
        claim.status ===
        "used"
      ) {
        const error =
          new Error(
            "المكافأة مستخدمة بالفعل في طلب سابق."
          );

        error.code =
          "SECRET_CLAIM_ALREADY_USED";

        throw error;
      }

      /*
       * لازم تكون Pending.
       */

      if (
        claim.status !==
        "pending"
      ) {
        const error =
          new Error(
            "المكافأة غير متاحة للاستخدام حاليًا."
          );

        error.code =
          "SECRET_CLAIM_NOT_PENDING";

        throw error;
      }

      /*
       * تأكيد إن الكود الموجود في الطلب
       * هو نفس الكود الموجود في Firebase.
       */

      if (
        claim.couponCode &&
        order.secretReward
          ?.couponCode &&
        String(
          claim.couponCode
        ).toUpperCase() !==
          String(
            order.secretReward
              .couponCode
          ).toUpperCase()
      ) {
        const error =
          new Error(
            "كود المكافأة غير مطابق."
          );

        error.code =
          "SECRET_CLAIM_CODE_MISMATCH";

        throw error;
      }

      /*
       * نثبت المكافأة داخل الطلب
       * قبل الحفظ.
       */

      const finalSecretReward =
        {
          ...(orderData.secretReward ||
            {}),

          claimId,

          challengeId:
            claim.challengeId ||
            orderData
              .secretReward
              ?.challengeId ||
            "",

          challengeTitle:
            claim.challengeTitle ||
            orderData
              .secretReward
              ?.challengeTitle ||
            "",

          couponCode:
            claim.couponCode ||
            orderData
              .secretReward
              ?.couponCode ||
            "",

          rewardType:
            claim.reward?.type ||
            orderData
              .secretReward
              ?.rewardType ||
            "",

          rewardValue:
            claim.reward?.value ??
            orderData
              .secretReward
              ?.rewardValue ??
            null,

          rewardProductId:
            claim.reward
              ?.productId ||
            orderData
              .secretReward
              ?.rewardProductId ||
            "",

          rewardProductName:
            claim.reward
              ?.productName ||
            orderData
              .secretReward
              ?.rewardProductName ||
            "",

          discount:
            Number(
              orderData
                .secretReward
                ?.discount
            ) || 0,

          freeShipping:
            Boolean(
              orderData
                .secretReward
                ?.freeShipping
            ),

          used: true,
        };

      /*
       * نعمل نسخة نهائية من الطلب
       * بالمكافأة المؤكدة من Firebase.
       */

      const finalOrderData = {
        ...orderData,

        secretReward:
          finalSecretReward,

        discount:
          Number(
            finalSecretReward.discount
          ) || 0,
      };

      /*
       * أولًا ننشئ الطلب.
       */

      transaction.set(
        orderRef,
        finalOrderData
      );

      /*
       * ثم نقفل الـ Claim.
       */

      transaction.update(
        claimRef,
        {
          status: "used",

          orderId:
            orderRef.id,

          usedAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );
    }
  );

  /*
   * إزالة نسخة المكافأة المحلية.
   */

  try {
    if (
      order.secretReward
        ?.challengeId
    ) {
      localStorage.removeItem(
        `hiraql_secret_claim_${order.secretReward.challengeId}`
      );
    }
  } catch {
    // تجاهل
  }

  return {
    id: orderRef.id,
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
          a.createdAt?.seconds ||
          0;

        const bTime =
          b.createdAt?.seconds ||
          0;

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
