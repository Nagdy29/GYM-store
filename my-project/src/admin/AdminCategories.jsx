import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FolderOpen,
  Image as ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  addCategoryToFirebase,
  deleteCategoryFromFirebase,
  getCategoriesFromFirebase,
  updateCategoryInFirebase,
} from "../firebase/categories";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCategoriesFromFirebase();

      setCategories(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Admin Categories Error:",
        err
      );

      setError(
        "حصلت مشكلة أثناء تحميل الأقسام."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return categories;
    }

    return categories.filter((category) => {
      const name = String(
        category.name || ""
      ).toLowerCase();

      const slug = String(
        category.slug || ""
      ).toLowerCase();

      const description = String(
        category.description || ""
      ).toLowerCase();

      return (
        name.includes(value) ||
        slug.includes(value) ||
        description.includes(value)
      );
    });
  }, [categories, search]);

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      image: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      image: "",
    });

    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description:
        category.description || "",
      image: category.image || "",
    });

    setEditingId(category.id);
    setError("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createSlug = (value) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(
        /[^\u0600-\u06FFa-z0-9-]/g,
        ""
      );
  };

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      name: value,
      slug:
        current.slug ||
        createSlug(value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setError("اكتب اسم القسم الأول.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const categoryData = {
        name,
        slug:
          form.slug.trim() ||
          createSlug(name),
        description:
          form.description.trim(),
        image: form.image.trim(),
      };

      if (editingId) {
        const updated =
          await updateCategoryInFirebase(
            editingId,
            categoryData
          );

        setCategories((current) =>
          current.map((category) =>
            category.id === editingId
              ? {
                  ...category,
                  ...updated,
                }
              : category
          )
        );
      } else {
        const created =
          await addCategoryToFirebase(
            categoryData
          );

        setCategories((current) => [
          ...current,
          created,
        ]);
      }

      resetForm();
    } catch (err) {
      console.error(
        "Save Category Error:",
        err
      );

      setError(
        err?.message ||
          "حصلت مشكلة أثناء حفظ القسم."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `متأكد إنك عايز تحذف قسم "${category.name}"؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);
      setError("");

      await deleteCategoryFromFirebase(
        category.id
      );

      setCategories((current) =>
        current.filter(
          (item) =>
            item.id !== category.id
        )
      );

      if (editingId === category.id) {
        resetForm();
      }
    } catch (err) {
      console.error(
        "Delete Category Error:",
        err
      );

      setError(
        err?.message ||
          "حصلت مشكلة أثناء حذف القسم."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-zinc-50"
    >
      {/* HEADER */}

      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
                  <FolderOpen size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-black text-zinc-900">
                    الأقسام
                  </h1>

                  <p className="mt-1 text-sm text-zinc-500">
                    إدارة أقسام المتجر من Firebase
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadCategories}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-800 transition-all hover:border-black hover:bg-zinc-100"
              >
                <RefreshCw size={17} />

                تحديث
              </button>

              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                <Plus
                  size={18}
                  className="text-[#39ff14]"
                />

                إضافة قسم
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ERROR */}

        {error && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* SEARCH */}

        <div className="mb-7 rounded-[2rem] border border-zinc-200 bg-white p-4">
          <div className="relative">
            <Search
              size={19}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="ابحث عن قسم..."
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pr-11 pl-5 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
            />
          </div>
        </div>

        {/* FORM */}

        {showForm && (
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "تعديل القسم"
                    : "إضافة قسم جديد"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  البيانات دي هتتخزن مباشرة في
                  Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-black hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 p-6 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-black text-zinc-800">
                  اسم القسم
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="مثال: تيشيرتات"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-zinc-800">
                  Slug
                </label>

                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="tshirts"
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-left text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />

                <p className="mt-2 text-xs text-zinc-400">
                  بيستخدم في رابط القسم.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-zinc-800">
                  وصف القسم
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="اكتب وصف بسيط للقسم..."
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-black text-zinc-800">
                  <ImageIcon size={16} />

                  رابط صورة القسم
                </label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/category.jpg"
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-left text-sm font-semibold outline-none transition focus:border-[#39ff14] focus:bg-white focus:ring-4 focus:ring-[#39ff14]/10"
                />

                <p className="mt-2 text-xs text-zinc-400">
                  حط رابط مباشر للصورة. مش محتاج
                  Firebase Storage.
                </p>
              </div>

              {form.image && (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 md:col-span-2">
                  <img
                    src={form.image}
                    alt="معاينة القسم"
                    className="h-56 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 md:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-100"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-7 py-3 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      {editingId
                        ? "حفظ التعديل"
                        : "إضافة القسم"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-4"
                >
                  <div className="h-48 animate-pulse rounded-2xl bg-zinc-200" />

                  <div className="mt-5 h-6 w-2/3 animate-pulse rounded bg-zinc-200" />

                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-zinc-200" />
                </div>
              )
            )}
          </div>
        )}

        {/* CATEGORIES */}

        {!loading &&
          filteredCategories.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map(
                (category) => (
                  <div
                    key={category.id}
                    className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden bg-zinc-100">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={
                            category.name ||
                            "قسم"
                          }
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-zinc-950 text-[#39ff14]">
                          <FolderOpen
                            size={48}
                          />
                        </div>
                      )}

                      <div className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-black text-white">
                        {category.slug ||
                          category.id}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-black">
                        {category.name ||
                          "بدون اسم"}
                      </h2>

                      <p className="mt-2 min-h-[48px] text-sm leading-7 text-zinc-500">
                        {category.description ||
                          "لا يوجد وصف لهذا القسم."}
                      </p>

                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              category
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-black text-zinc-800 transition hover:border-black hover:bg-zinc-100"
                        >
                          <Pencil size={16} />

                          تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              category
                            )
                          }
                          disabled={
                            deletingId ===
                            category.id
                          }
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                        >
                          {deletingId ===
                          category.id ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={16}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          filteredCategories.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-[#39ff14]">
                <FolderOpen size={28} />
              </div>

              <h2 className="mt-5 text-xl font-black">
                {categories.length === 0
                  ? "مفيش أقسام لسه"
                  : "مفيش نتائج"}
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                {categories.length === 0
                  ? "ابدأ بإضافة أول قسم للمتجر."
                  : "جرب كلمة بحث مختلفة."}
              </p>

              {categories.length === 0 && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-black text-white"
                >
                  <Plus size={17} />

                  إضافة أول قسم
                </button>
              )}
            </div>
          )}
      </main>
    </div>
  );
}

export default AdminCategories;