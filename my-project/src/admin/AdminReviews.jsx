import { useState } from "react";
import {
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";

import {
  deleteReview,
  getAllReviews,
} from "../data/reviews";

import { getProductById } from "../data/products";

function AdminReviews() {
  const [reviews, setReviews] = useState(
    getAllReviews()
  );

  const handleDelete = (reviewId) => {
    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف التقييم؟"
      );

    if (!confirmed) return;

    deleteReview(reviewId);

    setReviews((current) =>
      current.filter(
        (review) =>
          review.id !== reviewId
      )
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div>
        <span className="text-xs font-black text-[#16a34a]">
          ADMIN / REVIEWS
        </span>

        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          تقييمات العملاء
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          مشاهدة وإدارة آراء العملاء على المنتجات.
        </p>
      </div>

      {/* COUNT */}
      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-[#39ff14]">
          <MessageSquare size={20} />
        </div>

        <div>
          <p className="text-xs text-zinc-400">
            إجمالي التقييمات
          </p>

          <p className="text-xl font-black">
            {reviews.length}
          </p>
        </div>
      </div>

      {/* REVIEWS */}
      {reviews.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <MessageSquare
            size={40}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-5 font-black">
            مفيش تقييمات
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            لما العملاء يضيفوا تقييمات هتظهر هنا.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {reviews.map((review) => {
            const product =
              getProductById(
                review.productId
              );

            return (
              <article
                key={review.id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-[#39ff14]">
                      <MessageSquare
                        size={19}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black">
                        {review.name}
                      </h3>

                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={14}
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

                      <p className="mt-4 text-sm leading-7 text-zinc-600">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <span className="text-[10px] text-zinc-400">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "ar-EG"
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          review.id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-500 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={15} />
                      حذف
                    </button>
                  </div>
                </div>

                {product && (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-zinc-50 p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />

                    <div>
                      <p className="text-[10px] text-zinc-400">
                        المنتج
                      </p>

                      <p className="mt-1 text-xs font-black">
                        {product.name}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;