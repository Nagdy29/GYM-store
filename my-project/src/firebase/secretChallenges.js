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

function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeBoolean(
  value,
  defaultValue = false
) {
  if (typeof value === "boolean") {
    return value;
  }

  if (
    value === "true" ||
    value === 1 ||
    value === "1" ||
    value === "yes"
  ) {
    return true;
  }

  if (
    value === "false" ||
    value === 0 ||
    value === "0" ||
    value === "no"
  ) {
    return false;
  }

  return defaultValue;
}

function normalizeYear(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const year = Number(value);

  if (!Number.isInteger(year)) {
    return "";
  }

  return year;
}

function cleanChallengeData(
  data = {}
) {
  const question =
    String(
      data.question ?? ""
    ).trim();

  const title =
    String(
      data.title ?? ""
    ).trim();

  const description =
    String(
      data.description ?? ""
    ).trim();

  const answer =
    normalizeAnswer(
      data.answer
    );

  const year =
    normalizeYear(
      data.year
    );

  const hints =
    Array.isArray(
      data.hints
    )
      ? data.hints
          .map(
            (hint, index) => {
              if (
                typeof hint ===
                "string"
              ) {
                return {
                  order:
                    index + 1,
                  text:
                    hint.trim(),
                };
              }

              return {
                order: Number(
                  hint?.order ||
                    index + 1
                ),
                text: String(
                  hint?.text ?? ""
                ).trim(),
              };
            }
          )
          .filter(
            (hint) =>
              hint.text
          )
      : [];

  const rewardType =
    data.reward?.type ||
    "percentage";

  const rewardValue =
    data.reward?.value ??
    "";

  const productId =
    String(
      data.reward?.productId ??
        ""
    ).trim();

  const productName =
    String(
      data.reward?.productName ??
        ""
    ).trim();

  const customRewardText =
    String(
      data.reward
        ?.customRewardText ??
        ""
    ).trim();

  const active =
    normalizeBoolean(
      data.active,
      false
    );

  const startAt =
    String(
      data.startAt ?? ""
    ).trim();

  const endAt =
    String(
      data.endAt ?? ""
    ).trim();

  return {
    title,

    description,

    year,

    question,

    answer,

    hints,

    reward: {
      type:
        rewardType,

      value:
        rewardValue,

      productId,

      productName,

      customRewardText,
    },

    active,

    startAt,

    endAt,
  };
}

function serializeChallenge(
  id,
  data = {}
) {
  return {
    id,

    ...data,

    question: String(
      data.question ?? ""
    ).trim(),

    year:
      data.year !==
        undefined &&
      data.year !== null &&
      data.year !== ""
        ? Number(data.year)
        : "",

    reward: {
      type:
        data.reward?.type ||
        "percentage",

      value:
        data.reward?.value ??
        "",

      productId:
        String(
          data.reward?.productId ??
            ""
        ).trim(),

      productName:
        String(
          data.reward?.productName ??
            ""
        ).trim(),

      customRewardText:
        String(
          data.reward
            ?.customRewardText ??
            ""
        ).trim(),
    },

    active:
      data.active === true,
  };
}

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
      .map(
        (item) =>
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

export async function addSecretChallenge(
  data
) {
  const challenge =
    cleanChallengeData(
      data
    );

  if (!challenge.question) {
    throw new Error(
      "السؤال اليدوي غير موجود."
    );
  }

  if (!challenge.answer) {
    throw new Error(
      "الإجابة الصحيحة غير موجودة."
    );
  }

  if (
    challenge.reward.type ===
      "custom" &&
    !challenge.reward
      .customRewardText
  ) {
    throw new Error(
      "الهدية المخصصة غير موجودة."
    );
  }

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

  if (!challenge.question) {
    throw new Error(
      "السؤال اليدوي غير موجود."
    );
  }

  if (!challenge.answer) {
    throw new Error(
      "الإجابة الصحيحة غير موجودة."
    );
  }

  if (
    challenge.reward.type ===
      "custom" &&
    !challenge.reward
      .customRewardText
  ) {
    throw new Error(
      "الهدية المخصصة غير موجودة."
    );
  }

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
    return `device_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
  }
}

function getLocalClaimKey(
  challengeId
) {
  return `hiraql_secret_claim_${challengeId}`;
}

export async function getSecretChallengeClaim(
  challengeId
) {
  if (!challengeId) {
    return null;
  }

  const deviceId =
    getSecretDeviceId();

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
    // تجاهل
  }

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

  const existingClaim =
    await getSecretChallengeClaim(
      challenge.id
    );

  if (existingClaim) {
    return {
      success: false,
      reason: "already-claimed",

      claim:
        existingClaim,
    };
  }

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
      challenge.title || "",

    deviceId,

    couponCode,

    reward:
      challenge.reward || {
        type: "percentage",
        value: "",
        productId: "",
        productName: "",
        customRewardText: "",
      },

    status: "pending",

    requiresOrder: true,

    orderId: "",

    createdAt:
      serverTimestamp(),

    updatedAt:
      serverTimestamp(),
  };

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

      claim:
        existingClaim,
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

  if (
    snapshot.empty
  ) {
    return null;
  }

  const item =
    snapshot.docs[0];

  return {
    id: item.id,

    ...item.data(),
  };
}

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

  const currentSnapshot =
    await getDoc(
      claimRef
    );

  if (
    !currentSnapshot.exists()
  ) {
    throw new Error(
      "المكافأة غير موجودة."
    );
  }

  const currentData =
    currentSnapshot.data();

  if (
    currentData.status ===
    "used"
  ) {
    if (
      currentData.orderId ===
      orderId
    ) {
      return true;
    }

    const error =
      new Error(
        "المكافأة مستخدمة بالفعل."
      );

    error.code =
      "SECRET_CLAIM_ALREADY_USED";

    throw error;
  }

  if (
    currentData.status !==
    "pending"
  ) {
    throw new Error(
      "المكافأة غير متاحة للاستخدام."
    );
  }

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

  try {
    if (
      currentData.challengeId
    ) {
      localStorage.removeItem(
        getLocalClaimKey(
          currentData.challengeId
        )
      );
    }
  } catch {
    // تجاهل
  }

  return true;
}