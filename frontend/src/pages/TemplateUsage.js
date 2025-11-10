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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden relative transition-colors duration-300">
        {/* Subtle noise texture */}
        <div
          className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg">Template tidak ditemukan.</p>
          </div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-x-hidden relative transition-colors duration-300">
      {/* Subtle noise texture (light, non-distracting) */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 dark:border-indigo-400 shadow-md"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {template.title}
              </span>
            </h1>
          </div>

          {/* Content without card */}
          <div className="space-y-8">
            {/* Image Container */}
            <div className="flex justify-center">
              <div className="relative rounded-xl overflow-hidden shadow-lg max-w-full">
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-contain rounded-xl"
                  onError={(e) => {
                    e.target.src = "/assets/default-template.png";
                    console.error(`Failed to load image: ${template.imageUrl}`);
                  }}
                />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {template.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">{template.description}</p>
            </div>

            {/* Tips Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <span className="material-symbols-outlined text-white text-xl">
                    lightbulb
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tips Penggunaan
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{categoryContent.tips}</p>
            </div>

            {/* Steps Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <span className="material-symbols-outlined text-white text-xl">
                    checklist
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Langkah-langkah
                </h3>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-lg">
                {categoryContent.steps.map((step, index) => (
                  <li key={index} className="mb-2 leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Di sini Anda bisa mengedit dan menggunakan template ini untuk undangan
                Anda.
              </p>
            </div>
            {/* Tambahkan form atau editor di sini */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateUsage;
