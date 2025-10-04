import React from 'react';
import { useParams } from 'react-router-dom';

const TemplateUsage = () => {
  const { id } = useParams();

  // Dummy data, in real app fetch from API or state
  const templates = {
    1: { title: 'Klasik Elegan', description: 'Undangan pernikahan dengan desain klasik dan elegan.', imageUrl: '/assets/template_klasik_3.jpeg', category: 'elegan' },
    2: { title: 'Pesona Vintage', description: 'Desain vintage yang memikat dan penuh kehangatan.', imageUrl: '/assets/templates/klasik2.jpg', category: 'elegan' },
    3: { title: 'Formal Klasik', description: 'Ornamen detail dengan nuansa resmi dan berwibawa.', imageUrl: '/assets/formal_1.webp', category: 'formal' },
    4: { title: 'Formal Modern', description: 'Tampilan sederhana, bersih, namun tetap formal.', imageUrl: '/assets/formal_2.webp', category: 'formal' },
    7: { title: 'Klasik Kerajaan', description: 'Undangan dengan sentuhan kerajaan yang mewah.', imageUrl: '/assets/template_klasik_1.jpeg', category: 'elegan' },
    9: { title: 'Formal Natural', description: 'Nuansa lembut dengan sentuhan alam yang tetap anggun.', imageUrl: '/assets/formal_3.webp', category: 'formal' },
    10: { title: 'Elegan Emas', description: 'Desain elegan dengan sentuhan emas dan kemewahan.', imageUrl: '/assets/templates/elegant1.jpg', category: 'simple' },
    11: { title: 'Pesona Sofistikasi', description: 'Undangan dengan desain elegan dan mewah.', imageUrl: '/assets/templates/elegant2.jpg', category: 'simple' },
    12: { title: 'Skrip Mewah', description: 'Tipografi elegan dengan elemen mewah.', imageUrl: '/assets/templates/elegant3.jpg', category: 'simple' },
  };

  const template = templates[id];

  if (!template) {
    return <div className="container mx-auto px-6 py-24">Template tidak ditemukan.</div>;
  }

  const getCategoryContent = (category) => {
    switch (category) {
      case 'elegan':
        return {
          tips: 'Template elegan cocok untuk pernikahan tradisional. Gunakan warna netral seperti putih, emas, dan hitam untuk kesan elegan.',
          steps: ['Pilih font klasik seperti serif.', 'Tambahkan elemen vintage seperti bunga atau renda.', 'Sesuaikan teks dengan nama dan tanggal pernikahan.']
        };
      case 'formal':
        return {
          tips: 'Template formal ideal untuk pasangan muda. Fokus pada kesederhanaan dan elemen geometris.',
          steps: ['Gunakan warna kontras seperti hitam dan putih.', 'Tambahkan ikon modern seperti garis atau bentuk abstrak.', 'Pastikan layout bersih dan minimalis.']
        };
      case 'simple':
        return {
          tips: 'Template simple untuk pernikahan mewah. Gunakan elemen seperti emas, kristal, dan tipografi mewah.',
          steps: ['Pilih palet warna emas dan putih.', 'Tambahkan detail seperti monogram atau lambang.', 'Sesuaikan dengan tema pernikahan Anda.']
        };
      default:
        return {
          tips: 'Nikmati menggunakan template ini.',
          steps: ['Edit teks sesuai kebutuhan.', 'Sesuaikan gambar dan warna.', 'Simpan dan bagikan.']
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
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h2 className="text-2xl font-semibold text-primary mb-2">{template.title}</h2>
        <p className="text-secondary mb-4">{template.description}</p>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">Tips Penggunaan</h3>
          <p className="text-secondary">{categoryContent.tips}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">Langkah-langkah</h3>
          <ol className="list-decimal list-inside text-secondary">
            {categoryContent.steps.map((step, index) => (
              <li key={index} className="mb-1">{step}</li>
            ))}
          </ol>
        </div>

        <p className="text-sm text-gray-500">Di sini Anda bisa mengedit dan menggunakan template ini untuk undangan Anda.</p>
        {/* Tambahkan form atau editor di sini */}
      </div>
    </div>
  );
};

export default TemplateUsage;
