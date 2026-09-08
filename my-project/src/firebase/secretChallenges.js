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
  where,
} from "firebase/firestore";

import { db } from "./config";

/*
====================================================
COLLECTIONS
====================================================
*/

const COLLECTION_NAME =
  "secretChallenges";

const CLAIMS_COLLECTION =
  "secretChallengeClaims";

const challengesRef =
  collection(
    db,
    COLLECTION_NAME
  );

const claimsRef =
  collection(
    db,
    CLAIMS_COLLECTION
  );

/*
====================================================
TEXT NORMALIZATION
====================================================
*/

function normalizeAnswer(
  value
) {
  return String(
    value || ""
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/*
====================================================
CHALLENGE CLEANER
====================================================
*/

function cleanChallengeData(
  data = {}
) {
  return {
    title: String(
      data.title || ""
    ).trim(),

    description: String(
      data.description || ""
    ).trim(),

    question: String(
      data.question || ""
    ).trim(),

    answer: normalizeAnswer(
      data.answer
    ),

    hints: Array.isArray(
      data.hints
    )
      ? data.hints
          .map(
            (
              hint,
              index
            ) => ({
              order: Number(
                hint?.order ||
                  index + 1
              ),

              text: String(
                hint?.text ||
                  ""
              ).trim(),
            })
          )
          .filter(
            (hint) =>
              hint.text
          )
      : [],

    reward: {
      type:
        data.reward?.type ||
        "percentage",

      value:
        data.reward?.value ??
        "",

      productId:
        data.reward?.productId ||
        "",

      productName:
        data.reward
          ?.productName ||
        "",
    },

    /*
     * مهم:
     * rewardRequiresOrder = true
     * يعني المكافأة مخصصة للطلب
     * وليس مكافأة منفصلة خارج Order.
     */

    rewardRequiresOrder:
      data.rewardRequiresOrder !==
      false,

    active:
      data.active === true,

    startAt:
      data.startAt || "",

    endAt:
      data.endAt || "",
  };
}

/*
====================================================
SERIALIZE
====================================================
*/

function serializeChallenge(
  id,
  data
) {
  return {
    id,
    ...data,
  };
}

/*
====================================================
GET ALL CHALLENGES
====================================================
*/

export async function getSecretChallenges() {
  try {
    const q = query(
      challengesRef,
      orderBy(
        "createdAt",
        "desc"
      )
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (item) =>
        serializeChallenge(
          item.id,
          item.data()
        )
    );
  } catch (error) {
    console.warn(
      "Secret challenges ordered query failed:",
      error
    );

    /*
     * fallback لو بعض البيانات القديمة
     * مفيهاش createdAt.
     */

    const snapshot =
      await getDocs(
        challengesRef
      );

    return snapshot.docs.map(
      (item) =>
        serializeChallenge(
          item.id,
          item.data()
        )
    );
  }
}

/*
====================================================
GET ACTIVE CHALLENGE
====================================================
*/

export async function getActiveSecretChallenge() {
  const now = new Date();

  const q = query(
    challengesRef,
    where(
      "active",
      "==",
      true
    )
  );

  const snapshot =
    await getDocs(q);

  const challenges =
    snapshot.docs
      .map((item) =>
        serializeChallenge(
          item.id,
          item.data()
        )
      )
      .filter(
        (challenge) => {
          const start =
            challenge.startAt
              ? new Date(
                  challenge.startAt
                )
              : null;

          const end =
            challenge.endAt
              ? new Date(
                  challenge.endAt
                )
              : null;

          if (
            start &&
            !Number.isNaN(
              start.getTime()
            ) &&
            now < start
          ) {
            return false;
          }

          if (
            end &&
            !Number.isNaN(
              end.getTime()
            ) &&
            now > end
          ) {
            return false;
          }

          return true;
        }
      )
      .sort((a, b) => {
        const aDate =
          a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(0);

        const bDate =
          b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(0);

        return (
          bDate.getTime() -
          aDate.getTime()
        );
      });

  return (
    challenges[0] || null
  );
}

/*
====================================================
GET BY ID
====================================================
*/

export async function getSecretChallengeById(
  id
) {
  if (!id) {
    return null;
  }

  const challengeRef =
    doc(
      db,
      COLLECTION_NAME,
      id
    );

  const snapshot =
    await getDoc(
      challengeRef
    );

  if (!snapshot.exists()) {
    return null;
  }

  return serializeChallenge(
    snapshot.id,
    snapshot.data()
  );
}

/*
====================================================
ADD
====================================================
*/

export async function addSecretChallenge(
  data
) {
  const challenge =
    cleanChallengeData(
      data
    );

  const docRef =
    await addDoc(
      challengesRef,
      {
        ...challenge,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );

  return {
    id: docRef.id,
    ...challenge,
  };
}

/*
====================================================
UPDATE
====================================================
*/

export async function updateSecretChallenge(
  id,
  data
) {
  if (!id) {
    throw new Error(
      "معرف التحدي غير موجود."
    );
  }

  const challenge =
    cleanChallengeData(
      data
    );

  const challengeRef =
    doc(
      db,
      COLLECTION_NAME,
      id
    );

  await updateDoc(
    challengeRef,
    {
      ...challenge,

      updatedAt:
        serverTimestamp(),
    }
  );

  return {
    id,
    ...challenge,
  };
}

/*
====================================================
DELETE
====================================================
*/

export async function deleteSecretChallenge(
  id
) {
  if (!id) {
    throw new Error(
      "معرف التحدي غير موجود."
    );
  }

  await deleteDoc(
    doc(
      db,
      COLLECTION_NAME,
      id
    )
  );
}

/*
====================================================
DEVICE ID
====================================================

ده معرف عشوائي بيتخزن في الجهاز.
مش بنستخدم بصمة جهاز أو بيانات شخصية.
====================================================
*/

const DEVICE_STORAGE_KEY =
  "hiraql_secret_device_id";

export function getSecretDeviceId() {
  try {
    let deviceId =
      localStorage.getItem(
        DEVICE_STORAGE_KEY
      );

    if (deviceId) {
      return deviceId;
    }

    deviceId =
      `device_${crypto.randomUUID()}`;

    localStorage.setItem(
      DEVICE_STORAGE_KEY,
      deviceId
    );

    return deviceId;
  } catch {
    /*
     * fallback للمتصفحات اللي
     * فيها مشكلة مع crypto/localStorage.
     */

    return `device_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
  }
}

/*
====================================================
LOCAL CLAIM KEY
====================================================
*/

function getLocalClaimKey(
  challengeId
) {
  return `hiraql_secret_claim_${challengeId}`;
}

/*
====================================================
CHECK DEVICE CLAIM
====================================================
*/

export async function getSecretChallengeClaim(
  challengeId
) {
  if (!challengeId) {
    return null;
  }

  const deviceId =
    getSecretDeviceId();

  /*
   * الأول نراجع localStorage
   * عشان الاستجابة تكون سريعة.
   */

  try {
    const localData =
      localStorage.getItem(
        getLocalClaimKey(
          challengeId
        )
      );

    if (localData) {
      return JSON.parse(
        localData
      );
    }
  } catch {
    // تجاهل localStorage error
  }

  /*
   * بعد كده نراجع Firebase.
   */

  try {
    const q = query(
      claimsRef,
      where(
        "challengeId",
        "==",
        challengeId
      ),
      where(
        "deviceId",
        "==",
        deviceId
      )
    );

    const snapshot =
      await getDocs(q);

    if (
      snapshot.empty
    ) {
      return null;
    }

    const item =
      snapshot.docs[0];

    const claim = {
      id: item.id,
      ...item.data(),
    };

    try {
      localStorage.setItem(
        getLocalClaimKey(
          challengeId
        ),
        JSON.stringify(
          claim
        )
      );
    } catch {
      // تجاهل
    }

    return claim;
  } catch (error) {
    console.error(
      "Get secret claim error:",
      error
    );

    return null;
  }
}

/*
====================================================
CREATE CLAIM
====================================================

تتعمل مرة واحدة فقط للجهاز.
====================================================
*/

export async function createSecretChallengeClaim(
  challenge,
  answer
) {
  if (!challenge?.id) {
    throw new Error(
      "التحدي غير موجود."
    );
  }

  const deviceId =
    getSecretDeviceId();

  const normalizedAnswer =
    normalizeAnswer(
      answer
    );

  const correctAnswer =
    normalizeAnswer(
      challenge.answer
    );

  /*
   * أول حاجة:
   * نتأكد إن الإجابة صحيحة.
   */

  if (
    !normalizedAnswer ||
    normalizedAnswer !==
      correctAnswer
  ) {
    return {
      success: false,
      reason: "wrong-answer",
    };
  }

  /*
   * ثاني حاجة:
   * نتأكد إن الجهاز أخد مكافأة قبل كده.
   */

  const existingClaim =
    await getSecretChallengeClaim(
      challenge.id
    );

  if (existingClaim) {
    return {
      success: false,
      reason: "already-claimed",
      claim: existingClaim,
    };
  }

  /*
   * كود الخصم.
   *
   * ده مش خصم مكتمل لوحده.
   * بيبقى Pending لحد ما يدخل في Order.
   */

  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  const timePart =
    Date.now()
      .toString(36)
      .slice(-4)
      .toUpperCase();

  const couponCode =
    `HIRAQL-${randomPart}-${timePart}`;

  const claimData = {
    challengeId:
      challenge.id,

    challengeTitle:
      challenge.title ||
      "",

    deviceId,

    couponCode,

    reward:
      challenge.reward ||
      {
        type: "percentage",
        value: "",
      },

    status: "pending",

    /*
     * لازم Order عشان الخصم يتفعل.
     */

    requiresOrder: true,

    orderId: "",

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

  /*
   * نعمل Check أخير في Firebase.
   *
   * ملاحظة:
   * للتنفيذ الأمني الأقوى لازم Firestore Rules
   * تمنع duplicate claims لنفس challenge/device.
   */

  const q = query(
    claimsRef,
    where(
      "challengeId",
      "==",
      challenge.id
    ),
    where(
      "deviceId",
      "==",
      deviceId
    )
  );

  const snapshot =
    await getDocs(q);

  if (
    !snapshot.empty
  ) {
    const existing =
      snapshot.docs[0];

    const existingClaim = {
      id: existing.id,
      ...existing.data(),
    };

    return {
      success: false,
      reason: "already-claimed",
      claim: existingClaim,
    };
  }

  const claimRef =
    await addDoc(
      claimsRef,
      claimData
    );

  const claim = {
    id: claimRef.id,
    ...claimData,
  };

  /*
   * نحفظ النتيجة محليًا.
   */

  try {
    localStorage.setItem(
      getLocalClaimKey(
        challenge.id
      ),
      JSON.stringify(
        claim
      )
    );
  } catch {
    // تجاهل
  }

  return {
    success: true,
    claim,
  };
}

/*
====================================================
GET PENDING CLAIMS
====================================================
*/

export async function getPendingSecretClaims() {
  const deviceId =
    getSecretDeviceId();

  const q = query(
    claimsRef,
    where(
      "deviceId",
      "==",
      deviceId
    ),
    where(
      "status",
      "==",
      "pending"
    )
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}

/*
====================================================
GET CLAIM BY COUPON CODE
====================================================
*/

export async function getSecretClaimByCouponCode(
  couponCode
) {
  const code =
    String(
      couponCode || ""
    )
      .trim()
      .toUpperCase();

  if (!code) {
    return null;
  }

  const q = query(
    claimsRef,
    where(
      "couponCode",
      "==",
      code
    )
  );

  const snapshot =
    await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const item =
    snapshot.docs[0];

  return {
    id: item.id,
    ...item.data(),
  };
}

/*
====================================================
MARK CLAIM AS USED
====================================================

دي المفروض تتنادى بعد نجاح إنشاء Order.
====================================================
*/

export async function markSecretClaimAsUsed(
  claimId,
  orderId
) {
  if (!claimId) {
    throw new Error(
      "معرف المكافأة غير موجود."
    );
  }

  if (!orderId) {
    throw new Error(
      "معرف الطلب غير موجود."
    );
  }

  const claimRef =
    doc(
      db,
      CLAIMS_COLLECTION,
      claimId
    );

  await updateDoc(
    claimRef,
    {
      status: "used",
      orderId,

      usedAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    }
  );

  /*
   * نمسح النسخة المحلية
   * عشان الجهاز يعرف إن المكافأة
   * خلاص اتستخدمت.
   */

  try {
    const current =
      await getDoc(
        claimRef
      );

    if (current.exists()) {
      const data =
        current.data();

      if (
        data.challengeId
      ) {
        localStorage.removeItem(
          getLocalClaimKey(
            data.challengeId
          )
        );
      }
    }
  } catch {
    // تجاهل
  }

  return true;
}
