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
      imageUrl: "/assets/elegan_2.jpg",
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
      imageUrl: "/assets/simple_3.jpg",
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
    <div className="container mx-auto px-6 py-24">
      <h1
        id="templates"
        className="text-4xl font-extrabold tracking-tighter text-primary text-center mb-8"
      >
        Template Undangan Pernikahan
      </h1>
      <p className="text-lg text-secondary text-center mb-12">
        Pilih template undangan pernikahan dengan berbagai gaya yang sesuai
        dengan selera Anda.
      </p>

      {Object.entries(weddingTemplates).map(([style, templates]) => (
        <section key={style} className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6">{style}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:border-blue-500 hover:border-2 hover:bg-blue-50 transition-all duration-300"
                onClick={() => navigate(`/template-usage/${template.id}`)}
              >
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="w-full h-48 object-contain rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {template.title}
                </h3>
                <p className="text-secondary">{template.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Template;
