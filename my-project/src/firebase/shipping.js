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

const SHIPPING_COLLECTION =
  "shippingRates";

/*
=========================================================
المحافظات المصرية الأساسية
=========================================================
*/

export const EGYPT_GOVERNORATES = [
  {
    name: "القاهرة",
    shippingPrice: 60,
  },
  {
    name: "الجيزة",
    shippingPrice: 60,
  },
  {
    name: "القليوبية",
    shippingPrice: 65,
  },
  {
    name: "الإسكندرية",
    shippingPrice: 70,
  },
  {
    name: "البحيرة",
    shippingPrice: 75,
  },
  {
    name: "مطروح",
    shippingPrice: 90,
  },
  {
    name: "كفر الشيخ",
    shippingPrice: 75,
  },
  {
    name: "الغربية",
    shippingPrice: 70,
  },
  {
    name: "المنوفية",
    shippingPrice: 70,
  },
  {
    name: "الدقهلية",
    shippingPrice: 75,
  },
  {
    name: "دمياط",
    shippingPrice: 75,
  },
  {
    name: "الشرقية",
    shippingPrice: 70,
  },
  {
    name: "الإسماعيلية",
    shippingPrice: 75,
  },
  {
    name: "بورسعيد",
    shippingPrice: 80,
  },
  {
    name: "السويس",
    shippingPrice: 75,
  },
  {
    name: "شمال سيناء",
    shippingPrice: 100,
  },
  {
    name: "جنوب سيناء",
    shippingPrice: 100,
  },
  {
    name: "الفيوم",
    shippingPrice: 75,
  },
  {
    name: "بني سويف",
    shippingPrice: 80,
  },
  {
    name: "المنيا",
    shippingPrice: 85,
  },
  {
    name: "أسيوط",
    shippingPrice: 90,
  },
  {
    name: "سوهاج",
    shippingPrice: 95,
  },
  {
    name: "قنا",
    shippingPrice: 100,
  },
  {
    name: "الأقصر",
    shippingPrice: 100,
  },
  {
    name: "أسوان",
    shippingPrice: 110,
  },
  {
    name: "البحر الأحمر",
    shippingPrice: 110,
  },
  {
    name: "الوادي الجديد",
    shippingPrice: 120,
  },
];

/*
=========================================================
GET SHIPPING RATES
=========================================================
*/

export async function getShippingRates() {
  const shippingRef =
    collection(
      db,
      SHIPPING_COLLECTION
    );

  try {
    const shippingQuery =
      query(
        shippingRef,
        orderBy("name", "asc")
      );

    const snapshot =
      await getDocs(
        shippingQuery
      );

    return snapshot.docs.map(
      (item) => ({
        id: item.id,
        ...item.data(),
      })
    );
  } catch (error) {
    console.error(
      "Shipping ordered query error:",
      error
    );

    const snapshot =
      await getDocs(
        shippingRef
      );

    return snapshot.docs
      .map((item) => ({
        id: item.id,
        ...item.data(),
      }))
      .sort((a, b) =>
        String(
          a.name || ""
        ).localeCompare(
          String(
            b.name || ""
          ),
          "ar"
        )
      );
  }
}

/*
=========================================================
GET ONE SHIPPING RATE
=========================================================
*/

export async function getShippingRateByGovernorate(
  governorate
) {
  const rates =
    await getShippingRates();

  const cleanName =
    String(
      governorate || ""
    )
      .trim()
      .toLowerCase();

  return (
    rates.find(
      (item) =>
        String(
          item.name || ""
        )
          .trim()
          .toLowerCase() ===
        cleanName &&
        item.active !== false
    ) || null
  );
}

/*
=========================================================
ADD SHIPPING RATE
=========================================================
*/

export async function addShippingRate(
  shippingData
) {
  const name = String(
    shippingData?.name || ""
  ).trim();

  const price = Number(
    shippingData?.shippingPrice
  );

  if (!name) {
    throw new Error(
      "اسم المحافظة مطلوب."
    );
  }

  if (
    Number.isNaN(price) ||
    price < 0
  ) {
    throw new Error(
      "سعر الشحن غير صحيح."
    );
  }

  const shippingRef =
    collection(
      db,
      SHIPPING_COLLECTION
    );

  const document =
    await addDoc(
      shippingRef,
      {
        name,
        shippingPrice:
          price,
        active:
          shippingData?.active !==
          false,
        createdAt:
          serverTimestamp(),
        updatedAt:
          serverTimestamp(),
      }
    );

  return {
    id: document.id,
    name,
    shippingPrice: price,
    active:
      shippingData?.active !==
      false,
  };
}

/*
=========================================================
UPDATE SHIPPING RATE
=========================================================
*/

export async function updateShippingRate(
  shippingId,
  shippingData
) {
  if (!shippingId) {
    throw new Error(
      "رقم المحافظة غير موجود."
    );
  }

  const name = String(
    shippingData?.name || ""
  ).trim();

  const price = Number(
    shippingData?.shippingPrice
  );

  if (!name) {
    throw new Error(
      "اسم المحافظة مطلوب."
    );
  }

  if (
    Number.isNaN(price) ||
    price < 0
  ) {
    throw new Error(
      "سعر الشحن غير صحيح."
    );
  }

  const shippingRef =
    doc(
      db,
      SHIPPING_COLLECTION,
      shippingId
    );

  await updateDoc(
    shippingRef,
    {
      name,
      shippingPrice:
        price,
      active:
        shippingData?.active !==
        false,
      updatedAt:
        serverTimestamp(),
    }
  );

  return true;
}

/*
=========================================================
DELETE SHIPPING RATE
=========================================================
*/

export async function deleteShippingRate(
  shippingId
) {
  if (!shippingId) {
    throw new Error(
      "رقم المحافظة غير موجود."
    );
  }

  const shippingRef =
    doc(
      db,
      SHIPPING_COLLECTION,
      shippingId
    );

  await deleteDoc(
    shippingRef
  );

  return true;
}

/*
=========================================================
TOGGLE SHIPPING RATE
=========================================================
*/

export async function toggleShippingRate(
  shippingId,
  active
) {
  if (!shippingId) {
    throw new Error(
      "رقم المحافظة غير موجود."
    );
  }

  const shippingRef =
    doc(
      db,
      SHIPPING_COLLECTION,
      shippingId
    );

  await updateDoc(
    shippingRef,
    {
      active:
        Boolean(active),

      updatedAt:
        serverTimestamp(),
    }
  );

  return true;
}

/*
=========================================================
SEED DEFAULT GOVERNORATES
=========================================================
*/

export async function seedDefaultShippingRates() {
  const currentRates =
    await getShippingRates();

  const existingNames =
    new Set(
      currentRates.map(
        (item) =>
          String(
            item.name || ""
          )
            .trim()
            .toLowerCase()
      )
    );

  let addedCount = 0;

  for (
    const governorate of
      EGYPT_GOVERNORATES
  ) {
    const normalizedName =
      governorate.name
        .trim()
        .toLowerCase();

    if (
      existingNames.has(
        normalizedName
      )
    ) {
      continue;
    }

    await addShippingRate({
      name:
        governorate.name,

      shippingPrice:
        governorate.shippingPrice,

      active: true,
    });

    addedCount += 1;
  }

  return {
    addedCount,
  };
}
