import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const weddingTemplates = {
  elegan: [
    {
      id: 1,
      title: "Elegan Tradisional",
      description: "Nuansa mewah dengan motif etnik dan warna keemasan.",
      imageUrl: "/assets/elegan_1.webp",
    },
    {
      id: 2,
      title: "Elegan Minimalis",
      description:
        "Tampilan lembut dengan dominasi putih dan dekorasi sederhana.",
      imageUrl: "/assets/elegan_2-removebg-preview.png",
    },
    {
      id: 7,
      title: "Elegan Mewah",
      description: "Latar hitam berkelas dengan aksen emas yang glamor.",
      imageUrl: "/assets/elegan_3.webp",
    },
  ],
  formal: [
    {
      id: 3,
      title: "Formal Klasik",
      description: "Ornamen detail dengan nuansa resmi dan berwibawa.",
      imageUrl: "/assets/formal_1.webp",
    },
    {
      id: 4,
      title: "Formal Modern",
      description: "Tampilan sederhana, bersih, namun tetap formal.",
      imageUrl: "/assets/formal_2.webp",
    },
    {
      id: 9,
      title: "Formal Natural",
      description: "Nuansa lembut dengan sentuhan alam yang tetap anggun.",
      imageUrl: "/assets/formal_3.webp",
    },
  ],
  simple: [
    {
      id: 10,
      title: "Elegan Minimalis",
      description: "Desain putih bersih dengan tata letak rapi dan elegan.",
      imageUrl: "/assets/simple_1.webp",
    },
    {
      id: 11,
      title: "Simple Bold",
      description: "Dominasi warna kuat dengan kontras tinggi yang berani.",
      imageUrl: "/assets/simple_2.webp",
    },
    {
      id: 12,
      title: "Simple Garis & Bunga",
      description: "Desain hitam-putih dengan ilustrasi garis dan motif bunga.",
      imageUrl: "/assets/simple_3-removebg-preview.png",
    },
  ],
};

const Template = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#templates") {
      const element = document.getElementById("templates");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden relative transition-colors duration-300">
      {/* Subtle noise texture */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1
              id="templates"
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Template Undangan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Pernikahan
              </span>
            </h1>
            <div className="relative inline-block mb-8">
              <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 dark:border-indigo-400 shadow-md"></div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pilih template undangan pernikahan dengan berbagai gaya yang
              sesuai dengan selera Anda.
            </p>
          </div>

          {Object.entries(weddingTemplates).map(([style, templates]) => (
            <section key={style} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 capitalize">
                {style}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate(`/template-usage/${template.id}`)}
                  >
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                      }}
                    ></div>

                    <div className="relative z-10">
                      <div className="mb-4 rounded-xl overflow-hidden shadow-md bg-gray-50 dark:bg-gray-700">
                        <img
                          src={template.imageUrl}
                          alt={template.title}
                          className="w-full h-48 object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                        {template.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template;
