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

const COLLECTION_NAME = "secretChallenges";

const challengesRef = collection(
  db,
  COLLECTION_NAME
);

function cleanChallengeData(data = {}) {
  return {
    title: String(data.title || "").trim(),

    description: String(
      data.description || ""
    ).trim(),

    question: String(
      data.question || ""
    ).trim(),

    answer: String(
      data.answer || ""
    )
      .trim()
      .toLowerCase(),

    hints: Array.isArray(data.hints)
      ? data.hints
          .map((hint, index) => ({
            order: Number(
              hint?.order || index + 1
            ),
            text: String(
              hint?.text || ""
            ).trim(),
          }))
          .filter((hint) => hint.text)
      : [],

    reward: {
      type:
        data.reward?.type ||
        "percentage",

      value:
        data.reward?.value ?? "",

      productId:
        data.reward?.productId || "",

      productName:
        data.reward?.productName || "",
    },

    active:
      data.active === true,

    startAt:
      data.startAt || "",

    endAt:
      data.endAt || "",
  };
}

function serializeChallenge(
  id,
  data
) {
  return {
    id,
    ...data,
  };
}

export async function getSecretChallenges() {
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
      .map((item) =>
        serializeChallenge(
          item.id,
          item.data()
        )
      )
      .filter((challenge) => {
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
      })
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

  const challengeRef = doc(
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
    cleanChallengeData(data);

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
    cleanChallengeData(data);

  const challengeRef = doc(
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