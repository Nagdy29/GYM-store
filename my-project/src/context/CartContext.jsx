import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem("zenger-cart");

    if (!savedCart) {
      return [];
    }

    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem(
      "zenger-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  const addToCart = (
    product,
    quantity = 1,
    options = {}
  ) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id &&
          item.size === options.size &&
          item.color === options.color
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id &&
          item.size === options.size &&
          item.color === options.color
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: options.size || null,
          color: options.color || null,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (
    id,
    size = null,
    color = null
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const updateQuantity = (
    id,
    quantity,
    size = null,
    color = null
  ) => {
    if (quantity <= 0) {
      removeFromCart(
        id,
        size,
        color
      );

      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (Number(item.price) || 0) *
          (Number(item.quantity) || 0),
      0
    );
  }, [cartItems]);

  /*
   * الشحن الأساسي القديم.
   *
   * Checkout بيستخدم أسعار الشحن
   * الموجودة في Firebase حسب المحافظة.
   */

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 1500
      ? 0
      : 60;

  const total =
    subtotal + shipping;

  const value = {
    cartItems,

    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    cartCount,

    subtotal,
    shipping,
    total,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
