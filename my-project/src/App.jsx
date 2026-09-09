import {
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

import AdminLayout from "./admin/AdminLayout";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminLogin from "./admin/AdminLogin";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminOrders from "./admin/AdminOrders";
import AdminReviews from "./admin/AdminReviews";
import AdminSecretChallenge from "./admin/AdminSecretChallenge";
import AdminSettings from "./admin/AdminSettings";

import SecretChallenge from "./pages/SecretChallenge";

function App() {
  return (
    <>
      <ScrollToTop />

      <ScrollToTopButton />

      <Routes>

        {/* ==================================================
            STORE
        ================================================== */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/secret"
            element={<SecretChallenge />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />
        </Route>

        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ==================================================
            PROTECTED ADMIN
        ================================================== */}

        <Route
          element={
            <AdminProtectedRoute />
          }
        >
          <Route
            element={
              <AdminLayout />
            }
          >

            {/* DASHBOARD */}

            <Route
              path="/admin"
              element={
                <AdminDashboard />
              }
            />

            {/* PRODUCTS */}

            <Route
              path="/admin/products"
              element={
                <AdminProducts />
              }
            />

            {/* CATEGORIES */}

            <Route
              path="/admin/categories"
              element={
                <AdminCategories />
              }
            />

            {/* ORDERS */}

            <Route
              path="/admin/orders"
              element={
                <AdminOrders />
              }
            />

            {/* REVIEWS */}

            <Route
              path="/admin/reviews"
              element={
                <AdminReviews />
              }
            />

            {/* SECRET CHALLENGE */}

            <Route
              path="/admin/secret"
              element={
                <AdminSecretChallenge />
              }
            />

            {/* SETTINGS */}

            <Route
              path="/admin/settings"
              element={
                <AdminSettings />
              }
            />

          </Route>
        </Route>

        {/* ==================================================
            404
        ================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}

export default App;