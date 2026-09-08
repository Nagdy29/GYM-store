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
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";

import {
  getCategoriesFromFirebase,
} from "../firebase/categories";

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

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

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

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productsData,
          categoriesData,
        ] = await Promise.all([
          getProductsFromFirebase(),
          getCategoriesFromFirebase(),
        ]);

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );
      } catch (firebaseError) {
        console.error(
          "Products Firebase Error:",
          firebaseError
        );

        setError(
          firebaseError?.message ||
            "حصل خطأ أثناء تحميل المنتجات والأقسام."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCategory(urlCategory);
    setOffersOnly(urlOffer);
  }, [urlCategory, urlOffer]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter(
        (product) =>
          product.category ===
          category
      );
    }

    if (offersOnly) {
      result = result.filter(
        (product) =>
          Number(
            product.discount || 0
          ) > 0
      );
    }

    if (search.trim()) {
      const value = search
        .trim()
        .toLowerCase();

      result = result.filter(
        (product) => {
          const productName =
            String(
              product.name || ""
            ).toLowerCase();

          const categoryName =
            String(
              product.categoryName ||
                ""
            ).toLowerCase();

          const description =
            String(
              product.description ||
                ""
            ).toLowerCase();

          return (
            productName.includes(
              value
            ) ||
            categoryName.includes(
              value
            ) ||
            description.includes(
              value
            )
          );
        }
      );
    }

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
          a.createdAt?.seconds || 0;

        const dateB =
          b.createdAt?.seconds || 0;

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

  const updateUrl = ({
    nextCategory = category,
    nextOffers = offersOnly,
  } = {}) => {
    const params = {};

    if (nextCategory !== "all") {
      params.category =
        nextCategory;
    }

    if (nextOffers) {
      params.offer = "true";
    }

    setSearchParams(params);
  };

  const changeCategory = (value) => {
    setCategory(value);

    updateUrl({
      nextCategory: value,
      nextOffers: offersOnly,
    });

    setMobileFilters(false);
  };

  const changeOffers = (checked) => {
    setOffersOnly(checked);

    updateUrl({
      nextCategory: category,
      nextOffers: checked,
    });
  };

  const clearFilters = () => {
    setCategory("all");
    setOffersOnly(false);
    setSearch("");
    setSort("default");
    setSearchParams({});
  };

  const selectedCategory =
    categories.find(
      (item) => item.id === category
    );

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString(
      "ar-EG"
    );

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

    const productCategory =
      categories.find(
        (item) =>
          item.id ===
          product.category
      );

    return (
      <Link
        to={`/products/${product.id}`}
        className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-2xl"
      >
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

          {product.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-[#39ff14] shadow-lg">
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-[#39ff14] px-3 py-1.5 text-[10px] font-black text-black shadow-lg">
              -{discount}%
            </span>
          )}

          {Number(product.stock || 0) <=
            0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-5 py-2 text-xs font-black text-black">
                غير متوفر حاليًا
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs font-bold text-zinc-400">
            {productCategory?.name ||
              product.categoryName ||
              "منتجات HIRAQL"}
          </p>

          <h3 className="mt-2 line-clamp-1 text-base font-black text-zinc-900">
            {product.name}
          </h3>

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

          <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
            <span className="text-xs font-bold text-zinc-400">
              عرض التفاصيل
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-black text-black transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-[#39ff14]">
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
      {/* HEADER */}

      <section className="relative overflow-hidden bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#39ff14]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#39ff14]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex rounded-full border border-[#39ff14]/30 bg-[#39ff14]/10 px-4 py-2 text-xs font-black text-[#39ff14]">
            HIRAQL GYM STORE
          </span>

          <h1 className="mt-5 text-4xl font-black sm:text-5xl">
            كل المنتجات
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-zinc-400">
            اختار المنتج اللي يناسبك واستخدم الأقسام
            والبحث والفلاتر عشان توصل للي محتاجه بسرعة.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row">
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
              className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pr-12 pl-12 text-sm font-bold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileFilters(
                (value) => !value
              )
            }
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-black transition hover:border-black hover:bg-black hover:text-white lg:hidden"
          >
            <SlidersHorizontal size={18} />
            الفلاتر
          </button>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="h-14 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-bold outline-none focus:border-[#39ff14]"
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

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
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

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    changeCategory("all")
                  }
                  className={`w-full rounded-xl px-4 py-3 text-right text-sm font-bold transition ${
                    category === "all"
                      ? "bg-black text-[#39ff14]"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  كل المنتجات
                </button>

                {categories.map(
                  (item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        changeCategory(
                          item.id
                        )
                      }
                      className={`w-full rounded-xl px-4 py-3 text-right text-sm font-bold transition ${
                        category === item.id
                          ? "bg-black text-[#39ff14]"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                )}
              </div>

              <div className="my-5 h-px bg-zinc-100" />

              <label className="flex cursor-pointer items-center gap-3 rounded-xl p-2 hover:bg-zinc-50">
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

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 w-full rounded-xl border border-zinc-200 py-3 text-xs font-black hover:border-black hover:bg-black hover:text-white"
              >
                مسح الفلاتر
              </button>
            </div>
          </aside>

          <section>
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
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-500">
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
                  onClick={loadData}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white"
                >
                  <RefreshCw size={16} />
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <p className="ml-auto text-sm font-bold text-zinc-500">
                    عرض{" "}
                    <span className="font-black text-black">
                      {filteredProducts.length}
                    </span>{" "}
                    منتج
                  </p>

                  {selectedCategory && (
                    <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black">
                      {selectedCategory.name}
                    </span>
                  )}

                  {offersOnly && (
                    <span className="rounded-full bg-[#39ff14] px-4 py-2 text-xs font-black text-black">
                      العروض فقط
                    </span>
                  )}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 text-center">
                    <Search
                      size={30}
                      className="text-zinc-300"
                    />

                    <h2 className="mt-5 text-xl font-black">
                      مفيش منتجات مطابقة
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      جرّب تغير البحث أو الفلاتر.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-black text-white"
                    >
                      مسح الفلاتر
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map(
                      (product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
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