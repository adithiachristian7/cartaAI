import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import Home from "./pages/HomeCentered";
import Template from "./pages/Template";
import Harga from "./pages/Harga";
import Tentang from "./pages/Tentang";

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/template" element={<Template />} />
            <Route path="/harga" element={<Harga />} />
            <Route path="/tentang" element={<Tentang />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
