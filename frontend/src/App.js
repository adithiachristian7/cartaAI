import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Home from './pages/Home';
import Template from './pages/Template';
import Harga from './pages/Harga';
import Tentang from './pages/Tentang';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import PremiumGenerator from './pages/PremiumGenerator';
import Payment from './pages/Payment';
import TemplateUsage from './pages/TemplateUsage';

import { AuthProvider } from './context/AuthContext';

import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

import PaymentStatus from './pages/PaymentStatus';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/template" element={<Template />} />
              <Route path="/template-usage/:id" element={<TemplateUsage />} />
              <Route path="/harga" element={<Harga />} />
              <Route path="/tentang" element={<Tentang />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/premium-generator" element={<PremiumGenerator />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
