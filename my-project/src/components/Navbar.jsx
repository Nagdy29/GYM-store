import { useState } from "react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const { cartCount } = useCart();

  const navLinks = [
    {
      name: "الرئيسية",
      path: "/",
    },
    {
      name: "المنتجات",
      path: "/products",
    },
    {
      name: "الأقسام",
      path: "/categories",
    },
    {
      name: "من نحن",
      path: "/about",
    },
    {
      name: "تواصل معنا",
      path: "/contact",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 text-white backdrop-blur-xl">
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT */}

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="بحث"
              className="flex h-9 w-9 items-center justify-center text-zinc-400 transition-all duration-300 hover:text-[#39ff14]"
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              aria-label="الحساب"
              className="hidden h-9 w-9 items-center justify-center text-zinc-400 transition-all duration-300 hover:text-[#39ff14] sm:flex"
            >
              <User size={19} />
            </button>

            <Link
              to="/cart"
              aria-label="السلة"
              className="relative flex h-9 w-9 items-center justify-center text-zinc-400 transition-all duration-300 hover:text-[#39ff14]"
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="absolute -left-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#39ff14] px-1 text-[8px] font-black text-black">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* CENTER LOGO */}

          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <img
              src="/hiraql-logo.jpg"
              alt="HIRAQL GYM STORE"
              className="h-auto w-[115px] object-contain transition-all duration-300 hover:scale-105 sm:w-[135px]"
            />
          </Link>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-[9px] font-black text-white underline underline-offset-4 transition-colors hover:text-[#39ff14]"
            >
              AR
            </button>

            <button
              type="button"
              className="hidden text-[9px] font-black text-zinc-500 transition-colors hover:text-white sm:block"
            >
              EN
            </button>

            <button
              type="button"
              className="hidden text-[9px] font-black text-zinc-500 transition-colors hover:text-white sm:block"
            >
              FR
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP NAV
      ====================================================== */}

      <div className="hidden border-b border-white/[0.07] lg:block">
        <nav className="mx-auto flex h-[48px] max-w-7xl items-center justify-center gap-8 px-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative py-4 text-[11px] font-bold transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}

                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-[#39ff14]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/products?offer=true"
            className={({ isActive }) =>
              `relative py-4 text-[11px] font-bold transition-colors ${
                isActive
                  ? "text-[#39ff14]"
                  : "text-zinc-400 hover:text-[#39ff14]"
              }`
            }
          >
            العروض
          </NavLink>
        </nav>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div className="lg:hidden">
        <div className="flex h-12 items-center justify-between border-t border-white/[0.06] px-4">
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                (current) => !current
              )
            }
            className="flex h-9 w-9 items-center justify-center text-zinc-300 transition-colors hover:text-[#39ff14]"
            aria-label="القائمة"
          >
            {isMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          <span className="text-[9px] font-black tracking-[0.18em] text-zinc-600">
            HIRAQL
          </span>

          <Link
            to="/products"
            className="text-[9px] font-black text-[#39ff14]"
          >
            تسوق
          </Link>
        </div>

        <div
          className={`overflow-hidden border-t border-white/[0.07] bg-[#050505] transition-all duration-300 ${
            isMenuOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() =>
                  setIsMenuOpen(false)
                }
                className={({ isActive }) =>
                  `border-b border-white/[0.05] px-4 py-4 text-sm font-bold transition-colors ${
                    isActive
                      ? "text-[#39ff14]"
                      : "text-zinc-400 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <NavLink
              to="/products?offer=true"
              onClick={() =>
                setIsMenuOpen(false)
              }
              className="border-b border-white/[0.05] px-4 py-4 text-sm font-bold text-zinc-400 transition-colors hover:text-[#39ff14]"
            >
              العروض
            </NavLink>

            <Link
              to="/cart"
              onClick={() =>
                setIsMenuOpen(false)
              }
              className="mt-2 flex items-center justify-between bg-[#39ff14] px-4 py-4 text-sm font-black text-black"
            >
              <span>سلة التسوق</span>

              {cartCount > 0 && (
                <span className="bg-black px-2 py-1 text-[9px] text-[#39ff14]">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;