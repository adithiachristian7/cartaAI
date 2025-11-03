import React from "react";
import { useParams } from "react-router-dom";

const TemplateUsage = () => {
  const { id } = useParams();

  // Dummy data, in real app fetch from API or state
  const templates = {
    1: {
      title: "Elegan Tradisional",
      description: "Nuansa mewah dengan motif etnik dan warna keemasan.",
      imageUrl: "/assets/elegan_1.webp",
      category: "elegan",
    },
    2: {
      title: "Elegan Minimalis",
      description:
        "Tampilan lembut dengan dominasi putih dan dekorasi sederhana.",
      imageUrl: "/assets/elegan_2.jpg",
      category: "elegan",
    },
    3: {
      title: "Formal Klasik",
      description: "Ornamen detail dengan nuansa resmi dan berwibawa.",
      imageUrl: "/assets/formal_1.webp",
      category: "formal",
    },
    4: {
      title: "Formal Modern",
      description: "Tampilan sederhana, bersih, namun tetap formal.",
      imageUrl: "/assets/formal_2.webp",
      category: "formal",
    },
    7: {
      title: "Elegan Mewah",
      description: "Latar hitam berkelas dengan aksen emas yang glamor.",
      imageUrl: "/assets/elegan_3.webp",
      category: "elegan",
    },
    9: {
      title: "Formal Natural",
      description: "Nuansa lembut dengan sentuhan alam yang tetap anggun.",
      imageUrl: "/assets/formal_3.webp",
      category: "formal",
    },
    10: {
      title: "Elegan Minimalis",
      description: "Desain putih bersih dengan tata letak rapi dan elegan.",
      imageUrl: "/assets/simple_1.webp",
      category: "simple",
    },
    11: {
      title: "Simple Bold",
      description: "Dominasi warna kuat dengan kontras tinggi yang berani.",
      imageUrl: "/assets/simple_2.webp",
      category: "simple",
    },
    12: {
      title: "Simple Garis & Bunga",
      description: "Desain hitam-putih dengan ilustrasi garis dan motif bunga.",
      imageUrl: "/assets/simple_3.jpg",
      category: "simple",
    },
  };

  const template = templates[id];

  if (!template) {
    return (
      <div className="container mx-auto px-6 py-24">
        Template tidak ditemukan.
      </div>
    );
  }

  const getCategoryContent = (category) => {
    switch (category) {
      case "elegan":
        return {
          tips: "Template elegan cocok untuk pernikahan tradisional. Gunakan warna netral seperti putih, emas, dan hitam untuk kesan elegan.",
          steps: [
            "Pilih font klasik seperti serif.",
            "Tambahkan elemen vintage seperti bunga atau renda.",
            "Sesuaikan teks dengan nama dan tanggal pernikahan.",
          ],
        };
      case "formal":
        return {
          tips: "Template formal ideal untuk pasangan muda. Fokus pada kesederhanaan dan elemen geometris.",
          steps: [
            "Gunakan warna kontras seperti hitam dan putih.",
            "Tambahkan ikon modern seperti garis atau bentuk abstrak.",
            "Pastikan layout bersih dan minimalis.",
          ],
        };
      case "simple":
        return {
          tips: "Template simple untuk pernikahan mewah. Gunakan elemen seperti emas, kristal, dan tipografi mewah.",
          steps: [
            "Pilih palet warna emas dan putih.",
            "Tambahkan detail seperti monogram atau lambang.",
            "Sesuaikan dengan tema pernikahan Anda.",
          ],
        };
      default:
        return {
          tips: "Nikmati menggunakan template ini.",
          steps: [
            "Edit teks sesuai kebutuhan.",
            "Sesuaikan gambar dan warna.",
            "Simpan dan bagikan.",
          ],
        };
    }
  };

  const categoryContent = getCategoryContent(template.category);

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tighter text-primary text-center mb-8">
        {template.title}
      </h1>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <img
          src={template.imageUrl}
          alt={template.title}
          className="w-full h-48 object-contain rounded-md mb-4"
        />
        <h2 className="text-2xl font-semibold text-primary mb-2">
          {template.title}
        </h2>
        <p className="text-secondary mb-4">{template.description}</p>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">
            Tips Penggunaan
          </h3>
          <p className="text-secondary">{categoryContent.tips}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">
            Langkah-langkah
          </h3>
          <ol className="list-decimal list-inside text-secondary">
            {categoryContent.steps.map((step, index) => (
              <li key={index} className="mb-1">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <p className="text-sm text-gray-500">
          Di sini Anda bisa mengedit dan menggunakan template ini untuk undangan
          Anda.
        </p>
        {/* Tambahkan form atau editor di sini */}
      </div>
    </div>
  );
};

export default TemplateUsage;
