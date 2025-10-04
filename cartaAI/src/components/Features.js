import React from 'react';

function Features() {
  const features = [
    {
      icon: 'auto_awesome',
      title: 'Desain Cantik & Variatif',
      description: 'Pilih dari beragam desain modern dan elegan yang sesuai dengan tema acara Anda.'
    },
    {
      icon: 'rocket_launch',
      title: 'Instan & Praktis',
      description: 'Buat undangan dalam hitungan menit dengan antarmuka yang mudah digunakan.'
    },
    {
      icon: 'devices',
      title: 'Responsif & Interaktif',
      description: 'Undangan tampil sempurna di semua perangkat, dengan fitur interaktif yang menarik.'
    },
    {
      icon: 'edit',
      title: 'Personalisasi Mudah',
      description: 'Tambahkan sentuhan pribadi dengan mudah, mulai dari teks hingga foto dan musik.'
    }
  ];

  return (
    <section className="bg-white py-20 sm:py-24" id="features">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Semua yang Anda Butuhkan
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Fitur canggih untuk membuat undangan yang tak terlupakan.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-blue-100 p-4 text-soft-blue feature-icon">
                <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-primary">{feature.title}</h3>
              <p className="mt-2 text-base text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
