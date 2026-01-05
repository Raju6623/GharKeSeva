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

import AdminPanel from './adminPannel/AdminPanel'
import VendorPanel from './vendorPanel/VendorPanel'
import RegisterScreen from './AuthCode/RegisterScreen'
import LoginScreen from './AuthCode/LoginScreen'
import ContactPage from './homePage/ContactPage'
import ServiceBasket from './serviceBasket/ServiceBasket'
import { CartProvider } from './Cart'
import CheckoutPage from './Checkout/CheckoutPage'
import MyBookings from './bookingService/MyBookings'


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/contact" element={<ContactPage />} />
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
          <Route path="/services/admin" element={<AdminPanel />} />
          <Route path="/services/vendor" element={<VendorPanel />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App