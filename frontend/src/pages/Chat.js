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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 overflow-x-hidden relative">
      {/* Subtle noise texture */}
      <div
        className="fixed inset-0 opacity-5 dark:hidden pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Buat Undangan Pernikahan dengan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                AI
              </span>
            </h1>
            <div className="relative inline-block mb-8">
              <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-4 border-indigo-500 shadow-md"></div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Berikan detail desain undangan anda dan ciptakan undangan yang
              cantik
            </p>
          </div>

          {/* Chat Container */}
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl mb-8">
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
              }}
            ></div>

            {/* Chat Header */}
            <div
              className="px-6 py-4"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-indigo-600 text-xl">
                    smart_toy
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">carta AI</h3>
                  <p className="text-indigo-100 text-sm">
                    Online - Siap membantu Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-800/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                      message.type === "user"
                        ? "text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
                    }`}
                    style={
                      message.type === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }
                        : {}
                    }
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                            animationDelay: "0.1s",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                            animationDelay: "0.2s",
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Sedang mengetik...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-6 bg-white dark:bg-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik detail undangan Anda di sini..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && inputMessage.trim()) {
                      e.target.style.background =
                        "linear-gradient(135deg, #764ba2 0%, #667eea 100%)";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 16px rgba(102, 126, 234, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && inputMessage.trim()) {
                      e.target.style.background =
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() =>
                setInputMessage(
                  "Saya ingin membuat undangan pernikahan dengan tema rustic, nama mempelai pria John dan wanita Jane, tanggal 15 Desember 2024"
                )
              }
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer text-left"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">
                    celebration
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 transition-colors block mb-2">
                  Tema Rustic
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Contoh prompt untuk undangan rustic
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                setInputMessage(
                  "Buat undangan modern dengan warna biru navy, nama mempelai Alex dan Sarah, tanggal 20 Januari 2025 di Jakarta"
                )
              }
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer text-left"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">
                    palette
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 transition-colors block mb-2">
                  Tema Modern
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Contoh prompt untuk undangan modern
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                setInputMessage(
                  "Saya butuh undangan klasik dengan tema emas, nama mempelai Michael dan Emily, tanggal 10 Februari 2025"
                )
              }
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer text-left"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md bg-gradient-to-br from-indigo-500 to-purple-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-xl">
                    auto_awesome
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-700 transition-colors block mb-2">
                  Tema Klasik
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Contoh prompt untuk undangan klasik
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
