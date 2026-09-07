import { useMemo, useState } from "react";
import {
  MessageCircle,
  Send,
  Star,
  UserRound,
} from "lucide-react";

import {
  addReview,
  getProductReviews,
} from "../data/reviews";

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState(() =>
    getProductReviews(productId)
  );

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    );

    return Number(
      (total / reviews.length).toFixed(1)
    );
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter(
        (review) => Number(review.rating) === rating
      ).length,
    }));
  }, [reviews]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.comment.trim()
    ) {
      return;
    }

    const newReview = addReview({
      productId,
      name: form.name.trim(),
      rating: Number(form.rating),
      comment: form.comment.trim(),
    });

    setReviews((current) => [
      newReview,
      ...current,
    ]);

    setForm({
      name: "",
      rating: 5,
      comment: "",
    });

    setSubmitted(true);
  };

  return (
    <section className="mt-20 border-t border-zinc-100 pt-14">
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-black text-[#16a34a] sm:text-sm">
            آراء العملاء
          </span>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            الناس بتقول إيه عن المنتج؟
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            شاركنا تجربتك وساعد غيرك يختار بشكل أفضل.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Star
            size={23}
            fill="currentColor"
            className="text-[#facc15]"
          />

          <div>
            <p className="text-xl font-black">
              {averageRating || "—"}
            </p>

            <p className="text-[10px] text-zinc-400">
              {reviews.length} تقييم
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-6 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7 lg:grid-cols-[220px_1fr]">
        {/* AVERAGE */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-50 p-6 text-center">
          <span className="text-5xl font-black">
            {averageRating || "—"}
          </span>

          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={17}
                fill={
                  star <= Math.round(averageRating)
                    ? "currentColor"
                    : "none"
                }
                className={
                  star <= Math.round(averageRating)
                    ? "text-[#facc15]"
                    : "text-zinc-300"
                }
              />
            ))}
          </div>

          <p className="mt-3 text-xs text-zinc-400">
            بناءً على {reviews.length} تقييم
          </p>
        </div>

        {/* BARS */}
        <div className="flex flex-col justify-center gap-3">
          {ratingCounts.map((item) => {
            const percentage =
              reviews.length > 0
                ? (item.count / reviews.length) * 100
                : 0;

            return (
              <div
                key={item.rating}
                className="flex items-center gap-3"
              >
                <span className="w-8 text-xs font-black">
                  {item.rating}
                </span>

                <Star
                  size={14}
                  fill="currentColor"
                  className="shrink-0 text-[#facc15]"
                />

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-[#39ff14] transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="w-6 text-left text-[10px] text-zinc-400">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WRITE REVIEW */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle size={19} />

            <h3 className="font-black">
              تقييمات العملاء
            </h3>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 p-10 text-center">
              <MessageCircle
                size={35}
                className="mx-auto text-zinc-300"
              />

              <h4 className="mt-4 font-black">
                لسه مفيش تقييمات
              </h4>

              <p className="mt-2 text-xs text-zinc-400">
                كن أول واحد يشارك تجربته.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-[#39ff14]">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-black">
                          {review.name}
                        </h4>

                        <div className="mt-1 flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={13}
                                fill={
                                  star <=
                                  Number(
                                    review.rating
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  star <=
                                  Number(
                                    review.rating
                                  )
                                    ? "text-[#facc15]"
                                    : "text-zinc-300"
                                }
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-[10px] text-zinc-400">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString("ar-EG")}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-zinc-600">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="h-fit rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6 lg:sticky lg:top-28">
          <h3 className="text-lg font-black">
            اكتب تقييمك
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-500">
            رأيك يهمنا وبيساعد العملاء الجدد.
          </p>

          {submitted && (
            <div className="mt-4 rounded-2xl bg-[#39ff14]/15 p-4 text-xs font-bold text-[#15803d]">
              تم إضافة تقييمك بنجاح ❤️
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4"
          >
            <div>
              <label className="mb-2 block text-xs font-black">
                الاسم
              </label>

              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="اكتب اسمك"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold outline-none transition-all focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black">
                التقييم
              </label>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (rating) => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          rating,
                        }))
                      }
                      className="rounded-lg p-1 transition-transform hover:scale-110"
                      aria-label={`تقييم ${rating} نجوم`}
                    >
                      <Star
                        size={24}
                        fill={
                          rating <= form.rating
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          rating <= form.rating
                            ? "text-[#facc15]"
                            : "text-zinc-300"
                        }
                      />
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black">
                رأيك
              </label>

              <textarea
                required
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows="5"
                placeholder="قولنا رأيك في المنتج..."
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm font-bold outline-none transition-all focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-black font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              <Send size={17} />
              إرسال التقييم
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ProductReviews;