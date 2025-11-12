import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Chatbot() {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Halo! 👋 Saya siap membantu Anda membuat undangan pernikahan yang indah. Ada yang bisa saya bantu?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulasi response bot
    setTimeout(() => {
      const botResponses = [
        "Saya mengerti! Untuk membuat undangan pernikahan, Anda bisa mulai dengan memilih tema yang sesuai. Apakah Anda lebih suka tema klasik, modern, atau minimalis?",
        "Bagus! Saya bisa membantu Anda membuat undangan yang personal dan elegan. Coba klik tombol 'Coba Gratis' di atas untuk mulai membuat undangan Anda.",
        "Untuk informasi lebih lanjut tentang paket dan harga, silakan kunjungi halaman Harga. Kami menawarkan paket Basic (Gratis) dan Premium dengan fitur lengkap.",
        "Anda juga bisa melihat contoh template undangan yang tersedia di halaman Template. Pilih template yang paling sesuai dengan selera Anda!",
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: randomResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    {
      text: "Cara membuat undangan?",
      icon: "help",
    },
    {
      text: "Lihat paket harga",
      icon: "attach_money",
    },
    {
      text: "Contoh template",
      icon: "palette",
    },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
          aria-label="Buka Chatbot"
        >
          <span className="material-symbols-outlined text-white text-3xl">
            chat
          </span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col shadow-2xl rounded-2xl overflow-hidden">
          {/* Gradient border wrapper */}
          <div
            className="relative rounded-2xl p-1 h-full"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="bg-white rounded-2xl h-full flex flex-col">
              {/* Top accent bar */}
              <div
                className="absolute top-1 left-1 right-1 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                }}
              ></div>

              {/* Chat Header */}
              <div
                className="px-6 py-4 flex items-center justify-between relative z-10"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">
                      smart_toy
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">cartaAI Assistant</h3>
                    <p className="text-white/80 text-xs">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label="Tutup Chatbot"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
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
                          : "bg-white text-gray-800 border border-gray-100"
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
                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 2 && (
                <div className="px-6 pt-4 pb-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Pertanyaan cepat:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(prompt.text)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {prompt.icon}
                        </span>
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tulis pesan Anda..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Atau{" "}
                  <Link
                    to={session ? "/chat" : "/login"}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    buka halaman chat lengkap
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;

