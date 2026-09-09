import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Edit3,
  ExternalLink,
  ImageOff,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  FlaskConical,
} from "lucide-react";

import {
  addProductToFirebase,
  deleteProductFromFirebase,
  getProductsFromFirebase,
  updateProductInFirebase,
} from "../firebase/products";

import {
  getCategoriesFromFirebase,
} from "../firebase/categories";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  discount: "",
  category: "",
  categoryName: "",
  image: "",
  sizes: [],
  colors: [],
  customColor: "",
  badge: "",
  stock: "",
};

/*
 * ==========================================
 * المقاسات الجاهزة
 * ==========================================
 */

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
];

/*
 * ==========================================
 * الألوان الجاهزة
 * ==========================================
 */

const COLOR_OPTIONS = [
  {
    name: "أبيض",
    value: "أبيض",
    className:
      "bg-white border-zinc-300 text-zinc-800",
  },
  {
    name: "أسود",
    value: "أسود",
    className:
      "bg-black border-black text-white",
  },
  {
    name: "أحمر",
    value: "أحمر",
    className:
      "bg-red-500 border-red-500 text-white",
  },
  {
    name: "أزرق",
    value: "أزرق",
    className:
      "bg-blue-500 border-blue-500 text-white",
  },
  {
    name: "أخضر",
    value: "أخضر",
    className:
      "bg-green-500 border-green-500 text-white",
  },
  {
    name: "رمادي",
    value: "رمادي",
    className:
      "bg-zinc-500 border-zinc-500 text-white",
  },
  {
    name: "كحلي",
    value: "كحلي",
    className:
      "bg-slate-900 border-slate-900 text-white",
  },
];

/*
 * ==========================================
 * المنتجات التجريبية
 * ==========================================
 */

const demoProducts = [
  {
    name: "HIRAQL T-Shirt Black",
    description:
      "تيشيرت رياضي أسود من HIRAQL مناسب للتمرين والجيم والاستخدام اليومي، بخامة مريحة وتصميم بسيط.",
    price: 450,
    oldPrice: 550,
    discount: 18,
    category: "tshirts",
    categoryName: "تيشيرتات جيم",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],
    colors: [
      "أسود",
    ],
    badge: "الأكثر مبيعًا",
    stock: 25,
  },
  {
    name: "HIRAQL T-Shirt White",
    description:
      "تيشيرت HIRAQL أبيض بتصميم رياضي رايق، مناسب للجيم والتمرين والخروجات اليومية.",
    price: 450,
    oldPrice: 520,
    discount: 13,
    category: "tshirts",
    categoryName: "تيشيرتات جيم",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=900&q=80",
    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],
    colors: [
      "أبيض",
    ],
    badge: "جديد",
    stock: 20,
  },
  {
    name: "HIRAQL Gym Pants Black",
    description:
      "بنطلون جيم أسود مريح للحركة والتمرين، مناسب للتمارين اليومية والجري.",
    price: 650,
    oldPrice: 800,
    discount: 19,
    category: "pants",
    categoryName: "بنطلونات جيم",
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80",
    sizes: [
      "M",
      "L",
      "XL",
      "XXL",
    ],
    colors: [
      "أسود",
    ],
    badge: "خصم",
    stock: 15,
  },
  {
    name: "HIRAQL Gym Shorts",
    description:
      "شورت رياضي خفيف ومريح، مناسب للجيم والتمارين والحركة اليومية.",
    price: 350,
    oldPrice: 450,
    discount: 22,
    category: "shorts",
    categoryName: "شورتات جيم",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
    sizes: [
      "M",
      "L",
      "XL",
    ],
    colors: [
      "أسود",
      "رمادي",
    ],
    badge: "عرض",
    stock: 30,
  },
  {
    name: "HIRAQL Gym Bag",
    description:
      "شنطة جيم عملية بتصميم رياضي، مناسبة لحمل الملابس والأدوات والمستلزمات اليومية.",
    price: 550,
    oldPrice: 700,
    discount: 21,
    category: "bags",
    categoryName: "شنط جيم",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    sizes: [],
    colors: [
      "أسود",
    ],
    badge: "مميز",
    stock: 12,
  },
];

/*
 * ==========================================
 * تنظيف وتحويل روابط الصور
 * ==========================================
 */

function normalizeImageUrl(value) {
  const url = String(
    value || ""
  ).trim();

  if (!url) {
    return "";
  }

  const driveFileMatch =
    url.match(
      /drive\.google\.com\/file\/d\/([^/]+)/
    );

  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  try {
    const parsedUrl =
      new URL(url);

    if (
      parsedUrl.hostname.includes(
        "drive.google.com"
      )
    ) {
      const driveId =
        parsedUrl.searchParams.get(
          "id"
        );

      if (driveId) {
        return `https://drive.google.com/uc?export=view&id=${driveId}`;
      }
    }
  } catch {
    // تجاهل
  }

  if (
    url.includes(
      "drive.google.com/uc"
    ) &&
    url.includes("id=")
  ) {
    try {
      const parsedUrl =
        new URL(url);

      const driveId =
        parsedUrl.searchParams.get(
          "id"
        );

      if (driveId) {
        return `https://drive.google.com/uc?export=view&id=${driveId}`;
      }
    } catch {
      // تجاهل
    }
  }

  if (
    url.includes(
      "drive.google.com/open"
    )
  ) {
    try {
      const parsedUrl =
        new URL(url);

      const driveId =
        parsedUrl.searchParams.get(
          "id"
        );

      if (driveId) {
        return `https://drive.google.com/uc?export=view&id=${driveId}`;
      }
    } catch {
      // تجاهل
    }
  }

  if (
    url.includes("i.ibb.co") ||
    url.includes("i.imgur.com")
  ) {
    return url;
  }

  return url;
}

/*
 * ==========================================
 * معرفة نوع رابط الصورة
 * ==========================================
 */

function getImageUrlType(value) {
  const url = String(
    value || ""
  ).trim();

  if (!url) {
    return "empty";
  }

  if (
    url.includes(
      "drive.google.com"
    )
  ) {
    return "drive";
  }

  if (url.includes("i.ibb.co")) {
    return "direct";
  }

  if (url.includes("ibb.co/")) {
    return "imgbb-page";
  }

  return "other";
}

/*
 * ==========================================
 * Admin Products
 * ==========================================
 */

function AdminProducts() {
  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [addingDemo, setAddingDemo] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState(null);

  const [
    deleteProduct,
    setDeleteProduct,
  ] = useState(null);

  const [form, setForm] =
    useState(emptyForm);

  /*
   * ==========================================
   * تحميل المنتجات
   * ==========================================
   */

  const loadProducts =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const firebaseProducts =
            await getProductsFromFirebase();

          setProducts(
            Array.isArray(
              firebaseProducts
            )
              ? firebaseProducts
              : []
          );
        } catch (error) {
          console.error(
            "Firebase products error:",
            error
          );

          setError(
            "حصل خطأ في تحميل المنتجات من Firebase. اتأكد إن Firestore متفعل وقواعد الوصول مظبوطة."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /*
   * ==========================================
   * تحميل الأقسام
   * ==========================================
   */

  const loadCategories =
    useCallback(
      async () => {
        try {
          setCategoriesLoading(
            true
          );

          const firebaseCategories =
            await getCategoriesFromFirebase();

          setCategories(
            Array.isArray(
              firebaseCategories
            )
              ? firebaseCategories
              : []
          );
        } catch (error) {
          console.error(
            "Firebase categories error:",
            error
          );

          setCategories([]);

          setError(
            "حصل خطأ في تحميل الأقسام من Firebase."
          );
        } finally {
          setCategoriesLoading(
            false
          );
        }
      },
      []
    );

  /*
   * ==========================================
   * LOAD
   * ==========================================
   */

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [
    loadProducts,
    loadCategories,
  ]);

  /*
   * ==========================================
   * MATCH DEMO CATEGORY
   * ==========================================
   */

  const findDemoCategory = (
    demoProduct
  ) => {
    const demoCategory =
      String(
        demoProduct.category ||
          ""
      )
        .trim()
        .toLowerCase();

    const demoCategoryName =
      String(
        demoProduct.categoryName ||
          ""
      )
        .trim()
        .toLowerCase();

    return categories.find(
      (category) => {
        const id =
          String(
            category.id || ""
          )
            .trim()
            .toLowerCase();

        const slug =
          String(
            category.slug || ""
          )
            .trim()
            .toLowerCase();

        const name =
          String(
            category.name || ""
          )
            .trim()
            .toLowerCase();

        return (
          id === demoCategory ||
          slug === demoCategory ||
          name === demoCategory ||
          name === demoCategoryName
        );
      }
    );
  };

  /*
   * ==========================================
   * ADD DEMO PRODUCTS
   * ==========================================
   */

  const handleAddDemoProducts =
    async () => {
      if (
        addingDemo ||
        saving
      ) {
        return;
      }

      if (
        categories.length ===
        0
      ) {
        setError(
          "لازم تضيف الأقسام من لوحة التحكم الأول قبل إضافة المنتجات التجريبية."
        );

        return;
      }

      try {
        setAddingDemo(true);
        setError("");
        setSuccess("");

        let addedCount = 0;
        let skippedCount = 0;

        for (
          const product of demoProducts
        ) {
          const firebaseCategory =
            findDemoCategory(
              product
            );

          if (
            !firebaseCategory
          ) {
            skippedCount +=
              1;
            continue;
          }

          await addProductToFirebase(
            {
              ...product,
              category:
                firebaseCategory.id,
              categoryName:
                firebaseCategory.name,
              image:
                normalizeImageUrl(
                  product.image
                ),
              sizes:
                Array.isArray(
                  product.sizes
                )
                  ? product.sizes
                  : [],
              colors:
                Array.isArray(
                  product.colors
                )
                  ? product.colors
                  : [],
            }
          );

          addedCount += 1;
        }

        await loadProducts();

        if (
          addedCount === 0
        ) {
          setError(
            "ملقيناش أي قسم مطابق للمنتجات التجريبية."
          );
        } else {
          setSuccess(
            `تم إضافة ${addedCount} منتجات تجريبية بنجاح ✅${
              skippedCount >
              0
                ? ` وتم تخطي ${skippedCount} بسبب عدم وجود القسم المطابق.`
                : ""
            }`
          );
        }
      } catch (error) {
        console.error(
          "Add demo products error:",
          error
        );

        setError(
          "حصل خطأ أثناء إضافة المنتجات التجريبية."
        );
      } finally {
        setAddingDemo(false);
      }
    };

  /*
   * ==========================================
   * SEARCH
   * ==========================================
   */

  const filteredProducts =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return products;
      }

      return products.filter(
        (product) => {
          const name =
            String(
              product.name ||
                ""
            ).toLowerCase();

          const categoryName =
            String(
              product.categoryName ||
                ""
            ).toLowerCase();

          const category =
            categories.find(
              (item) =>
                item.id ===
                product.category
            );

          const firebaseCategoryName =
            String(
              category?.name ||
                ""
            ).toLowerCase();

          return (
            name.includes(
              value
            ) ||
            categoryName.includes(
              value
            ) ||
            firebaseCategoryName.includes(
              value
            )
          );
        }
      );
    }, [
      products,
      categories,
      search,
    ]);

  /*
   * ==========================================
   * OPEN ADD
   * ==========================================
   */

  const handleOpenAdd = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      sizes: [],
      colors: [],
      customColor: "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /*
   * ==========================================
   * OPEN EDIT
   * ==========================================
   */

  const handleOpenEdit = (
    product
  ) => {
    setEditingProduct(
      product
    );

    const firebaseCategory =
      categories.find(
        (category) =>
          category.id ===
          product.category
      );

    setForm({
      name:
        product.name || "",

      description:
        product.description ||
        "",

      price:
        product.price ?? "",

      oldPrice:
        product.oldPrice ?? "",

      discount:
        product.discount ?? "",

      category:
        product.category || "",

      categoryName:
        firebaseCategory?.name ||
        product.categoryName ||
        "",

      image:
        product.image || "",

      sizes:
        Array.isArray(
          product.sizes
        )
          ? product.sizes
          : [],

      colors:
        Array.isArray(
          product.colors
        )
          ? product.colors
          : [],

      customColor: "",

      badge:
        product.badge || "",

      stock:
        product.stock ?? "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /*
   * ==========================================
   * CLOSE MODAL
   * ==========================================
   */

  const handleCloseModal =
    () => {
      if (saving) {
        return;
      }

      setShowModal(false);
      setEditingProduct(null);

      setForm({
        ...emptyForm,
        sizes: [],
        colors: [],
        customColor: "",
      });

      setError("");
      setSuccess("");
    };

  /*
   * ==========================================
   * CHANGE
   * ==========================================
   */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "image"
          ? normalizeImageUrl(
              value
            )
          : value,
    }));

    if (error) {
      setError("");
    }
  };

  /*
   * ==========================================
   * CATEGORY CHANGE
   * ==========================================
   */

  const handleCategoryChange =
    (event) => {
      const categoryId =
        event.target.value;

      const selectedCategory =
        categories.find(
          (category) =>
            category.id ===
            categoryId
        );

      setForm((current) => ({
        ...current,
        category:
          categoryId,
        categoryName:
          selectedCategory?.name ||
          "",
      }));

      setError("");
    };

  /*
   * ==========================================
   * SIZE TOGGLE
   * ==========================================
   */

  const toggleSize = (
    size
  ) => {
    setForm((current) => {
      const currentSizes =
        Array.isArray(
          current.sizes
        )
          ? current.sizes
          : [];

      const exists =
        currentSizes.includes(
          size
        );

      return {
        ...current,
        sizes: exists
          ? currentSizes.filter(
              (item) =>
                item !== size
            )
          : [
              ...currentSizes,
              size,
            ],
      };
    });

    setError("");
  };

  /*
   * ==========================================
   * SELECT ALL SIZES
   * ==========================================
   */

  const selectAllSizes =
    () => {
      setForm((current) => ({
        ...current,
        sizes: [
          ...SIZE_OPTIONS,
        ],
      }));
    };

  /*
   * ==========================================
   * CLEAR SIZES
   * ==========================================
   */

  const clearSizes = () => {
    setForm((current) => ({
      ...current,
      sizes: [],
    }));
  };

  /*
   * ==========================================
   * COLOR TOGGLE
   * ==========================================
   */

  const toggleColor = (
    color
  ) => {
    setForm((current) => {
      const currentColors =
        Array.isArray(
          current.colors
        )
          ? current.colors
          : [];

      const exists =
        currentColors.includes(
          color
        );

      return {
        ...current,
        colors: exists
          ? currentColors.filter(
              (item) =>
                item !== color
            )
          : [
              ...currentColors,
              color,
            ],
      };
    });

    setError("");
  };

  /*
   * ==========================================
   * ADD CUSTOM COLOR
   * ==========================================
   */

  const handleAddCustomColor =
    () => {
      const customColor =
        String(
          form.customColor ||
            ""
        ).trim();

      if (!customColor) {
        return;
      }

      const exists =
        form.colors.includes(
          customColor
        );

      if (exists) {
        setForm((current) => ({
          ...current,
          customColor: "",
        }));

        return;
      }

      setForm((current) => ({
        ...current,

        colors: [
          ...current.colors,
          customColor,
        ],

        customColor: "",
      }));

      setError("");
    };

  /*
   * ==========================================
   * REMOVE CUSTOM / ANY COLOR
   * ==========================================
   */

  const removeColor = (
    color
  ) => {
    setForm((current) => ({
      ...current,

      colors:
        current.colors.filter(
          (item) =>
            item !== color
        ),
    }));
  };

  /*
   * ==========================================
   * IMAGE UPLOADER
   * ==========================================
   */

  const handleOpenImageUploader =
    () => {
      window.open(
        "https://imgbb.com/",
        "_blank",
        "noopener,noreferrer"
      );
    };

  /*
   * ==========================================
   * GOOGLE DRIVE
   * ==========================================
   */

  const handleOpenDrive = () => {
    window.open(
      "https://drive.google.com/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * ==========================================
   * VALIDATE
   * ==========================================
   */

  const validateForm = () => {
    if (!form.name.trim()) {
      return "اكتب اسم المنتج.";
    }

    if (
      !form.price ||
      Number(form.price) <=
        0
    ) {
      return "اكتب سعر صحيح للمنتج.";
    }

    if (!form.category) {
      return "اختار قسم المنتج.";
    }

    const selectedCategory =
      categories.find(
        (category) =>
          category.id ===
          form.category
      );

    if (!selectedCategory) {
      return "القسم المختار غير موجود في Firebase.";
    }

    if (
      form.stock !== "" &&
      Number(form.stock) < 0
    ) {
      return "المخزون لا يمكن أن يكون بالسالب.";
    }

    if (
      form.discount !== "" &&
      (Number(
        form.discount
      ) < 0 ||
        Number(
          form.discount
        ) > 100)
    ) {
      return "الخصم لازم يكون بين 0 و 100.";
    }

    if (
      getImageUrlType(
        form.image
      ) === "imgbb-page"
    ) {
      return "رابط ImgBB ده رابط صفحة مش رابط الصورة. استخدم Direct Link.";
    }

    return "";
  };

  /*
   * ==========================================
   * SAVE PRODUCT
   * ==========================================
   */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const validationError =
        validateForm();

      if (validationError) {
        setError(
          validationError
        );

        return;
      }

      const selectedCategory =
        categories.find(
          (category) =>
            category.id ===
            form.category
        );

      const normalizedImage =
        normalizeImageUrl(
          form.image
        );

      const productData = {
        name:
          form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(form.price),

        oldPrice:
          form.oldPrice === ""
            ? 0
            : Number(
                form.oldPrice
              ),

        discount:
          form.discount === ""
            ? 0
            : Number(
                form.discount
              ),

        category:
          selectedCategory.id,

        categoryName:
          selectedCategory.name,

        image:
          normalizedImage,

        sizes:
          Array.isArray(
            form.sizes
          )
            ? form.sizes
            : [],

        colors:
          Array.isArray(
            form.colors
          )
            ? form.colors
            : [],

        badge:
          form.badge.trim(),

        stock:
          form.stock === ""
            ? 0
            : Number(
                form.stock
              ),
      };

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        if (
          editingProduct
        ) {
          await updateProductInFirebase(
            editingProduct.id,
            productData
          );

          setSuccess(
            "تم تعديل المنتج بنجاح ✅"
          );
        } else {
          await addProductToFirebase(
            productData
          );

          setSuccess(
            "تم إضافة المنتج بنجاح ✅"
          );
        }

        await loadProducts();

        setTimeout(() => {
          setShowModal(
            false
          );

          setEditingProduct(
            null
          );

          setForm({
            ...emptyForm,
            sizes: [],
            colors: [],
            customColor:
              "",
          });

          setSuccess("");
        }, 800);
      } catch (error) {
        console.error(
          "Save product error:",
          error
        );

        setError(
          "حصل خطأ أثناء حفظ المنتج في Firebase."
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * ==========================================
   * DELETE
   * ==========================================
   */

  const handleDelete =
    async () => {
      if (!deleteProduct) {
        return;
      }

      try {
        setError("");
        setSuccess("");

        await deleteProductFromFirebase(
          deleteProduct.id
        );

        setProducts(
          (
            currentProducts
          ) =>
            currentProducts.filter(
              (product) =>
                product.id !==
                deleteProduct.id
            )
        );

        setSuccess(
          "تم حذف المنتج بنجاح 🗑️"
        );
      } catch (error) {
        console.error(
          "Delete product error:",
          error
        );

        setError(
          "حصل خطأ أثناء حذف المنتج."
        );
      } finally {
        setDeleteProduct(
          null
        );
      }
    };

  /*
   * ==========================================
   * IMAGE TYPE
   * ==========================================
   */

  const imageType =
    getImageUrlType(
      form.image
    );

  return (
    <div dir="rtl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <span className="text-xs font-black text-[#16a34a]">
            ADMIN / PRODUCTS
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            المنتجات
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            إدارة المنتجات والأقسام من
            Firebase.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={
              loadProducts
            }
            disabled={
              loading ||
              addingDemo
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            تحديث
          </button>

          <button
            type="button"
            onClick={
              handleOpenAdd
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            <Plus size={18} />

            إضافة منتج
          </button>

        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-black text-green-700">
          {success}
        </div>
      )}

      {/* SEARCH */}

      <div className="relative mt-7">
        <Search
          size={19}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target
                .value
            )
          }
          placeholder="ابحث عن منتج أو قسم..."
          className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pr-12 pl-4 text-sm font-bold outline-none transition focus:border-black"
        />
      </div>

      {/* CATEGORY STATUS */}

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-[#39ff14]">
            <FlaskConical size={16} />
          </div>

          <div>
            <p className="text-xs font-black text-zinc-900">
              الأقسام
            </p>

            <p className="text-[10px] font-bold text-zinc-400">
              مصدرها Firebase
            </p>
          </div>

        </div>

        <div className="mr-auto flex items-center gap-2">

          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-black text-zinc-700">
            {
              categories.length
            }{" "}
            قسم
          </span>

          <button
            type="button"
            onClick={
              loadCategories
            }
            disabled={
              categoriesLoading
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 text-[11px] font-black text-zinc-700 transition hover:border-black hover:bg-zinc-50 disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={
                categoriesLoading
                  ? "animate-spin"
                  : ""
              }
            />

            تحديث الأقسام
          </button>

        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-16 text-center">

          <LoaderCircle
            size={35}
            className="mx-auto animate-spin text-[#16a34a]"
          />

          <p className="mt-4 text-sm font-black text-zinc-700">
            جاري تحميل المنتجات...
          </p>

        </div>
      )}

      {/* MOBILE */}

      {!loading &&
        filteredProducts.length >
          0 && (
          <div className="mt-6 grid gap-4 md:hidden">

            {filteredProducts.map(
              (product) => {
                const firebaseCategory =
                  categories.find(
                    (
                      category
                    ) =>
                      category.id ===
                      product.category
                  );

                return (
                  <div
                    key={
                      product.id
                    }
                    className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-4">

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100">

                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="h-full w-full object-cover"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageOff
                              size={22}
                              className="text-zinc-300"
                            />
                          </div>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-[10px] font-bold text-zinc-400">
                          {
                            firebaseCategory?.name ||
                            product.categoryName ||
                            "بدون قسم"
                          }
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-sm font-black">
                          {
                            product.name
                          }
                        </h3>

                        <p className="mt-2 font-black">
                          {Number(
                            product.price ||
                              0
                          ).toLocaleString(
                            "ar-EG"
                          )}{" "}
                          جنيه
                        </p>

                        <p className="mt-1 text-xs font-bold text-zinc-400">
                          المخزون:{" "}
                          {Number(
                            product.stock ||
                              0
                          ).toLocaleString(
                            "ar-EG"
                          )}
                        </p>

                        <div className="mt-3 flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs font-black transition hover:bg-black hover:text-white"
                          >
                            <Edit3
                              size={14}
                            />

                            تعديل
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteProduct(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2
                              size={14}
                            />

                            حذف
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

          </div>
        )}

      {/* DESKTOP TABLE */}

      {!loading &&
        filteredProducts.length >
          0 && (
          <div className="mt-6 hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-right">

                <thead className="bg-zinc-50">
                  <tr>

                    <th className="px-5 py-4 text-xs font-black">
                      المنتج
                    </th>

                    <th className="px-5 py-4 text-xs font-black">
                      القسم
                    </th>

                    <th className="px-5 py-4 text-xs font-black">
                      السعر
                    </th>

                    <th className="px-5 py-4 text-xs font-black">
                      المخزون
                    </th>

                    <th className="px-5 py-4 text-xs font-black">
                      التقييم
                    </th>

                    <th className="px-5 py-4 text-xs font-black">
                      الإجراء
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {
                      const firebaseCategory =
                        categories.find(
                          (
                            category
                          ) =>
                            category.id ===
                            product.category
                        );

                      return (
                        <tr
                          key={
                            product.id
                          }
                          className="border-t border-zinc-100 transition hover:bg-zinc-50"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">

                                {product.image ? (
                                  <img
                                    src={
                                      product.image
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.style.display =
                                        "none";
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <ImageOff
                                      size={
                                        20
                                      }
                                      className="text-zinc-300"
                                    />
                                  </div>
                                )}

                              </div>

                              <span className="max-w-xs text-sm font-black">
                                {
                                  product.name
                                }
                              </span>

                            </div>

                          </td>

                          <td className="px-5 py-4 text-xs text-zinc-500">
                            {
                              firebaseCategory?.name ||
                              product.categoryName ||
                              "بدون قسم"
                            }
                          </td>

                          <td className="px-5 py-4 text-sm font-black">
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "ar-EG"
                            )}{" "}
                            جنيه
                          </td>

                          <td className="px-5 py-4 text-sm font-bold">
                            {Number(
                              product.stock ||
                                0
                            ).toLocaleString(
                              "ar-EG"
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold">
                            ★{" "}
                            {Number(
                              product.rating ||
                                0
                            ).toLocaleString(
                              "ar-EG"
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <div className="flex gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenEdit(
                                    product
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-black transition-all hover:bg-black hover:text-white"
                              >
                                <Edit3
                                  size={
                                    14
                                  }
                                />

                                تعديل
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteProduct(
                                    product
                                  )
                                }
                                className="inline-flex items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-red-500 transition hover:bg-red-100"
                                title="حذف المنتج"
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>
              </table>

            </div>
          </div>
        )}

      {/* EMPTY */}

      {!loading &&
        filteredProducts.length ===
          0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">

            <Search
              size={35}
              className="mx-auto text-zinc-300"
            />

            <p className="mt-4 font-black">
              {search
                ? "مفيش منتجات مطابقة"
                : "مفيش منتجات لسه"}
            </p>

            {!search && (
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    handleAddDemoProducts
                  }
                  disabled={
                    addingDemo ||
                    categoriesLoading
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#39ff14] px-5 py-3 text-sm font-black text-black transition hover:bg-[#32e611] disabled:opacity-50"
                >
                  {addingDemo ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <FlaskConical
                      size={17}
                    />
                  )}

                  إضافة 5 منتجات تجريبية
                </button>

                <button
                  type="button"
                  onClick={
                    handleOpenAdd
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-black text-white"
                >
                  <Plus size={17} />

                  إضافة أول منتج
                </button>

              </div>
            )}
          </div>
        )}

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-zinc-100 p-5">

              <div>
                <h2 className="text-xl font-black text-zinc-950">
                  {editingProduct
                    ? "تعديل المنتج"
                    : "إضافة منتج جديد"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  البيانات هتتحفظ مباشرة في Firebase Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-black"
              >
                <X size={19} />
              </button>

            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="max-h-[calc(92vh-90px)] overflow-y-auto p-5"
            >

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-black text-green-700">
                  {success}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-black">
                    اسم المنتج
                  </label>

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="مثال: HIRAQL T-Shirt Black"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-black focus:bg-white"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-black">
                    وصف المنتج
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                    placeholder="اكتب وصف المنتج..."
                    className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-black focus:bg-white"
                  />

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-2 block text-sm font-black">
                    السعر
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={
                      form.price
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="500"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none focus:border-black focus:bg-white"
                  />

                </div>

                {/* OLD PRICE */}

                <div>

                  <label className="mb-2 block text-sm font-black">
                    السعر القديم
                  </label>

                  <input
                    name="oldPrice"
                    type="number"
                    min="0"
                    value={
                      form.oldPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="650"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none focus:border-black focus:bg-white"
                  />

                </div>

                {/* DISCOUNT */}

                <div>

                  <label className="mb-2 block text-sm font-black">
                    الخصم %
                  </label>

                  <input
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={
                      form.discount
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="20"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none focus:border-black focus:bg-white"
                  />

                </div>

                {/* STOCK */}

                <div>

                  <label className="mb-2 block text-sm font-black">
                    المخزون
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="10"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none focus:border-black focus:bg-white"
                  />

                </div>

                {/* CATEGORY */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-black">
                    القسم
                  </label>

                  <select
                    value={
                      form.category
                    }
                    onChange={
                      handleCategoryChange
                    }
                    disabled={
                      categoriesLoading ||
                      categories.length ===
                        0
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <option value="">
                      {categoriesLoading
                        ? "جاري تحميل الأقسام..."
                        : categories.length ===
                            0
                          ? "مفيش أقسام في Firebase"
                          : "اختار القسم"}
                    </option>

                    {categories.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}

                  </select>

                  {form.category && (
                    <p className="mt-2 text-[11px] font-bold text-green-600">
                      ✅ القسم المختار:{" "}
                      {
                        form.categoryName
                      }
                    </p>
                  )}

                </div>

                {/* BADGE */}

                <div>

                  <label className="mb-2 block text-sm font-black">
                    شارة المنتج
                  </label>

                  <input
                    name="badge"
                    value={
                      form.badge
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="جديد / الأكثر مبيعًا"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-black focus:bg-white"
                  />

                </div>

                {/* =====================================================
                    SIZES
                ====================================================== */}

                <div className="sm:col-span-2">

                  <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <label className="block text-sm font-black">
                        المقاسات
                      </label>

                      <p className="mt-1 text-[11px] text-zinc-400">
                        اختار المقاسات المتاحة للمنتج.
                      </p>
                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={
                          selectAllSizes
                        }
                        className="rounded-xl bg-zinc-100 px-3 py-2 text-[10px] font-black text-zinc-700 transition hover:bg-black hover:text-white"
                      >
                        اختيار الكل
                      </button>

                      <button
                        type="button"
                        onClick={
                          clearSizes
                        }
                        className="rounded-xl bg-zinc-100 px-3 py-2 text-[10px] font-black text-zinc-500 transition hover:bg-zinc-200"
                      >
                        مسح
                      </button>

                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">

                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">

                      {SIZE_OPTIONS.map(
                        (size) => {
                          const selected =
                            form.sizes.includes(
                              size
                            );

                          return (
                            <button
                              key={
                                size
                              }
                              type="button"
                              onClick={() =>
                                toggleSize(
                                  size
                                )
                              }
                              className={`
                                h-11
                                rounded-xl
                                border
                                text-xs
                                font-black
                                transition-all
                                duration-200
                                ${
                                  selected
                                    ? "border-black bg-black text-[#39ff14] shadow-md"
                                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:-translate-y-0.5"
                                }
                              `}
                            >
                              {size}
                            </button>
                          );
                        }
                      )}

                    </div>

                    <div className="mt-4 rounded-xl bg-white px-4 py-3">

                      <p className="text-[10px] font-bold text-zinc-400">
                        المقاسات المختارة
                      </p>

                      {form.sizes.length >
                      0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">

                          {form.sizes.map(
                            (
                              size
                            ) => (
                              <span
                                key={
                                  size
                                }
                                className="rounded-lg bg-black px-3 py-1.5 text-[10px] font-black text-[#39ff14]"
                              >
                                {size}
                              </span>
                            )
                          )}

                        </div>
                      ) : (
                        <p className="mt-1 text-xs font-bold text-zinc-400">
                          مفيش مقاسات مختارة.
                        </p>
                      )}

                    </div>

                  </div>
                </div>

                {/* =====================================================
                    COLORS
                ====================================================== */}

                <div className="sm:col-span-2">

                  <div className="mb-2">

                    <label className="block text-sm font-black">
                      الألوان
                    </label>

                    <p className="mt-1 text-[11px] text-zinc-400">
                      اختار لون أو أكتر، ولو اللون
                      مش موجود اكتبه يدويًا.
                    </p>

                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                      {COLOR_OPTIONS.map(
                        (color) => {
                          const selected =
                            form.colors.includes(
                              color.value
                            );

                          return (
                            <button
                              key={
                                color.value
                              }
                              type="button"
                              onClick={() =>
                                toggleColor(
                                  color.value
                                )
                              }
                              className={`
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                px-3
                                py-2.5
                                text-right
                                text-xs
                                font-black
                                transition-all
                                duration-200
                                ${
                                  selected
                                    ? "border-black bg-black text-white shadow-md"
                                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:-translate-y-0.5"
                                }
                              `}
                            >

                              <span
                                className={`h-6 w-6 shrink-0 rounded-full border ${color.className}`}
                              />

                              <span className="flex-1">
                                {
                                  color.name
                                }
                              </span>

                              {selected && (
                                <span className="text-[#39ff14]">
                                  ✓
                                </span>
                              )}

                            </button>
                          );
                        }
                      )}

                    </div>

                    {/* CUSTOM COLOR */}

                    <div className="mt-4 border-t border-zinc-200 pt-4">

                      <label className="mb-2 block text-xs font-black text-zinc-700">
                        لون إضافي
                      </label>

                      <div className="flex gap-2">

                        <input
                          value={
                            form.customColor
                          }
                          onChange={(
                            event
                          ) =>
                            setForm(
                              (
                                current
                              ) => ({
                                ...current,
                                customColor:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          onKeyDown={(
                            event
                          ) => {
                            if (
                              event.key ===
                              "Enter"
                            ) {
                              event.preventDefault();

                              handleAddCustomColor();
                            }
                          }}
                          placeholder="مثال: موف، بيج، نبيتي..."
                          className="h-12 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold outline-none transition focus:border-black"
                        />

                        <button
                          type="button"
                          onClick={
                            handleAddCustomColor
                          }
                          className="h-12 rounded-xl bg-black px-5 text-xs font-black text-white transition hover:bg-zinc-800"
                        >
                          إضافة
                        </button>

                      </div>

                    </div>

                    {/* SELECTED COLORS */}

                    <div className="mt-4 rounded-xl bg-white p-4">

                      <p className="text-[10px] font-bold text-zinc-400">
                        الألوان المختارة
                      </p>

                      {form.colors.length >
                      0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">

                          {form.colors.map(
                            (
                              color
                            ) => (
                              <span
                                key={
                                  color
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-[10px] font-black text-zinc-700"
                              >
                                {
                                  color
                                }

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeColor(
                                      color
                                    )
                                  }
                                  className="text-zinc-400 transition hover:text-red-500"
                                  aria-label={`حذف اللون ${color}`}
                                >
                                  <X
                                    size={
                                      12
                                    }
                                  />
                                </button>
                              </span>
                            )
                          )}

                        </div>
                      ) : (
                        <p className="mt-1 text-xs font-bold text-zinc-400">
                          مفيش ألوان مختارة.
                        </p>
                      )}

                    </div>

                  </div>
                </div>

                {/* =====================================================
                    IMAGE
                ====================================================== */}

                <div className="sm:col-span-2">

                  <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <label className="block text-sm font-black">
                      صورة المنتج
                    </label>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={
                          handleOpenImageUploader
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#39ff14] px-4 py-2.5 text-xs font-black text-black transition-all hover:-translate-y-0.5 hover:bg-[#32e611] hover:shadow-lg"
                      >
                        <ExternalLink
                          size={15}
                        />

                        رفع على ImgBB
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleOpenDrive
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-black text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
                      >
                        <ExternalLink
                          size={15}
                        />

                        فتح Google Drive
                      </button>

                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#39ff14]/30 bg-[#39ff14]/5 p-4">

                    <p className="text-sm font-black text-zinc-900">
                      📸 طرق إضافة الصورة
                    </p>

                    <div className="mt-3 space-y-3 text-xs font-bold leading-6 text-zinc-600">

                      <div>
                        <p className="font-black text-zinc-900">
                          الطريقة الأولى — ImgBB
                        </p>

                        <p>
                          ارفع الصورة ثم انسخ{" "}
                          <span className="mx-1 font-black text-green-600">
                            Direct Link
                          </span>
                          اللي بيبدأ بـ:
                        </p>

                        <code className="mt-1 block overflow-x-auto rounded-lg bg-black p-2 text-[10px] text-[#39ff14]">
                          https://i.ibb.co/xxxxx/image.jpg
                        </code>

                        <p className="mt-1 text-red-500">
                          ❌ ما تستخدمش:
                          https://ibb.co/xxxxx
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-zinc-900">
                          الطريقة الثانية — Google Drive
                        </p>

                        <p>
                          خلي الصورة في Google Drive
                          واضبط المشاركة على:
                        </p>

                        <p className="mt-1 font-black text-green-700">
                          Anyone with the link → Viewer
                        </p>

                      </div>

                    </div>
                  </div>

                  <div className="mt-3">

                    <input
                      name="image"
                      value={
                        form.image
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="ImgBB أو Google Drive image URL"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-black focus:bg-white"
                    />

                    {form.image && (
                      <div className="mt-2">

                        {imageType ===
                          "drive" && (
                          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold leading-5 text-green-700">
                            ✅ Google Drive — الكود هيحوّل الرابط تلقائيًا.
                          </div>
                        )}

                        {imageType ===
                          "direct" && (
                          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold leading-5 text-green-700">
                            ✅ Direct Image URL — الرابط مناسب للعرض.
                          </div>
                        )}

                        {imageType ===
                          "imgbb-page" && (
                          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold leading-5 text-red-700">
                            ❌ ده رابط صفحة ImgBB وليس رابط الصورة.
                          </div>
                        )}

                        {imageType ===
                          "other" && (
                          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold leading-5 text-zinc-500">
                            🔗 تم إدخال رابط — هنحاول عرضه مباشرة.
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {form.image &&
                    imageType !==
                      "imgbb-page" && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">

                        <div className="flex h-8 items-center justify-between border-b border-zinc-200 bg-white px-3">

                          <span className="text-[10px] font-black text-zinc-400">
                            معاينة الصورة
                          </span>

                          <span className="text-[10px] font-bold text-green-600">
                            مباشر من الرابط
                          </span>

                        </div>

                        <div className="relative flex h-56 items-center justify-center">

                          <img
                            src={normalizeImageUrl(
                              form.image
                            )}
                            alt="معاينة المنتج"
                            className="h-full w-full object-contain"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                "none";

                              const parent =
                                event
                                  .currentTarget
                                  .parentElement;

                              if (
                                parent &&
                                !parent.querySelector(
                                  "[data-image-error]"
                                )
                              ) {
                                const message =
                                  document.createElement(
                                    "div"
                                  );

                                message.setAttribute(
                                  "data-image-error",
                                  "true"
                                );

                                message.className =
                                  "px-5 text-center text-xs font-bold text-red-500";

                                message.innerText =
                                  "❌ الصورة مش قادرة تظهر. اتأكد إن الرابط مباشر وإن الصورة Public.";

                                parent.appendChild(
                                  message
                                );
                              }
                            }}
                          />

                        </div>
                      </div>
                    )}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    saving
                  }
                  className="flex-1 rounded-2xl border border-zinc-200 px-5 py-3.5 text-sm font-black text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    categoriesLoading ||
                    categories.length ===
                      0
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />

                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />

                      {editingProduct
                        ? "حفظ التعديلات"
                        : "إضافة المنتج"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              حذف المنتج؟
            </h2>

            <p className="mt-2 text-sm leading-7 text-zinc-500">
              أنت على وشك حذف المنتج:
            </p>

            <p className="mt-1 font-black text-zinc-950">
              {
                deleteProduct.name
              }
            </p>

            <p className="mt-2 text-xs text-red-500">
              العملية دي مش ممكن التراجع عنها.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeleteProduct(
                    null
                  )
                }
                className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                className="flex-1 rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600"
              >
                حذف نهائي
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
