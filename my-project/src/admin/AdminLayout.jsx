import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ClipboardList,
  FolderOpen,
  Home,
  KeyRound,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBag,
  Volume2,
  X,
  Dumbbell,
} from "lucide-react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  subscribeToOrders,
} from "../firebase/orders";

function playNotificationSound() {
  try {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) return;

    const audioContext =
      new AudioContext();

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      880,
      audioContext.currentTime
    );

    oscillator.frequency.setValueAtTime(
      660,
      audioContext.currentTime + 0.12
    );

    oscillator.frequency.setValueAtTime(
      880,
      audioContext.currentTime + 0.24
    );

    gainNode.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.18,
      audioContext.currentTime + 0.02
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.45
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.45
    );

    setTimeout(() => {
      audioContext.close().catch(() => {});
    }, 700);
  } catch (error) {
    console.error(
      "Notification sound error:",
      error
    );
  }
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    notification,
    setNotification,
  ] = useState(null);

  const [
    soundEnabled,
    setSoundEnabled,
  ] = useState(false);

  const initializedRef =
    useRef(false);

  const notificationTimeoutRef =
    useRef(null);

  const links = [
    {
      name: "الرئيسية",
      path: "/admin",
      icon: Home,
      end: true,
    },
    {
      name: "المنتجات",
      path: "/admin/products",
      icon: Boxes,
    },
    {
      name: "الأقسام",
      path: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: "الطلبات",
      path: "/admin/orders",
      icon: ClipboardList,
    },
    {
      name: "التقييمات",
      path: "/admin/reviews",
      icon: MessageSquare,
    },
    {
      name: "المفتاح الخفي",
      path: "/admin/secret",
      icon: KeyRound,
    },
  ];

  const currentPage =
    links.find((link) => {
      if (link.end) {
        return (
          location.pathname ===
          link.path
        );
      }

      return location.pathname.startsWith(
        link.path
      );
    });

  useEffect(() => {
    const enableSound = () => {
      setSoundEnabled(true);
    };

    window.addEventListener(
      "pointerdown",
      enableSound,
      { once: true }
    );

    window.addEventListener(
      "keydown",
      enableSound,
      { once: true }
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        enableSound
      );

      window.removeEventListener(
        "keydown",
        enableSound
      );
    };
  }, []);

  useEffect(() => {
    const unsubscribe =
      subscribeToOrders(
        (
          orders,
          changes
        ) => {
          if (
            !initializedRef.current
          ) {
            initializedRef.current =
              true;

            return;
          }

          const newOrders =
            changes.filter(
              (change) =>
                change.type ===
                "added"
            );

          if (
            newOrders.length === 0
          ) {
            return;
          }

          const newOrder =
            newOrders[
              newOrders.length - 1
            ].order;

          const customerName =
            newOrder?.customer?.name ||
            "عميل جديد";

          const orderNumber =
            newOrder?.orderNumber ||
            newOrder?.id ||
            "بدون رقم";

          if (soundEnabled) {
            playNotificationSound();
          }

          setNotification({
            orderNumber,
            customerName,
            total: Number(
              newOrder?.total || 0
            ),
          });

          if (
            notificationTimeoutRef.current
          ) {
            clearTimeout(
              notificationTimeoutRef.current
            );
          }

          notificationTimeoutRef.current =
            setTimeout(() => {
              setNotification(null);
            }, 8000);
        },
        (error) => {
          console.error(
            "Admin realtime orders error:",
            error
          );
        }
      );

    return () => {
      unsubscribe();

      if (
        notificationTimeoutRef.current
      ) {
        clearTimeout(
          notificationTimeoutRef.current
        );
      }
    };
  }, [soundEnabled]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const openOrders = () => {
    setNotification(null);
    setMobileOpen(false);

    navigate("/admin/orders");
  };

  return (
    <>
      <div
        dir="rtl"
        className="
          min-h-screen
          overflow-x-hidden
          bg-white
          text-zinc-900
        "
      >
        {/* =====================================================
            MOBILE HEADER
        ====================================================== */}

        <header
          className="
            fixed
            inset-x-0
            top-0
            z-50
            flex
            h-[72px]
            items-center
            justify-between
            border-b
            border-zinc-200
            bg-white
            px-4
            shadow-sm
            lg:hidden
          "
        >
          <Link
            to="/admin"
            className="flex items-center gap-3"
          >
            {/* LOGO */}

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                overflow-hidden
                bg-transparent
              "
            >
              <img
                src="/logo foter.jpeg"
                alt="HIRAQL"
                className="
                  h-full
                  w-full
                  object-contain
                "
              />
            </div>

            <div className="leading-none">
              <p className="text-lg font-black tracking-wide text-zinc-950">
                HIRAQL
              </p>

              <p className="mt-1 text-[8px] font-black tracking-[0.22em] text-[#16a34a]">
                GYM STORE
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-200
              bg-white
              text-zinc-800
              transition-all
              duration-300
              hover:border-black
              hover:bg-zinc-50
            "
            aria-label="فتح القائمة"
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </header>

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={`
            fixed
            right-0
            top-0
            z-40
            flex
            h-screen
            w-[285px]
            flex-col
            border-l
            border-zinc-200
            bg-white
            shadow-[0_0_40px_rgba(0,0,0,0.04)]
            transition-transform
            duration-300

            ${
              mobileOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* BRAND */}

          <div className="border-b border-zinc-200 px-5 py-5">
            <Link
              to="/admin"
              className="group flex items-center gap-3"
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  bg-transparent
                  transition-transform
                  duration-300
                  group-hover:-translate-y-1
                "
              >
                <img
                  src="/logo foter.jpeg"
                  alt="HIRAQL"
                  className="
                    h-full
                    w-full
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-black tracking-wide text-zinc-950">
                  HIRAQL
                </h1>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />

                  <p className="text-[9px] font-black tracking-[0.2em] text-[#16a34a]">
                    GYM STORE
                  </p>
                </div>
              </div>
            </Link>

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-zinc-200
                bg-zinc-50
                p-3
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-black
                    text-[#39ff14]
                  "
                >
                  <BarChart3 size={17} />
                </div>

                <div>
                  <p className="text-[9px] font-black tracking-[0.14em] text-zinc-400">
                    ADMIN PANEL
                  </p>

                  <p className="mt-1 text-xs font-black text-zinc-900">
                    إدارة متجر HIRAQL
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NAV */}

          <div
            className="
              no-scrollbar
              flex-1
              overflow-y-auto
              px-4
              py-6
            "
          >
            <p className="mb-3 px-3 text-[10px] font-black tracking-[0.16em] text-zinc-400">
              لوحة التحكم
            </p>

            <nav className="space-y-2">
              {links.map(
                (link) => {
                  const Icon =
                    link.icon;

                  return (
                    <NavLink
                      key={
                        link.path
                      }
                      to={
                        link.path
                      }
                      end={
                        link.end
                      }
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={({
                        isActive,
                      }) =>
                        `
                        group
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        px-4
                        py-3
                        text-sm
                        font-black
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "bg-black text-white shadow-lg"
                            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                        }
                        `
                      }
                    >
                      {({
                        isActive,
                      }) => (
                        <>
                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              transition-all
                              duration-300

                              ${
                                isActive
                                  ? "bg-[#39ff14] text-black"
                                  : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-zinc-900"
                              }
                            `}
                          >
                            <Icon
                              size={18}
                            />
                          </div>

                          <span className="flex-1">
                            {
                              link.name
                            }
                          </span>

                          {isActive && (
                            <ChevronLeft
                              size={
                                16
                              }
                              className="text-[#39ff14]"
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                }
              )}
            </nav>

            {/* CURRENT PAGE */}

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-zinc-200
                bg-zinc-50
                p-4
              "
            >
              <p className="text-[9px] font-black tracking-[0.16em] text-zinc-400">
                CURRENT PAGE
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#39ff14]" />

                <p className="text-xs font-black text-zinc-700">
                  {currentPage?.name ||
                    "لوحة التحكم"}
                </p>
              </div>
            </div>

            {/* SOUND */}

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-zinc-200
                bg-white
                p-4
                shadow-sm
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      soundEnabled
                        ? "bg-[#39ff14] text-black"
                        : "bg-zinc-100 text-zinc-400"
                    }
                  `}
                >
                  <Volume2 size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black text-zinc-900">
                    إشعارات الطلبات
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-zinc-400">
                    {soundEnabled
                      ? "صوت الإشعارات مفعل"
                      : "اضغط في الصفحة لتفعيل الصوت"}
                  </p>
                </div>
              </div>
            </div>

            {/* STORE */}

            <Link
              to="/"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
              className="
                group
                mt-4
                flex
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                text-sm
                font-black
                text-zinc-500
                transition-all
                duration-300
                hover:bg-zinc-100
                hover:text-zinc-950
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-zinc-100
                  text-zinc-500
                  transition-all
                  group-hover:bg-black
                  group-hover:text-[#39ff14]
                "
              >
                <ShoppingBag size={18} />
              </div>

              <span className="flex-1">
                الرجوع للمتجر
              </span>

              <ChevronLeft
                size={15}
                className="text-zinc-300 transition group-hover:text-zinc-900"
              />
            </Link>

            {/* SETTINGS */}

            <button
              type="button"
              className="
                group
                mt-2
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                text-sm
                font-black
                text-zinc-500
                transition-all
                duration-300
                hover:bg-zinc-100
                hover:text-zinc-950
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-zinc-100
                  text-zinc-500
                  transition-all
                  group-hover:bg-black
                  group-hover:text-[#39ff14]
                "
              >
                <Settings size={18} />
              </div>

              الإعدادات
            </button>
          </div>

          {/* SIDEBAR BOTTOM */}

          <div className="border-t border-zinc-200 p-4">
            <div
              className="
                rounded-2xl
                border
                border-zinc-200
                bg-zinc-50
                p-4
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-black
                    text-[#39ff14]
                  "
                >
                  <Dumbbell size={17} />
                </div>

                <div>
                  <p className="text-xs font-black text-zinc-900">
                    HIRAQL GYM STORE
                  </p>

                  <p className="mt-1 text-[10px] font-bold text-zinc-400">
                    Train Hard. Wear Better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* =====================================================
            MOBILE OVERLAY
        ====================================================== */}

        {mobileOpen && (
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
              fixed
              inset-0
              z-30
              bg-black/20
              backdrop-blur-[2px]
              lg:hidden
            "
          />
        )}

        {/* =====================================================
            NOTIFICATION
        ====================================================== */}

        {notification && (
          <div
            className="
              fixed
              left-4
              right-4
              top-4
              z-[100]
              sm:left-auto
              sm:right-6
              sm:w-[400px]
            "
          >
            <div
              className="
                overflow-hidden
                rounded-[1.7rem]
                border
                border-zinc-200
                bg-white
                text-zinc-900
                shadow-[0_25px_70px_rgba(0,0,0,0.16)]
              "
            >
              <div className="h-1 bg-[#39ff14]" />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="
                      relative
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-black
                      text-[#39ff14]
                    "
                  >
                    <Bell size={21} />

                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        animate-ping
                        rounded-full
                        bg-[#39ff14]
                      "
                    />

                    <span
                      className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        bg-[#39ff14]
                      "
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black">
                        طلب جديد 🔥
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setNotification(
                            null
                          )
                        }
                        className="text-zinc-400 transition hover:text-black"
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-zinc-500">
                      فيه طلب جديد وصل للمتجر.
                    </p>

                    <div
                      className="
                        mt-4
                        rounded-2xl
                        border
                        border-zinc-200
                        bg-zinc-50
                        p-3
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] text-zinc-400">
                          رقم الطلب
                        </span>

                        <span className="text-xs font-black text-[#16a34a]">
                          {
                            notification.orderNumber
                          }
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-zinc-400">
                          العميل
                        </span>

                        <span className="truncate text-xs font-black">
                          {
                            notification.customerName
                          }
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-zinc-400">
                          الإجمالي
                        </span>

                        <span className="text-xs font-black">
                          {notification.total.toLocaleString(
                            "ar-EG"
                          )}{" "}
                          جنيه
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openOrders
                      }
                      className="
                        mt-4
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-black
                        text-xs
                        font-black
                        text-white
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-zinc-800
                      "
                    >
                      <ClipboardList
                        size={16}
                        className="text-[#39ff14]"
                      />

                      فتح الطلبات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MAIN
        ====================================================== */}

        <main
          className="
            min-h-screen
            bg-white
            pt-[72px]
            lg:mr-[285px]
            lg:pt-0
          "
        >
          {/* TOP BAR */}

          <div
            className="
              hidden
              border-b
              border-zinc-200
              bg-white
              lg:block
            "
          >
            <div className="flex h-[76px] items-center justify-between px-8">
              <div>
                <p className="text-[10px] font-black tracking-[0.18em] text-[#16a34a]">
                  HIRAQL / ADMIN
                </p>

                <h2 className="mt-1 text-xl font-black text-zinc-950">
                  {currentPage?.name ||
                    "لوحة التحكم"}
                </h2>
              </div>

              <Link
                to="/"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-zinc-200
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-black
                  text-zinc-600
                  transition-all
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                "
              >
                <ShoppingBag size={15} />

                فتح المتجر

                <ChevronLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div
            className="
              no-scrollbar
              min-h-[calc(100vh-72px)]
              overflow-y-auto
              p-4
              sm:p-6
              lg:min-h-[calc(100vh-76px)]
              lg:p-8
            "
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* =====================================================
          HIDE SCROLLBAR
      ====================================================== */}

      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        html,
        body {
          scrollbar-width: none;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </>
  );
}

export default AdminLayout;