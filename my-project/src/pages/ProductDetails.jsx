import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";

import {
  getProductByIdFromFirebase,
  getProductsFromFirebase,
} from "../firebase/products";

import { useCart } from "../context/CartContext";

import ProductReviews from "../components/ProductReviews";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [selectedSize, setSelectedSize] =
    useState(null);

  const [selectedColor, setSelectedColor] =
    useState(null);

  const [showToast, setShowToast] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const currentProduct =
          await getProductByIdFromFirebase(id);

        if (!mounted) return;

        if (!currentProduct) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(currentProduct);

        setQuantity(1);

        setSelectedSize(
          currentProduct.sizes?.[0] ||
            null
        );

        setSelectedColor(
          currentProduct.colors?.[0] ||
            null
        );

        const allProducts =
          await getProductsFromFirebase();

        if (!mounted) return;

        const related =
          allProducts
            .filter(
              (item) =>
                item.category ===
                  currentProduct.category &&
                item.id !==
                  currentProduct.id
            )
            .slice(0, 3);

        setRelatedProducts(related);
      } catch (firebaseError) {
        console.error(
          "Product Details Firebase Error:",
          firebaseError
        );

        if (mounted) {
          setError(
            "حصل خطأ أثناء تحميل المنتج."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast]);

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity, {
      size: selectedSize,
      color: selectedColor,
    });

    showSuccessToast(
      `${product.name} اتضاف للسلة بنجاح`
    );
  };

  const handleBuyNow = () => {
    if (!product) return;

    addToCart(product, quantity, {
      size: selectedSize,
      color: selectedColor,
    });

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-[2rem] bg-zinc-100" />

          <div className="space-y-5 py-5">
            <div className="h-8 w-32 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="h-24 w-full animate-pulse rounded-2xl bg-zinc-100" />
            <div className="h-16 w-1/2 animate-pulse rounded-2xl bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <X size={34} />
        </div>

        <h1 className="mt-6 text-2xl font-black sm:text-3xl">
          حصلت مشكلة
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          {error}
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-4 font-black text-white transition-all hover:-translate-y-1"
        >
          العودة للمنتجات
          <ArrowLeft size={18} />
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
          <ShoppingBag
            size={34}
            className="text-zinc-400"
          />
        </div>

        <h1 className="mt-6 text-2xl font-black sm:text-3xl">
          المنتج غير موجود
        </h1>

        <p className="mt-3 text-sm text-zinc-500">
          المنتج اللي بتدور عليه مش متاح حاليًا.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-4 font-black text-white transition-all hover:-translate-y-1"
        >
          العودة للمنتجات
          <ArrowLeft size={18} />
        </Link>
      </div>
    );
  }

  const discountValue =
    Number(product.oldPrice || 0) -
    Number(product.price || 0);

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* TOAST */}
      <div
        className={`fixed right-4 top-24 z-[100] w-[calc(100%-2rem)] max-w-sm transition-all duration-300 sm:right-6 ${
          showToast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-5 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-[#39ff14]/20 bg-black p-4 text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#39ff14] text-black">
              <CheckCircle2 size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black">
                تمت الإضافة للسلة
              </p>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-400">
                {toastMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowToast(false)
              }
              className="text-zinc-500 transition-colors hover:text-white"
              aria-label="إغلاق"
            >
              <X size={17} />
            </button>
          </div>

          <Link
            to="/cart"
            onClick={() =>
              setShowToast(false)
            }
            className="mt-3 flex h-10 items-center justify-center rounded-xl bg-white/10 text-xs font-black transition-all hover:bg-[#39ff14] hover:text-black"
          >
            افتح السلة
          </Link>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Link
            to="/"
            className="text-zinc-400 transition-colors hover:text-black"
          >
            الرئيسية
          </Link>

          <span className="text-zinc-300">
            /
          </span>

          <Link
            to="/products"
            className="text-zinc-400 transition-colors hover:text-black"
          >
            المنتجات
          </Link>

          <span className="text-zinc-300">
            /
          </span>

          <span className="font-bold text-black">
            {product.name}
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* IMAGE */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="relative overflow-hidden rounded-[2rem] bg-zinc-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-zinc-400">
                  لا توجد صورة
                </div>
              )}

              {Number(
                product.discount || 0
              ) > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-[#39ff14] px-4 py-2 text-xs font-black text-black sm:left-6 sm:top-6">
                  خصم {product.discount}%
                </span>
              )}

              {product.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-black text-[#39ff14] sm:right-6 sm:top-6">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                [Truck, "شحن سريع"],
                [Check, "جودة مناسبة"],
                [ShoppingBag, "طلب بسهولة"],
              ].map(([Icon, text]) => (
                <div
                  key={text}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-center"
                >
                  <Icon
                    size={19}
                    className="mx-auto"
                  />

                  <p className="mt-2 text-[10px] font-black sm:text-xs">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            {product.badge && (
              <span className="inline-flex rounded-full bg-black px-4 py-2 text-[10px] font-black text-[#39ff14] sm:text-xs">
                {product.badge}
              </span>
            )}

            <p className="mt-5 text-xs font-bold text-zinc-400 sm:text-sm">
              {product.categoryName}
            </p>

            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <Star
                  size={17}
                  fill="currentColor"
                />

                <span className="font-black">
                  {Number(
                    product.rating || 0
                  ).toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-zinc-400">
                ({Number(
                  product.reviews || 0
                )} تقييم)
              </span>

              <span className="h-1 w-1 rounded-full bg-zinc-300" />

              <span className="text-xs font-bold text-[#16a34a]">
                {Number(product.stock) > 0
                  ? "متاح للطلب"
                  : "غير متوفر حاليًا"}
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-black sm:text-4xl">
                {product.price} جنيه
              </span>

              {Number(
                product.oldPrice || 0
              ) > 0 && (
                <span className="text-sm text-zinc-400 line-through">
                  {product.oldPrice} جنيه
                </span>
              )}

              {Number(
                product.discount || 0
              ) > 0 &&
                discountValue > 0 && (
                  <span className="rounded-full bg-[#39ff14]/15 px-3 py-1 text-xs font-black text-[#16a34a]">
                    وفر {discountValue} جنيه
                  </span>
                )}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-7 rounded-2xl bg-zinc-50 p-5">
              <h2 className="text-sm font-black">
                عن المنتج
              </h2>

              <p className="mt-3 text-sm leading-8 text-zinc-500">
                {product.description ||
                  "لا يوجد وصف للمنتج حاليًا."}
              </p>
            </div>

            {/* SIZE */}
            {product.sizes?.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black sm:text-base">
                    المقاس
                  </h3>

                  <span className="text-[10px] text-zinc-400 sm:text-xs">
                    اختار المقاس المناسب
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(
                    (size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                        className={`h-11 min-w-12 rounded-xl border px-4 text-sm font-black transition-all duration-300 ${
                          selectedSize === size
                            ? "border-black bg-black text-[#39ff14] shadow-lg"
                            : "border-zinc-200 bg-white hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* COLOR */}
            {product.colors?.length > 0 && (
              <div className="mt-7">
                <h3 className="mb-3 text-sm font-black sm:text-base">
                  اللون
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.colors.map(
                    (color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        className={`rounded-xl border px-5 py-3 text-xs font-black transition-all duration-300 sm:text-sm ${
                          selectedColor === color
                            ? "border-black bg-black text-[#39ff14]"
                            : "border-zinc-200 bg-white hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="mt-8 rounded-3xl border border-zinc-200 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold text-zinc-400">
                    الكمية
                  </p>

                  <div className="mt-2 flex h-12 w-fit items-center rounded-xl border border-zinc-200">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          (value) =>
                            Math.max(
                              1,
                              value - 1
                            )
                        )
                      }
                      className="flex h-full w-11 items-center justify-center transition-colors hover:bg-zinc-100"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-10 text-center text-sm font-black">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={
                        Number(
                          product.stock
                        ) <= quantity
                      }
                      onClick={() =>
                        setQuantity(
                          (value) =>
                            Math.min(
                              Number(
                                product.stock ||
                                  99
                              ),
                              value + 1
                            )
                        )
                      }
                      className="flex h-full w-11 items-center justify-center transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="hidden h-12 w-px bg-zinc-200 sm:block" />

                <div className="sm:flex-1">
                  <p className="text-xs text-zinc-400">
                    إجمالي المنتجات
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {Number(product.price) *
                      quantity}{" "}
                    جنيه
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={
                    Number(product.stock) <=
                    0
                  }
                  onClick={handleAddToCart}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-black font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingBag size={19} />
                  أضف للسلة
                </button>

                <button
                  type="button"
                  disabled={
                    Number(product.stock) <=
                    0
                  }
                  onClick={handleBuyNow}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#39ff14] font-black text-black transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  شراء الآن
                  <ArrowLeft size={18} />
                </button>
              </div>
            </div>

            {/* SHIPPING */}
            <div className="mt-5 rounded-3xl bg-black p-5 text-white sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                  <Truck size={20} />
                </div>

                <div>
                  <h3 className="font-black">
                    الشحن والتوصيل
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-zinc-400">
                    الشحن مجاني للطلبات بقيمة
                    1500 جنيه أو أكثر. أقل من
                    كده تكلفة الشحن عل حسب المحافظه  .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-zinc-100 pt-14">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-black text-[#16a34a] sm:text-sm">
                  ممكن يعجبك كمان
                </span>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  منتجات مشابهة
                </h2>
              </div>

              <Link
                to={`/products?category=${product.category}`}
                className="inline-flex items-center gap-2 text-xs font-black transition-all hover:gap-3 sm:text-sm"
              >
                مشاهدة القسم
                <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map(
                (item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-square overflow-hidden bg-zinc-100">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {item.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-black px-3 py-1.5 text-[10px] font-black text-[#39ff14]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-zinc-400">
                        {item.categoryName}
                      </p>

                      <h3 className="mt-2 line-clamp-1 font-black">
                        {item.name}
                      </h3>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="font-black">
                          {item.price} جنيه
                        </span>

                        <span className="text-xs font-bold text-zinc-400">
                          ★{" "}
                          {Number(
                            item.rating || 0
                          ).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        <ProductReviews
          productId={product.id}
        />
      </main>
    </div>
  );
}

export default ProductDetails;