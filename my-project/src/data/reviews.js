const REVIEWS_KEY = "zenger-reviews";

const defaultReviews = [
  {
    id: "review-1",
    productId: "zenger-tshirt-black",
    name: "أحمد",
    rating: 5,
    comment:
      "الخامة كويسة جدًا والمقاس طلع مظبوط، والمنتج شكله أحسن من الصور.",
    createdAt: "2026-08-20T10:00:00.000Z",
    status: "approved",
  },
  {
    id: "review-2",
    productId: "zenger-tshirt-black",
    name: "محمد",
    rating: 5,
    comment:
      "تيشيرت مريح جدًا للتمرين والخامة خفيفة، تجربة كويسة.",
    createdAt: "2026-08-23T14:30:00.000Z",
    status: "approved",
  },
];

export function getReviews() {
  try {
    const saved = localStorage.getItem(REVIEWS_KEY);

    if (!saved) {
      localStorage.setItem(
        REVIEWS_KEY,
        JSON.stringify(defaultReviews)
      );

      return defaultReviews;
    }

    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function getProductReviews(productId) {
  return getReviews().filter(
    (review) =>
      review.productId === productId &&
      review.status === "approved"
  );
}

export function addReview(review) {
  const reviews = getReviews();

  const newReview = {
    id: `review-${Date.now()}`,
    ...review,
    status: "approved",
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [
    newReview,
    ...reviews,
  ];

  localStorage.setItem(
    REVIEWS_KEY,
    JSON.stringify(updatedReviews)
  );

  return newReview;
}

export function deleteReview(reviewId) {
  const reviews = getReviews();

  const updatedReviews = reviews.filter(
    (review) => review.id !== reviewId
  );

  localStorage.setItem(
    REVIEWS_KEY,
    JSON.stringify(updatedReviews)
  );
}

export function getAllReviews() {
  return getReviews();
}

export function getReviewStats(productId) {
  const reviews = getProductReviews(productId);

  if (reviews.length === 0) {
    return {
      count: 0,
      average: 0,
    };
  }

  const total = reviews.reduce(
    (sum, review) => sum + Number(review.rating),
    0
  );

  return {
    count: reviews.length,
    average: Number(
      (total / reviews.length).toFixed(1)
    ),
  };
}