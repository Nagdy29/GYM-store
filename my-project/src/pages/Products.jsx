import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Filter,
  Search,
  SlidersHorizontal,
  Star,
  X,
  RefreshCw,
} from "lucide-react";

import { categories } from "../data/products";

import {
  getProductsFromFirebase,
} from "../firebase/products";

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlCategory =
    searchParams.get("category") || "all";

  const urlOffer =
    searchParams.get("offer") === "true";

  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [category, setCategory] =
    useState(urlCategory);

  const [search, setSearch] =
    useState("");

  const [offersOnly, setOffersOnly] =
    useState(urlOffer);

  const [sort, setSort] =
    useState("default");

  const [mobileFilters, setMobileFilters] =
    useState(false);

  /*
   * =========================
   * LOAD PRODUCTS
   * =========================
   */

  const loadProducts = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProductsFromFirebase();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (firebaseError) {
        console.error(
          "Products Firebase Error:",
          firebaseError
        );

        setError(
          "حصل خطأ أثناء تحميل المنتجات. اتأكد إن Firebase شغال وإن صلاحيات Firestore مظبوطة."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /*
   * =========================
   * SYNC URL WITH STATE
   * =========================
   */

  useEffect(() => {
    setCategory(urlCategory);
    setOffersOnly(urlOffer);
  }, [urlCategory, urlOffer]);

  /*
   * =========================
   * FILTER + SEARCH + SORT
   * =========================
   */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * CATEGORY
     */

    if (category !== "all") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    /*
     * OFFERS
     */

    if (offersOnly) {
      result = result.filter(
        (product) =>
          Number(product.discount || 0) > 0
      );
    }

    /*
     * SEARCH
     */

    if (search.trim()) {
      const value =
        search.trim().toLowerCase();

      result = result.filter((product) => {
        const productName =
          String(
            product.name || ""
          ).toLowerCase();

        const categoryName =
          String(
            product.categoryName || ""
          ).toLowerCase();

        const description =
          String(
            product.description || ""
          ).toLowerCase();

        return (
          productName.includes(value) ||
          categoryName.includes(value) ||
          description.includes(value)
        );
      });
    }

    /*
     * SORT
     */

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === "newest") {
      result.sort((a, b) => {
        const dateA =
          a.createdAt?.seconds
            ? a.createdAt.seconds
            : 0;

        const dateB =
          b.createdAt?.seconds
            ? b.createdAt.seconds
            : 0;

        return dateB - dateA;
      });
    }

    return result;
  }, [
    products,
    category,
    offersOnly,
    search,
    sort,
  ]);

  /*
   * =========================
   * URL
   * =========================
   */

  const updateUrl = ({
    nextCategory = category,
    nextOffers = offersOnly,
  } = {}) => {
    const params = {};

    if (nextCategory !== "all") {
      params.category = nextCategory;
    }

    if (nextOffers) {
      params.offer = "true";
    }

    setSearchParams(params);
  };

  /*
   * =========================
   * CATEGORY
   * =========================
   */

  const changeCategory = (value) => {
    setCategory(value);

    updateUrl({
      nextCategory: value,
      nextOffers: offersOnly,
    });

    setMobileFilters(false);
  };

  /*
   * =========================
   * OFFERS
   * =========================
   */

  const changeOffers = (checked) => {
    setOffersOnly(checked);

    updateUrl({
      nextCategory: category,
      nextOffers: checked,
    });
  };

  /*
   * =========================
   * CLEAR FILTERS
   * =========================
   */

  const clearFilters = () => {
    setCategory("all");
    setOffersOnly(false);
    setSearch("");
    setSort("default");

    setSearchParams({});
  };

  /*
   * =========================
   * SELECTED CATEGORY
   * =========================
   */

  const selectedCategory =
    categories.find(
      (item) => item.id === category
    );

  /*
   * =========================
   * PRICE FORMAT
   * =========================
   */

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "ar-EG"
    );
  };

  /*
   * =========================
   * PRODUCT CARD
   * =========================
   */

  const ProductCard = ({ product }) => {
    const rating = Number(
      product.rating || 0
    );

    const reviews = Number(
      product.reviews || 0
    );

    const discount = Number(
      product.discount || 0
    );

    const price = Number(
      product.price || 0
    );

    const oldPrice = Number(
      product.oldPrice || 0
    );

    return (
      <Link
        to={`/products/${product.id}`}
        className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-2xl"
      >
        {/* IMAGE */}

        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-zinc-300 shadow-sm">
                  <Search size={24} />
                </div>

                <p className="mt-3 text-xs font-bold text-zinc-400">
                  لا توجد صورة
                </p>
              </div>
            </div>
          )}

          {/* BADGE */}

          {product.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-[#39ff14] shadow-lg">
              {product.badge}
            </span>
          )}

          {/* DISCOUNT */}

          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-[#39ff14] px-3 py-1.5 text-[10px] font-black text-black shadow-lg">
              -{discount}%
            </span>
          )}

          {/* OUT OF STOCK */}

          {Number(product.stock || 0) <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-5 py-2 text-xs font-black text-black">
                غير متوفر حاليًا
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}

        <div className="p-5">
          {/* CATEGORY */}

          <p className="text-xs font-bold text-zinc-400">
            {product.categoryName ||
              "منتجات ZENGER"}
          </p>

          {/* NAME */}

          <h3 className="mt-2 line-clamp-1 text-base font-black text-zinc-900">
            {product.name}
          </h3>

          {/* RATING */}

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-zinc-700">
            <Star
              size={14}
              fill={
                rating > 0
                  ? "currentColor"
                  : "none"
              }
              className={
                rating > 0
                  ? "text-[#39ff14]"
                  : "text-zinc-300"
              }
            />

            <span>
              {rating > 0
                ? rating.toFixed(1)
                : "جديد"}
            </span>

            {reviews > 0 && (
              <span className="text-zinc-400">
                ({reviews})
              </span>
            )}
          </div>

          {/* PRICE */}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-lg font-black text-zinc-950">
              {formatPrice(price)} جنيه
            </span>

            {oldPrice > price &&
              oldPrice > 0 && (
                <span className="text-xs font-bold text-zinc-400 line-through">
                  {formatPrice(oldPrice)} جنيه
                </span>
              )}
          </div>

          {/* FOOTER */}

          <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
            <span className="text-xs font-bold text-zinc-400">
              عرض التفاصيل
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-black text-black transition-all duration-300 group-hover:bg-[#39ff14] group-hover:-translate-x-1">
              ←
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white"
    >
      {/* =========================
          HEADER
      ========================= */}

      <section className="relative overflow-hidden bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
        {/* DECORATION */}

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#39ff14]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#39ff14]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex rounded-full border border-[#39ff14]/30 bg-[#39ff14]/10 px-4 py-2 text-xs font-black text-[#39ff14]">
            ZENGER GYM STORE
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            كل المنتجات
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-zinc-400">
            اختار المنتج اللي يناسبك من المنتجات
            المتاحة في المتجر، واستخدم البحث
            والفلاتر عشان توصل للي محتاجه بسرعة.
          </p>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* SEARCH + FILTER + SORT */}

        <div className="mb-8 flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="ابحث عن منتج أو قسم..."
              className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pr-12 pl-12 text-sm font-bold text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-black"
                aria-label="مسح البحث"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* MOBILE FILTER */}

          <button
            type="button"
            onClick={() =>
              setMobileFilters(
                (current) => !current
              )
            }
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-black transition-all hover:border-black hover:bg-black hover:text-white lg:hidden"
          >
            <SlidersHorizontal size={18} />

            الفلاتر

            {(category !== "all" ||
              offersOnly) && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#39ff14] px-1 text-[10px] text-black">
                !
              </span>
            )}
          </button>

          {/* SORT */}

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="h-14 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-900 outline-none transition-all focus:border-[#39ff14] focus:ring-4 focus:ring-[#39ff14]/10"
          >
            <option value="default">
              ترتيب المنتجات
            </option>

            <option value="newest">
              الأحدث
            </option>

            <option value="price-low">
              السعر: من الأقل للأعلى
            </option>

            <option value="price-high">
              السعر: من الأعلى للأقل
            </option>

            <option value="rating">
              الأعلى تقييمًا
            </option>
          </select>
        </div>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* =========================
              FILTERS
          ========================= */}

          <aside
            className={`${
              mobileFilters
                ? "block"
                : "hidden"
            } lg:block`}
          >
            <div className="sticky top-28 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} />

                  <h2 className="font-black">
                    تصفية المنتجات
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilters(false)
                  }
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-black lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              {/* CATEGORIES */}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    changeCategory("all")
                  }
                  className={`w-full rounded-xl px-4 py-3 text-right text-sm font-bold transition-all ${
                    category === "all"
                      ? "bg-black text-[#39ff14] shadow-lg"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  كل المنتجات
                </button>

                {categories.map(
                  (item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        changeCategory(
                          item.id
                        )
                      }
                      className={`w-full rounded-xl px-4 py-3 text-right text-sm font-bold transition-all ${
                        category === item.id
                          ? "bg-black text-[#39ff14] shadow-lg"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                )}
              </div>

              <div className="my-5 h-px bg-zinc-100" />

              {/* OFFERS */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-50">
                <input
                  type="checkbox"
                  checked={offersOnly}
                  onChange={(event) =>
                    changeOffers(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#39ff14]"
                />

                <span className="text-sm font-bold">
                  العروض فقط
                </span>
              </label>

              {/* CLEAR */}

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 w-full rounded-xl border border-zinc-200 py-3 text-xs font-black transition-all hover:border-black hover:bg-black hover:text-white"
              >
                مسح الفلاتر
              </button>
            </div>
          </aside>

          {/* =========================
              PRODUCTS
          ========================= */}

          <section>
            {/* LOADING */}

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                ].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-3xl border border-zinc-100 bg-white"
                  >
                    <div className="aspect-square animate-pulse bg-zinc-100" />

                    <div className="space-y-3 p-5">
                      <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />

                      <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-100" />

                      <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />

                      <div className="h-6 w-1/3 animate-pulse rounded bg-zinc-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* ERROR */

              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
                  <X size={28} />
                </div>

                <h2 className="mt-5 text-xl font-black">
                  حصلت مشكلة
                </h2>

                <p className="mt-2 max-w-md text-sm leading-7 text-zinc-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadProducts}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-all hover:bg-zinc-800"
                >
                  <RefreshCw size={16} />

                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <>
                {/* RESULTS HEADER */}

                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <p className="ml-auto text-sm font-bold text-zinc-500">
                    عرض{" "}
                    <span className="font-black text-black">
                      {
                        filteredProducts.length
                      }
                    </span>{" "}
                    منتج
                  </p>

                  {selectedCategory && (
                    <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black">
                      {
                        selectedCategory.name
                      }
                    </span>
                  )}

                  {offersOnly && (
                    <span className="rounded-full bg-[#39ff14] px-4 py-2 text-xs font-black text-black">
                      العروض فقط
                    </span>
                  )}

                  {search.trim() && (
                    <span className="max-w-full truncate rounded-full bg-black px-4 py-2 text-xs font-black text-white">
                      البحث: {search}
                    </span>
                  )}
                </div>

                {/* EMPTY */}

                {filteredProducts.length ===
                0 ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-5 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-300 shadow-sm">
                      <Search size={30} />
                    </div>

                    <h2 className="mt-5 text-xl font-black">
                      مفيش منتجات مطابقة
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-7 text-zinc-500">
                      جرب تغير كلمة البحث أو
                      الفلاتر، أو ارجع لكل
                      المنتجات.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-black text-white transition-all hover:bg-zinc-800"
                    >
                      مسح الفلاتر
                    </button>
                  </div>
                ) : (
                  /* PRODUCTS */

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map(
                      (product) => (
                        <ProductCard
                          key={product.id}
                          product={
                            product
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Products;