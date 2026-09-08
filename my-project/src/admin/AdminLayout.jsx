
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BarChart3,
  Bell,
  Boxes,
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
} from "lucide-react";

import {
  Link,
  NavLink,
  Outlet,
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

    if (!AudioContext) {
      return;
    }

    const audioContext =
      new AudioContext();

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    oscillator.type =
      "sine";

    oscillator.frequency.setValueAtTime(
      880,
      audioContext.currentTime
    );

    oscillator.frequency.setValueAtTime(
      660,
      audioContext.currentTime +
        0.12
    );

    oscillator.frequency.setValueAtTime(
      880,
      audioContext.currentTime +
        0.24
    );

    gainNode.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.18,
      audioContext.currentTime +
        0.02
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime +
        0.45
    );

    oscillator.connect(
      gainNode
    );

    gainNode.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
        0.45
    );

    setTimeout(() => {
      audioContext
        .close()
        .catch(() => {});
    }, 700);
  } catch (error) {
    console.error(
      "Notification sound error:",
      error
    );
  }
}

function AdminLayout() {
  const navigate =
    useNavigate();

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

  useEffect(() => {
    const enableSound =
      () => {
        setSoundEnabled(
          true
        );
      };

    window.addEventListener(
      "pointerdown",
      enableSound,
      {
        once: true,
      }
    );

    window.addEventListener(
      "keydown",
      enableSound,
      {
        once: true,
      }
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
            newOrders.length ===
            0
          ) {
            return;
          }

          const newOrder =
            newOrders[
              newOrders.length - 1
            ].order;

          const customerName =
            newOrder
              .customer?.name ||
            "عميل جديد";

          const orderNumber =
            newOrder.orderNumber ||
            newOrder.id;

          if (
            soundEnabled
          ) {
            playNotificationSound();
          }

          setNotification({
            orderNumber,
            customerName,
            total:
              Number(
                newOrder.total ||
                  0
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
              setNotification(
                null
              );
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

  const openOrders =
    () => {
      setNotification(
        null
      );

      setMobileOpen(
        false
      );

      navigate(
        "/admin/orders"
      );
    };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-zinc-100"
    >
      {/* MOBILE HEADER */}

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800 bg-black px-4 text-white lg:hidden">
        <Link
          to="/admin"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#39ff14] text-black">
            <BarChart3 size={18} />
          </div>

          <span className="font-black">
            ZENGER ADMIN
          </span>
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (value) =>
                !value
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
          aria-label="فتح القائمة"
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </header>

      {/* SIDEBAR */}

      <aside
        className={`fixed right-0 top-0 z-40 h-screen w-72 border-l border-zinc-800 bg-black text-white transition-transform duration-300 ${
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="hidden h-20 items-center border-b border-white/10 px-6 lg:flex">
          <Link
            to="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39ff14] text-black">
              <BarChart3 size={22} />
            </div>

            <div>
              <h1 className="font-black">
                ZENGER
              </h1>

              <p className="text-[9px] font-bold tracking-[0.2em] text-[#39ff14]">
                ADMIN PANEL
              </p>
            </div>
          </Link>
        </div>

        <div className="p-5 pt-20 lg:pt-5">
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
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
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#39ff14] text-black shadow-lg shadow-[#39ff14]/10"
                          : "text-zinc-300 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={19} />

                    <span>
                      {
                        link.name
                      }
                    </span>
                  </NavLink>
                );
              }
            )}
          </nav>

          <div className="my-6 h-px bg-white/10" />

          {/* SOUND */}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  soundEnabled
                    ? "bg-[#39ff14] text-black"
                    : "bg-white/10 text-zinc-400"
                }`}
              >
                <Volume2 size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black">
                  إشعارات الطلبات
                </p>

                <p className="mt-1 text-[10px] leading-5 text-zinc-500">
                  {soundEnabled
                    ? "الصوت مفعل"
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
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <ShoppingBag size={19} />

            الرجوع للمتجر
          </Link>

          <button
            type="button"
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <Settings size={19} />

            الإعدادات
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* NOTIFICATION */}

      {notification && (
        <div className="fixed left-4 right-4 top-4 z-[100] sm:left-auto sm:right-6 sm:w-[390px]">
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-black text-white shadow-2xl">
            <div className="h-1 bg-[#39ff14]" />

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39ff14] text-black">
                  <Bell size={22} />

                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-[#39ff14]" />

                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#39ff14]" />
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
                      className="text-zinc-500 transition hover:text-white"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-zinc-400">
                    فيه طلب جديد وصل للمتجر.
                  </p>

                  <div className="mt-4 rounded-2xl bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-zinc-500">
                        رقم الطلب
                      </span>

                      <span className="text-xs font-black text-[#39ff14]">
                        {
                          notification.orderNumber
                        }
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-zinc-500">
                        العميل
                      </span>

                      <span className="truncate text-xs font-black">
                        {
                          notification.customerName
                        }
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-zinc-500">
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
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#39ff14] text-xs font-black text-black transition-all hover:-translate-y-0.5 hover:bg-white"
                  >
                    <ClipboardList size={16} />

                    فتح الطلبات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen pt-16 lg:mr-72 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
