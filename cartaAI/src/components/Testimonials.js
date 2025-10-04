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
    <section className="bg-light-gray py-20 sm:py-24" id="testimonials">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Apa Kata Mereka?
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Cerita sukses dari pengguna kami yang bahagia.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl bg-white p-8 shadow-md">
              <p className="text-secondary">"{testimonial.text}"</p>
              <div className="mt-4 flex items-center gap-4">
                <img
                  alt={`Foto ${testimonial.name}`}
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.image}
                />
                <div>
                  <h4 className="font-bold text-primary">{testimonial.name}</h4>
                  <p className="text-sm text-secondary">{testimonial.role}</p>
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
