import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// ----- Components -----
function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-pink-200 shadow-md">
      <Link to="/" className="text-xl font-bold text-pink-700">AI Wedding</Link>
      <div className="space-x-4">
        <Link to="/templates" className="hover:text-pink-600">Templates</Link>
        <Link to="/editor" className="hover:text-pink-600">Editor</Link>
        <Link to="/checkout" className="hover:text-pink-600">Checkout</Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-pink-100 text-center p-4 mt-10 text-sm text-gray-600">
      © 2025 AI Wedding Invitation. All rights reserved.
    </footer>
  );
}

// ----- Pages -----
function Home() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-pink-700 mb-4">Selamat Datang di AI Wedding</h1>
      <p className="mb-6 text-gray-700">Penyedia jasa undangan pernikahan modern berbasis AI. Pilih template, sesuaikan, dan dapatkan undangan impianmu!</p>
      <Link to="/templates" className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 shadow-md">
        Mulai Pilih Template
      </Link>
    </div>
  );
}

function Templates() {
  const templates = [
    { id: 1, name: "Elegant Gold", img: "https://via.placeholder.com/300x200?text=Elegant+Gold" },
    { id: 2, name: "Floral Pink", img: "https://via.placeholder.com/300x200?text=Floral+Pink" },
    { id: 3, name: "Minimal White", img: "https://via.placeholder.com/300x200?text=Minimal+White" },
  ];

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-pink-700 mb-6">Pilih Template Undangan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="border rounded-xl shadow hover:shadow-lg p-4">
            <img src={tpl.img} alt={tpl.name} className="rounded-lg mb-2" />
            <h3 className="text-lg font-semibold">{tpl.name}</h3>
            <Link to="/editor" className="mt-2 inline-block px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              Gunakan Template
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor() {
  const [text, setText] = useState("Nama Mempelai & Detail Acara");

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-pink-700 mb-6">Editor Undangan (Demo)</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 border rounded-lg p-4"
          />
          <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            Generate dengan AI (Coming Soon)
          </button>
        </div>
        {/* Preview */}
        <div className="border rounded-lg shadow p-6 bg-white">
          <h3 className="text-lg font-bold mb-2">Preview Undangan</h3>
          <p className="whitespace-pre-wrap text-gray-700">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold text-pink-700 mb-4">Checkout</h2>
      <p className="mb-6">Lengkapi pembayaran dan undanganmu siap dikirim!</p>
      <button className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-md">
        Bayar Sekarang
      </button>
    </div>
  );
}

// ----- Main App -----
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
