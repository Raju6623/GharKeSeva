import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages & Components Imports
import Home from './homePage/Home'
import AcServicePage from './ServiceSection/AcServicePage'
import PlumbingServicePage from './ServiceSection/PlumbingServicePage'
import CarpenterServicePage from './ServiceSection/CarpenterServicePage'
import AppliancesServicePage from './ServiceSection/AppliancesServicePage'
import ElectricianServicePage from './ServiceSection/ElectricianServicePage'
import HouseMaidServicePage from './ServiceSection/HouseMaidServicePage'
import PaintingServicePage from './ServiceSection/PaintingServicePage'
import PestControlServicePage from './ServiceSection/PestControlServicePage'
import RoServicePage from './ServiceSection/RoServicePage'
import SmartLockServicePage from './ServiceSection/SmartLockServicePage'


import RegisterScreen from './AuthCode/RegisterScreen'
import LoginScreen from './AuthCode/LoginScreen'
import ContactPage from './homePage/ContactPage'
import ServiceBasket from './serviceBasket/ServiceBasket'
import CheckoutPage from './Checkout/CheckoutPage'
import MyBookings from './bookingService/MyBookings'
import UserProfile from './bookingService/UserProfile'


import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';

// ... imports remain same ...

function App() {
  return (
    <BrowserRouter>
      {/* Notifications ke liye Toast Setup */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Public Service Routes */}
        <Route path="/basket" element={<ServiceBasket />} />
        <Route path="/services/acservice" element={<AcServicePage />} />
        <Route path="/services/carpenter-service" element={<CarpenterServicePage />} />
        <Route path="/services/appliances-service" element={<AppliancesServicePage />} />
        <Route path="/services/electrician-service" element={<ElectricianServicePage />} />
        <Route path="/services/house-maid-service" element={<HouseMaidServicePage />} />
        <Route path="/services/painting-service" element={<PaintingServicePage />} />
        <Route path="/services/pestcontrol-service" element={<PestControlServicePage />} />
        <Route path="/services/plumbing-service" element={<PlumbingServicePage />} />
        <Route path="/services/ro-service" element={<RoServicePage />} />
        <Route path="/services/smartlock-service" element={<SmartLockServicePage />} />

        {/* --- Protected Routes (Login Required) --- */}

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
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
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App