import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Halo! Saya adalah asisten AI untuk membantu Anda membuat undangan pernikahan yang cantik. Silakan berikan detail acara Anda seperti nama mempelai, tanggal, lokasi, dan tema yang diinginkan.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        content: `Terima kasih atas detail yang Anda berikan! Saya akan membantu membuat undangan pernikahan berdasarkan informasi tersebut. 

Untuk melanjutkan, saya akan:
1. Membuat desain undangan yang sesuai dengan tema Anda
2. Menambahkan detail acara (nama mempelai, tanggal, lokasi)
3. Menyediakan preview undangan digital
4. Membantu Anda mengkustomisasi lebih lanjut

Apakah ada detail tambahan yang ingin Anda sampaikan? Misalnya:
- Tema warna yang diinginkan
- Jenis undangan (klasik, modern, rustic, dll)
- Jumlah undangan yang dibutuhkan
- Fitur khusus (foto, musik, peta lokasi)`,
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Buat Undangan Pernikahan dengan AI
            </h1>
            <p className="text-lg text-secondary">
              Berikan detail desain undangan anda dan ciptakan undangan yang cantik
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-soft-blue px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-soft-blue">
                    smart_toy
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white">carta AI</h3>
                  <p className="text-blue-100 text-sm">
                    Online - Siap membantu Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-soft-blue text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        Sedang mengetik...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t p-6">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik detail undangan Anda di sini..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="btn-primary px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() =>
                setInputMessage(
                  "Saya ingin membuat undangan pernikahan dengan tema rustic, nama mempelai pria John dan wanita Jane, tanggal 15 Desember 2024"
                )
              }
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-soft-blue hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-soft-blue">
                  celebration
                </span>
                <span className="font-medium text-primary">Tema Rustic</span>
              </div>
              <p className="text-sm text-secondary">
                Contoh prompt untuk undangan rustic
              </p>
            </button>

            <button
              onClick={() =>
                setInputMessage(
                  "Buat undangan modern dengan warna biru navy, nama mempelai Alex dan Sarah, tanggal 20 Januari 2025 di Jakarta"
                )
              }
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-soft-blue hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-soft-blue">
                  palette
                </span>
                <span className="font-medium text-primary">Tema Modern</span>
              </div>
              <p className="text-sm text-secondary">
                Contoh prompt untuk undangan modern
              </p>
            </button>

            <button
              onClick={() =>
                setInputMessage(
                  "Saya butuh undangan klasik dengan tema emas, nama mempelai Michael dan Emily, tanggal 10 Februari 2025"
                )
              }
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-soft-blue hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-soft-blue">
                  auto_awesome
                </span>
                <span className="font-medium text-primary">Tema Klasik</span>
              </div>
              <p className="text-sm text-secondary">
                Contoh prompt untuk undangan klasik
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
