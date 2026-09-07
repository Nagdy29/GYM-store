export const categories = [
  {
    id: "tshirts",
    name: "تيشيرتات",
    description: "تيشيرتات جيم بتصميمات مريحة وعصرية",
    icon: "👕",
  },
  {
    id: "pants",
    name: "بنطلونات",
    description: "بنطلونات مناسبة للتمرين والحركة",
    icon: "👖",
  },
  {
    id: "shorts",
    name: "شورتات",
    description: "شورتات خفيفة ومريحة للتمرين",
    icon: "🩳",
  },
  {
    id: "accessories",
    name: "إكسسوارات",
    description: "كل الإكسسوارات المهمة للچيم",
    icon: "🎒",
  },
  {
    id: "supplements",
    name: "مكملات",
    description: "اختيارات متنوعة للرياضيين",
    icon: "🥤",
  },
];

export const products = [
  {
    id: "zenger-tshirt-black",
    name: "ZENGER Performance T-Shirt",
    category: "tshirts",
    categoryName: "تيشيرتات",
    price: 499,
    oldPrice: 599,
    discount: 17,
    rating: 4.9,
    reviews: 28,
    badge: "الأكثر مبيعًا",
    description:
      "تيشيرت رياضي مريح مناسب للتمرين والجيم، بخامة خفيفة وتصميم عصري يناسب الحركة.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود", "أبيض"],
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-tshirt-white",
    name: "ZENGER Essential White",
    category: "tshirts",
    categoryName: "تيشيرتات",
    price: 449,
    oldPrice: 549,
    discount: 18,
    rating: 4.8,
    reviews: 19,
    badge: "جديد",
    description:
      "تيشيرت أبيض بسيط وعملي، مناسب للتمرين والاستخدام اليومي.",
    sizes: ["M", "L", "XL"],
    colors: ["أبيض"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-pants-black",
    name: "ZENGER Training Pants",
    category: "pants",
    categoryName: "بنطلونات",
    price: 699,
    oldPrice: 799,
    discount: 13,
    rating: 4.9,
    reviews: 34,
    badge: "مميز",
    description:
      "بنطلون رياضي عملي بستايل عصري، مناسب للتمرين والحركة اليومية.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود"],
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-shorts",
    name: "ZENGER Active Shorts",
    category: "shorts",
    categoryName: "شورتات",
    price: 399,
    oldPrice: 479,
    discount: 17,
    rating: 4.7,
    reviews: 15,
    badge: "عرض",
    description:
      "شورت رياضي خفيف ومريح، مناسب للتمارين القوية والحركة.",
    sizes: ["M", "L", "XL"],
    colors: ["أسود", "رمادي"],
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-bag",
    name: "ZENGER Gym Bag",
    category: "accessories",
    categoryName: "إكسسوارات",
    price: 599,
    oldPrice: 699,
    discount: 14,
    rating: 4.8,
    reviews: 21,
    badge: "مميز",
    description:
      "شنطة جيم عملية بتصميم أنيق ومساحة مناسبة لمستلزمات التمرين.",
    sizes: [],
    colors: ["أسود"],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-shaker",
    name: "ZENGER Sport Shaker",
    category: "accessories",
    categoryName: "إكسسوارات",
    price: 249,
    oldPrice: 299,
    discount: 17,
    rating: 4.8,
    reviews: 42,
    badge: "الأكثر مبيعًا",
    description:
      "شيكر عملي وسهل الاستخدام للتمرين والاستخدام اليومي.",
    sizes: [],
    colors: ["أسود", "أخضر"],
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-supplement",
    name: "ZENGER Performance Formula",
    category: "supplements",
    categoryName: "مكملات",
    price: 1199,
    oldPrice: 1399,
    discount: 14,
    rating: 4.9,
    reviews: 17,
    badge: "عرض خاص",
    description:
      "منتج تجريبي للواجهة فقط، وسيتم ربط منتجات المكملات الحقيقية لاحقًا من Firebase.",
    sizes: [],
    colors: [],
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: "zenger-hoodie",
    name: "ZENGER Oversized Hoodie",
    category: "tshirts",
    categoryName: "ملابس",
    price: 899,
    oldPrice: 999,
    discount: 10,
    rating: 4.9,
    reviews: 31,
    badge: "جديد",
    description:
      "هودي واسع بتصميم شبابي مناسب للچيم والخروج.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود", "رمادي"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
  },
];

export const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

export const getCategoryById = (id) => {
  return categories.find((category) => category.id === id);
};