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
    <section className="py-16 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-gray-900 dark:to-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden" id="features">
      {/* Subtle noise texture */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
            Semua yang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Anda Butuhkan
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Fitur canggih untuk membuat undangan pernikahan yang tak terlupakan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-lg dark:bg-gray-900 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>

              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 dark:bg-gray-800 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark text-gray-300 dark:bg-gray-900 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
