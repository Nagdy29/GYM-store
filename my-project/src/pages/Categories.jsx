import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  FolderOpen,
  PackageOpen,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import {
  getCategoriesFromFirebase,
} from "../firebase/categories";

import {
  getProductsFromFirebase,
} from "../firebase/products";

function Categories() {
  const [categories, setCategories] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState("default");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          categoriesData,
          productsData,
        ] = await Promise.all([
          getCategoriesFromFirebase(),
          getProductsFromFirebase(),
        ]);

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );
      } catch (err) {
        console.error(
          "Categories Firebase Error:",
          err
        );

        setError(
          err?.message ||
            "حصلت مشكلة أثناء تحميل الأقسام."
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

  const categoryCounts = useMemo(() => {
    return products.reduce(
      (counts, product) => {
        const categoryId =
          product.category;

        if (!categoryId) {
          return counts;
        }

        counts[categoryId] =
          (counts[categoryId] || 0) + 1;

        return counts;
      },
      {}
    );
  }, [products]);

  const filteredCategories =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      let result =
        categories.filter(
          (category) => {
            if (!normalizedSearch) {
              return true;
            }

            const name =
              String(
                category.name || ""
              ).toLowerCase();

            const description =
              String(
                category.description ||
                  ""
              ).toLowerCase();

            const slug =
              String(
                category.slug || ""
              ).toLowerCase();

            return (
              name.includes(
                normalizedSearch
              ) ||
              description.includes(
                normalizedSearch
              ) ||
              slug.includes(
                normalizedSearch
              )
            );
          }
        );

      if (sort === "name") {
        result.sort((a, b) =>
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

      if (
        sort ===
        "products-high"
      ) {
        result.sort(
          (a, b) =>
            (categoryCounts[
              b.id
            ] || 0) -
            (categoryCounts[
              a.id
            ] || 0)
        );
      }

      if (
        sort ===
        "products-low"
      ) {
        result.sort(
          (a, b) =>
            (categoryCounts[
              a.id
            ] || 0) -
            (categoryCounts[
              b.id
            ] || 0)
        );
      }

      return result;
    }, [
      categories,
      categoryCounts,
      search,
      sort,
    ]);

  const totalProducts =
    products.length;

  const totalCategories =
    categories.length;

  const categoriesWithProducts =
    categories.filter(
      (category) =>
        (categoryCounts[
          category.id
        ] || 0) > 0
    ).length;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white"
    >
      {/* HERO */}

      <section className="relative overflow-hidden bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#39ff14]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#39ff14]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff14]/20 bg-[#39ff14]/5 px-4 py-2">
            <Sparkles
              size={15}
              className="text-[#39ff14]"
            />

            <span className="text-xs font-black text-[#39ff14]">
              HIRAQL STORE
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-black sm:text-5xl lg:text-6xl">
            اختار القسم
            <span className="text-[#39ff14]">
              {" "}
              اللي يناسبك
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-zinc-400 sm:text-base">
            كل أقسام HIRAQL اللي بتتضاف من لوحة التحكم
            بتظهر هنا تلقائيًا.
          </p>

          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs text-zinc-500">
                إجمالي الأقسام
              </p>

              <p className="mt-2 text-2xl font-black">
                {loading
                  ? "..."
                  : totalCategories}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs text-zinc-500">
                المنتجات
              </p>

              <p className="mt-2 text-2xl font-black text-[#39ff14]">
                {loading
                  ? "..."
                  : totalProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs text-zinc-500">
                أقسام بها منتجات
              </p>

              <p className="mt-2 text-2xl font-black">
                {loading
                  ? "..."
                  : categoriesWithProducts}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {error && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-black text-red-700">
                  حصلت مشكلة
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-white"
              >
                <RefreshCw size={17} />
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {!loading &&
          categories.length > 0 && (
            <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-4 sm:p-5 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="ابحث عن قسم..."
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pr-11 pl-11 text-sm font-semibold outline-none focus:border-[#39ff14]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#39ff14]"
              >
                <option value="default">
                  الترتيب الافتراضي
                </option>

                <option value="name">
                  حسب الاسم
                </option>

                <option value="products-high">
                  الأكثر منتجات
                </option>

                <option value="products-low">
                  الأقل منتجات
                </option>
              </select>
            </div>
          )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-50 p-7"
                >
                  <div className="h-52 animate-pulse rounded-[1.5rem] bg-zinc-200" />
                  <div className="mt-6 h-7 w-2/3 animate-pulse rounded-lg bg-zinc-200" />
                  <div className="mt-4 h-4 w-full animate-pulse rounded bg-zinc-200" />
                  <div className="mt-7 h-5 w-32 animate-pulse rounded bg-zinc-200" />
                </div>
              )
            )}
          </div>
        ) : filteredCategories.length >
          0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map(
              (category) => {
                const count =
                  categoryCounts[
                    category.id
                  ] || 0;

                return (
                  <Link
                    key={category.id}
                    to={`/products?category=${encodeURIComponent(
                      category.id
                    )}`}
                    className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-2xl"
                  >
                    <div className="relative h-56 overflow-hidden bg-zinc-100">
                      {category.image ? (
                        <img
                          src={
                            category.image
                          }
                          alt={
                            category.name
                          }
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black text-[#39ff14]">
                          <FolderOpen
                            size={55}
                            strokeWidth={
                              1.5
                            }
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      <div className="absolute bottom-4 right-4">
                        <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                          {count ===
                          0
                            ? "لا توجد منتجات"
                            : `${count} ${
                                count ===
                                1
                                  ? "منتج"
                                  : "منتجات"
                              }`}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-black text-zinc-900">
                        {category.name ||
                          "قسم بدون اسم"}
                      </h2>

                      <p className="mt-3 min-h-[56px] text-sm leading-7 text-zinc-500">
                        {category.description ||
                          "اكتشف المنتجات الموجودة داخل هذا القسم."}
                      </p>

                      <div className="mt-7 flex items-center justify-between border-t border-zinc-100 pt-5">
                        <span className="text-sm font-black text-[#16a34a]">
                          تصفح القسم
                        </span>

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-all duration-300 group-hover:bg-[#39ff14] group-hover:text-black">
                          <ArrowLeft
                            size={17}
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
              {categories.length ===
              0 ? (
                <FolderOpen size={28} />
              ) : (
                <Search size={28} />
              )}
            </div>

            <h2 className="mt-6 text-2xl font-black">
              {categories.length === 0
                ? "مفيش أقسام لسه"
                : "مفيش نتائج"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-500">
              {categories.length === 0
                ? "الأقسام هتظهر هنا بمجرد إضافتها من لوحة التحكم."
                : "جرّب كلمة بحث مختلفة."}
            </p>
          </div>
        )}

        {!loading && (
          <div className="mt-12 overflow-hidden rounded-[2rem] bg-black p-7 text-white sm:p-9">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
                  <PackageOpen size={25} />
                </div>

                <div>
                  <h3 className="text-lg font-black">
                    كل حاجة منظمة عشان تختار أسرع
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-7 text-zinc-400">
                    الأقسام بتتحدث تلقائيًا من لوحة التحكم.
                  </p>
                </div>
              </div>

              <Link
                to="/products"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#39ff14] px-6 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white"
              >
                كل المنتجات
                <ArrowLeft size={17} />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Categories;