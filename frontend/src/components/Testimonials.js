import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      text: '"CartaAI membuat undangan pernikahan kami jadi lebih berkesan! Prosesnya cepat, hasilnya cantik."',
      name: 'Maya & Rio',
      role: 'Pasangan Pernikahan',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZHKDfUSumamkw3F4_LFPRYcDPvRH1bdBWPRNIWutuW_D0xNcijtrjSJ0_IzpmB66KrNvfbA4Z9-CU48TxpX6PkaSxiy4UitBwF55QSjHjPy0dB2WOcxDBoPphlDM9iMxYF4cbJZ5Eog6K7AQ87WeiCLWtl5BpxvPzy2cMpfpi6zK9nDJlCOkkcOTs3xPzEcXa7fXtOMKtfYwSBqi4oMPsvKg1M3fqgmmOWZgSUi00FcreJ-b85x1oFoHALgaFip5ParYBI9PsTA'
    },
    {
      text: '“Kami sangat puas dengan layanan CartaAI. Desain undangannya elegan dan sesuai dengan tema pernikahan kami!”',
      name: 'Budi & Sarah',
      role: 'Pasangan Pernikahan',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSmVprl716kmIPYcupcSlwLlQlfp2DJCSzIMfO0HlzBTzXQS9SEJypycxLv8_s3EJVCDVLMS41qeEun36XHzTbdFg8cIfU3NFOvlgt7P3uFfGyo9LV6EUrkjLRJnR9qRAHEP7cRL5KLA6NrJ0092Dm6IMCkqn62A2v92u7d1Vm-RId5qbCb8Kz2SlVjNTvbQtqog4_d4Ndyr-wKDOusx4U7dkvZDPUOqVDGJ6H-XxX7Ev9xAy3BVxWkWUJlKmbbALBITcEhNLOMw'
    },
    {
      text: '“Undangan pernikahan kami jadi unik dan berkesan berkat CartaAI. Prosesnya mudah dan hasilnya luar biasa indah!”',
      name: 'Arif',
      role: 'Mempelai laki-laki',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLfXoFhhtTjEiDN2VzF55ZF5U8BuC9xn6VkQu_ywmlwSflevwrMkoymSVOPXUTnpi4NNO8kiTbVfylfE6auuVncxodnRum1uzoP1tqJ_sFOv6NI71EO5eFYPHBEUc5qMrJmJF_u0HwkV0G9oZKiNjjeoxtzxjalVKgL0tGoFxYqbDF5QMdtSGhjb2MxExMmKqspPIdfVH5KDTNuSGUU-vNmOo0rW9PMzD1RStg0_kLIlXHuI8txGDkBeWC5nwHrhDgkQSFlPrj4Q'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden" id="testimonials">
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
            Apa Kata{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Mereka?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
            Cerita sukses dari pengguna kami yang bahagia.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>

              <div className="relative z-10">
                {/* Quote icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">
                    format_quote
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 italic">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        padding: "2px",
                      }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img
                          alt={`Foto ${testimonial.name}`}
                          className="w-full h-full object-cover"
                          src={testimonial.image}
                          onError={(e) => {
                            e.target.src = "/assets/team/default-avatar.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
