import React from "react";

function Tentangg() {
  // data tim
  const teamMembers = [
    { name: 'Prince', role: 'CEO & Founder' },
    { name: 'Adriel', role: 'Lead Developer & AI Specialist' },
    { name: 'Julio', role: 'AI Specialist & Backend Developer' },
    { name: 'Adith', role: 'UI/UX & Frontend Developer' },
    { name: 'Sandro', role: 'Marketing Manager' },
  ];

  // data contoh undangan
  const invitationExamples = [
    {
      title: "Undangan Elegan",
      description: "Desain minimalis dengan sentuhan warna emas dan putih.",
      imageUrl:
        "https://via.placeholder.com/300x200?text=Undangan+Elegan",
    },
    {
      title: "Undangan Modern",
      description:
        "Desain kontemporer dengan elemen geometris dan warna cerah.",
      imageUrl:
        "https://via.placeholder.com/300x200?text=Undangan+Modern",
    },
    {
      title: "Undangan Tradisional",
      description:
        "Desain klasik dengan ornamen tradisional dan warna hangat.",
      imageUrl:
        "https://via.placeholder.com/300x200?text=Undangan+Tradisional",
    },
  ];

  // JSX return
  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-extrabold tracking-tighter text-primary text-center mb-12">
        Tentang CartaAI
      </h1>

      {/* Section Deskripsi */}
      <section className="mb-16">
        <p className="text-secondary max-w-3xl mx-auto text-center">
          CartaAI adalah layanan pembuatan undangan pernikahan digital berbasis teknologi
          generative AI. Kami membantu Anda membuat undangan yang personal, elegan, dan
          interaktif dengan mudah dan cepat.
        </p>
      </section>

      {/* Section Tim */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Tim Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4 h-24 w-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="text-lg font-semibold text-primary">{member.name}</h3>
              <p className="text-secondary">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Contoh Undangan */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Contoh Undangan Pernikahan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {invitationExamples.map((invitation, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={invitation.imageUrl}
                alt={invitation.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary">{invitation.title}</h3>
                <p className="text-secondary">{invitation.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Tentangg;
