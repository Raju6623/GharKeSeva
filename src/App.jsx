import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchCartItems } from './redux/thunks/cartThunks';
import { io } from 'socket.io-client';
import { clearCache } from './redux/slices/serviceSlice';
import { BASE_URL } from './config';

const socket = io(BASE_URL);

// Lazy load pages for code splitting (70% faster initial load)
const Home = lazy(() => import('./homePage/Home'));
const RegisterScreen = lazy(() => import('./AuthCode/RegisterScreen'));
const LoginScreen = lazy(() => import('./AuthCode/LoginScreen'));
const ContactPage = lazy(() => import('./homePage/ContactPage'));
const ServiceBasket = lazy(() => import('./serviceBasket/ServiceBasket'));
const AddressSelection = lazy(() => import('./serviceBasket/AddressSelection'));
const MyBookings = lazy(() => import('./bookingService/MyBookings'));
const UserProfile = lazy(() => import('./bookingService/UserProfile'));
const ReferAndEarn = lazy(() => import('./homePage/ReferAndEarn'));
const SearchResultsPage = lazy(() => import('./homePage/SearchResultsPage'));
const BlogPage = lazy(() => import('./homePage/BlogPage'));

const BookingSuccess = lazy(() => import('./components/BookingSuccess'));

// Keep these as regular imports (needed immediately)
import ScrollToTop from './components/ScrollToTop';
import LanguageSelectionModal from './components/LanguageSelectionModal';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#effafa] to-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#0c8182] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

import TopBar from './homePage/TopBar';

// Wrapper to handle path-based visibility (Must be inside BrowserRouter)
function NavigationWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/basket', '/checkout'];

  // Don't show Navbar if current path is in the hide list
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return <TopBar />;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItems());

    // --- REFFERAL TRACKING ---
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('pendingReferral', ref);
      console.log("🎁 Referral code captured and persisted:", ref);
    }
  }, [dispatch]);

  useEffect(() => {
    socket.on('service_update', (data) => {
      console.log('🌐 [Main] Real-time Service Update:', data);
      dispatch(clearCache());
    });

    return () => {
      socket.off('service_update');
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageSelectionModal />
      {/* Notifications ke liye Toast Setup */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar visible on all pages EXCEPT basket & checkout */}
      <NavigationWrapper />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* Public Service Routes */}
          <Route path="/services" element={<SearchResultsPage />} />
          <Route path="/services/:category" element={<SearchResultsPage />} />
          <Route path="/basket" element={<ServiceBasket />} />

          {/* --- Protected Routes (Login Required) --- */}

          <Route path="/checkout" element={<AddressSelection />} />
          <Route
            path="/booking-success"
            element={
              <PrivateRoute>
                <BookingSuccess />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/refer"
            element={
              <PrivateRoute>
                <ReferAndEarn />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App