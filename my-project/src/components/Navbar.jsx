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
  Dumbbell,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cartCount } = useCart();

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "المنتجات", path: "/products" },
    { name: "الأقسام", path: "/categories" },
    { name: "العروض", path: "/products?offer=true" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#39ff14] text-black shadow-[0_0_25px_rgba(57,255,20,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Dumbbell
              size={23}
              strokeWidth={2.8}
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-black tracking-wide text-white">
              ZENGER
            </h1>

            <p className="text-[10px] font-bold tracking-[0.2em] text-[#39ff14]">
              GYM STORE
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#39ff14] text-black"
                    : "text-zinc-300 hover:bg-white/10 hover:text-[#39ff14]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-white transition-all hover:bg-white/10 hover:text-[#39ff14] sm:flex"
            aria-label="بحث"
          >
            <Search size={21} />
          </button>

          <button
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-white transition-all hover:bg-white/10 hover:text-[#39ff14] sm:flex"
            aria-label="الحساب"
          >
            <User size={21} />
          </button>

          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#39ff14]"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#39ff14] px-1 text-[10px] font-black text-black">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition-all hover:bg-white/10 lg:hidden"
            aria-label="القائمة"
          >
            {isMenuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 bg-black transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#39ff14] text-black"
                    : "text-zinc-300 hover:bg-white/10 hover:text-[#39ff14]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#39ff14] hover:text-black"
          >
            <span>السلة</span>

            {cartCount > 0 && (
              <span className="rounded-full bg-[#39ff14] px-2 py-1 text-[10px] text-black">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;