import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Guest from './Pages/Guest';
import Login from './Pages/Login';
import Register from './Pages/Register';

import { ThemeProvider } from './context/ThemeContext';

// ── Admin Panel ──
import AdminRoute from './components/AdminRoute';
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/Dashboard';
import AdminHandicrafters from './Admin/Handicrafters';
import AdminProducts from './Admin/Products';
import AdminOrders from './Admin/Orders';
import AdminCustomers from './Admin/Customers';
import AdminCategories from './Admin/Categories';
import AdminReviews from './Admin/Reviews';
import AdminDisputes from './Admin/Disputes';
import AdminCommission from './Admin/Commission';
import AdminAnalytics from './Admin/Analytics';
import AdminSettings from './Admin/Settings';

// ── Handicrafter Dashboard ──
import HandicrafterRoute from './components/HandicrafterRoute';
import DashboardLayout from './Handicrafter/DashboardLayout';
import Overview from './Handicrafter/Overview';
import Products from './Handicrafter/Products';
import AddProduct from './Handicrafter/AddProduct';
import HOrders from './Handicrafter/Orders';
import HReviews from './Handicrafter/Reviews';
import Earnings from './Handicrafter/Earnings';
import Analytics from './Handicrafter/Analytics';
import HProfile from './Handicrafter/Profile';

// ── Customer Marketplace ──
import CustomerRoute from './components/CustomerRoute';
import CustomerLayout from './Customer/CustomerLayout';
import Home from './Customer/Home';
import Marketplace from './Customer/Marketplace';
import ProductDetails from './Customer/ProductDetails';
import Cart from './Customer/Cart';
import Checkout from './Customer/Checkout';
import CustomerOrders from './Customer/CustomerOrders';
import Wishlist from './Customer/Wishlist';
import CustomerReviews from './Customer/CustomerReviews';
import CustomerProfile from './Customer/CustomerProfile';
import Recommendations from './Customer/Recommendations';
import PaymentSuccess from './Customer/PaymentSuccess';
import PaymentCancel from './Customer/PaymentCancel';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Guest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Panel — Protected + Nested Layout */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="handicrafters" element={<AdminHandicrafters />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="disputes" element={<AdminDisputes />} />
              <Route path="commission" element={<AdminCommission />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Handicrafter Dashboard — Protected + Nested Layout */}
            <Route
              path="/handicrafter"
              element={
                <HandicrafterRoute>
                  <DashboardLayout />
                </HandicrafterRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Overview />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="orders" element={<HOrders />} />
              <Route path="reviews" element={<HReviews />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<HProfile />} />
            </Route>

            {/* Customer Marketplace — Protected + Nested Layout */}
            <Route
              path="/customer"
              element={
                <CustomerRoute>
                  <CustomerLayout />
                </CustomerRoute>
              }
            >
              <Route index element={<Navigate to="home" replace />} />
              <Route path="dashboard" element={<Navigate to="/customer/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="reviews" element={<CustomerReviews />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="payment-cancel" element={<PaymentCancel />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
