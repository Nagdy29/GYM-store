    import { Link, useNavigate } from "react-router-dom";
    import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    Truck,
    ShieldCheck,
    PackageCheck,
    } from "lucide-react";

    import { useCart } from "../context/CartContext";

    function Cart() {
    const navigate = useNavigate();

    const {
        cartItems,
        cartCount,
        subtotal,
        shipping,
        total,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    if (cartItems.length === 0) {
        return (
        <div className="min-h-[75vh] bg-white">
            <section className="bg-black px-4 py-14 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <span className="text-sm font-black text-[#39ff14]">
                ZENGER GYM STORE
                </span>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                سلة التسوق
                </h1>
            </div>
            </section>

            <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100">
                <ShoppingBag
                size={42}
                className="text-zinc-400"
                />
            </div>

            <h2 className="mt-7 text-2xl font-black sm:text-3xl">
                السلة فاضية
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
                لسه مفيش منتجات في السلة. اختار المنتجات اللي
                محتاجها من المتجر وابدأ طلبك.
            </p>

            <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-black px-7 py-4 font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800"
            >
                ابدأ التسوق
                <ArrowLeft size={18} />
            </Link>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
        {/* HEADER */}
        <section className="bg-black px-4 py-14 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
            <span className="text-sm font-black text-[#39ff14]">
                ZENGER GYM STORE
            </span>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                <h1 className="text-3xl font-black sm:text-4xl">
                    سلة التسوق
                </h1>

                <p className="mt-2 text-sm text-zinc-400">
                    راجع منتجاتك قبل إتمام الطلب.
                </p>
                </div>

                <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-zinc-300">
                {cartCount} منتج في السلة
                </span>
            </div>
            </div>
        </section>

        {/* CONTENT */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* PRODUCTS */}
            <section>
                <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                    <h2 className="text-xl font-black">
                        المنتجات
                    </h2>

                    <p className="mt-1 text-xs text-zinc-400">
                        {cartItems.length} نوع من المنتجات
                    </p>
                    </div>

                    <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-red-500 transition-all hover:bg-red-50"
                    >
                    <Trash2 size={15} />
                    <span className="hidden sm:inline">
                        إفراغ السلة
                    </span>
                    </button>
                </div>

                <div className="space-y-4">
                    {cartItems.map((item) => (
                    <div
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="rounded-2xl border border-zinc-100 p-3 transition-all duration-300 hover:border-zinc-200 sm:p-4"
                    >
                        <div className="flex gap-3 sm:gap-5">
                        {/* IMAGE */}
                        <Link
                            to={`/products/${item.id}`}
                            className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:h-32 sm:w-32"
                        >
                            <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </Link>

                        {/* INFO */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <Link
                                to={`/products/${item.id}`}
                                className="line-clamp-2 text-sm font-black transition-colors hover:text-[#16a34a] sm:text-base"
                                >
                                {item.name}
                                </Link>

                                {(item.size || item.color) && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {item.size && (
                                    <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-600">
                                        المقاس: {item.size}
                                    </span>
                                    )}

                                    {item.color && (
                                    <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-600">
                                        اللون: {item.color}
                                    </span>
                                    )}
                                </div>
                                )}
                            </div>

                            {/* DELETE DESKTOP */}
                            <button
                                type="button"
                                onClick={() =>
                                removeFromCart(
                                    item.id,
                                    item.size,
                                    item.color
                                )
                                }
                                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 sm:flex"
                                aria-label="حذف المنتج"
                            >
                                <Trash2 size={17} />
                            </button>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            {/* QUANTITY */}
                            <div className="flex h-10 items-center rounded-xl border border-zinc-200">
                                <button
                                type="button"
                                onClick={() =>
                                    updateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                    item.size,
                                    item.color
                                    )
                                }
                                className="flex h-full w-9 items-center justify-center transition-colors hover:bg-zinc-100"
                                aria-label="تقليل الكمية"
                                >
                                <Minus size={14} />
                                </button>

                                <span className="w-8 text-center text-sm font-black">
                                {item.quantity}
                                </span>

                                <button
                                type="button"
                                onClick={() =>
                                    updateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                    item.size,
                                    item.color
                                    )
                                }
                                className="flex h-full w-9 items-center justify-center transition-colors hover:bg-zinc-100"
                                aria-label="زيادة الكمية"
                                >
                                <Plus size={14} />
                                </button>
                            </div>

                            {/* PRICE */}
                            <div className="text-left">
                                <p className="text-base font-black sm:text-lg">
                                {item.price * item.quantity} جنيه
                                </p>

                                {item.quantity > 1 && (
                                <p className="mt-0.5 text-[10px] text-zinc-400">
                                    {item.price} جنيه للقطعة
                                </p>
                                )}
                            </div>
                            </div>

                            {/* DELETE MOBILE */}
                            <button
                            type="button"
                            onClick={() =>
                                removeFromCart(
                                item.id,
                                item.size,
                                item.color
                                )
                            }
                            className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-red-500 sm:hidden"
                            >
                            <Trash2 size={13} />
                            حذف المنتج
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                {/* CONTINUE SHOPPING */}
                <Link
                    to="/products"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-zinc-600 transition-all hover:gap-3 hover:text-black"
                >
                    <ArrowLeft size={17} />
                    مواصلة التسوق
                </Link>
                </div>

                {/* FEATURES */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <Truck size={19} />

                    <p className="mt-3 text-sm font-black">
                    شحن سريع
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    نوصل طلبك في أسرع وقت ممكن.
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <ShieldCheck size={19} />

                    <p className="mt-3 text-sm font-black">
                    تجربة آمنة
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    بيانات طلبك محفوظة بشكل آمن.
                    </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <PackageCheck size={19} />

                    <p className="mt-3 text-sm font-black">
                    تغليف وتجهيز
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    نهتم بتجهيز الطلب قبل الشحن.
                    </p>
                </div>
                </div>
            </section>

            {/* SUMMARY */}
            <aside>
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 lg:sticky lg:top-28">
                <h2 className="text-xl font-black">
                    ملخص الطلب
                </h2>

                <div className="my-6 h-px bg-zinc-100" />

                <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-500">
                        عدد المنتجات
                    </span>

                    <span className="font-black">
                        {cartCount}
                    </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-500">
                        إجمالي المنتجات
                    </span>

                    <span className="font-black">
                        {subtotal} جنيه
                    </span>
                    </div>

                    {/* <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-500">
                        الشحن
                    </span>

                    <span className="font-black">
                        {shipping === 0
                        ? "مجاني"
                        : `${shipping} جنيه`}
                    </span>
                    </div> */}
                </div>

                {/* {subtotal < 1500 && (
                    <div className="mt-5 rounded-2xl bg-[#39ff14]/10 p-4">
                    <p className="text-xs font-bold leading-6 text-zinc-700">
                        ضيف منتجات بقيمة{" "}
                        <span className="font-black text-[#16a34a]">
                        {1500 - subtotal} جنيه
                        </span>{" "}
                        واحصل على شحن مجاني 🎉
                    </p>
                    </div>
                )} */}

                <div className="my-6 h-px bg-zinc-100" />

                <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-black">
                    الإجمالي
                    </span>

                    <span className="text-2xl font-black">
                    {total} جنيه
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#39ff14] font-black text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(57,255,20,0.18)]"
                >
                    إتمام الطلب
                    <ArrowLeft size={18} />
                </button>

                {/* <p className="mt-4 text-center text-[10px] leading-5 text-zinc-400">
                    الشحن مجاني للطلبات بقيمة 1500 جنيه أو أكثر.
                </p> */}
                </div>
            </aside>
            </div>
        </div>
        </div>
    );
    }

    export default Cart;