import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="text-white"
      style={{
        background: "linear-gradient(135deg, #3d56c5ff 0%, #764ba2 100%)",
      }}
    >
      <div className="container mx-auto px-6 py-12 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">CartaAI</h2>
            </div>
            <p className="mt-4 text-sm text-slate-200">
              Undangan digital cerdas untuk setiap momen pernikahan anda.
            </p>
          </div>

          <div>
            <h4 className="font-bold">Produk</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <a className="hover:text-white" href="#features">
                  Fitur
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#pricing">
                  Harga
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#testimonials">
                  Testimoni
                </a>
              </li>
              <li>
                <Link className="hover:text-white" to="/template#templates">
                  Template
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Perusahaan</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <a className="hover:text-white" href="/tentang">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="https://www.instagram.com/cartaai">
                  Kontak
                </a>
              </li>
              <li>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <a className="hover:text-white" href="#">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white pt-8 text-center text-sm text-slate-300 md:flex md:justify-between">
          <p>© 2025 CartaAI. Semua hak dilindungi.</p>
          <div className="mt-4 flex justify-center gap-4 md:mt-0">
            <a className="hover:text-white" href="https://www.instagram.com/cartaai" >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5c3.072 0 5.75-2.678 5.75-5.75v-8.5C22 4.678 19.322 2 16.25 2h-8.5zM12 7.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5zm0 7.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4.75-8.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
