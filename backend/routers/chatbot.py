from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)

# Initialize Gemini with GOOGLE_API_KEY1
api_key = os.getenv("GOOGLE_API_KEY1")
if not api_key:
    # Fallback to standard key if KEY1 is not immediately found (though client added it)
    api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Warning: No Google API Key found for Chatbot.")
else:
    genai.configure(api_key=api_key)

# The model definition (using flash for chat as it's fast)
model = genai.GenerativeModel('gemini-2.5-flash')

SYSTEM_PROMPT = """
Kamu adalah Assistant Virtual "CartaAI", sebuah platform web canggih untuk membuat undangan pernikahan digital yang indah, modern, dan mudah digunakan.

**Pengetahuan tentang CartaAI:**
1. **Fitur Utama:** Pembuatan undangan digital yang cepat, responsif, dan elegan. Pengguna bisa mengatur RSVP, ucapan/guestbook, galeri foto, musik background, dan cerita cinta.
2. **Paket Harga:**
   - **Paket Basic (Gratis):** Fitur dasar, 1 tema, batas tamu 50, fitur RSVP standar, watermark CartaAI.
   - **Paket Premium (Rp 99.000):** Tema tak terbatas (Classic, Modern, Minimalis, Floral, Rustic, dll), ganti warna (Color Theme), tanpa watermark, galeri foto sampai 20 foto, musik custom, batas tamu tak terbatas, prioritas dukungan.
3. **Template/Tema:** Ada banyak pilihan seperti Modern Minimalist, Classic Gold, Romantic Floral, Rustic Vintage, dll. Semua bisa disesuaikan warnanya.
4. **Cara Membuat:** Pengguna cukup login -> pilih Template -> isi form detail pernikahan (nama, waktu, lokasi, foto) -> klik "Generate" -> undangan siap disebarkan via link.

**Gaya Bicara:**
- Ramah, sopan, profesional, dan sangat membantu.
- Selalu gunakan bahasa Indonesia yang baik, namun santai (menggunakan sapaan seperti "Halo!", "Tentu saja bisa!", dll).
- Jika ditanya hal di luar konteks pernikahan atau undangan, tetap jawab dengan sopan, tapi usahakan untuk menghubungkannya kembali dengan layanan CartaAI jika memungkinkan (memberi saran).
- Jawaban yang diberikan harus informatif dan langsung ke poinnya. Jangan terlalu panjang, gunakan format bullet/numbering jika menjelaskan tahapan atau fitur.

Tugas kamu adalah membantu setiap pengguna yang bertanya melalui chat di website CartaAI dengan sebaik mungkin.
"""

class ChatMessage(BaseModel):
    role: str # "user" or "bot"/"model"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key not configured on server.")

    try:
        # Build history format for Gemini API
        formatted_history = []
        for msg in request.history:
            # Gemini uses "user" and "model" roles
            role = "model" if msg.role == "bot" else "user"
            formatted_history.append({"role": role, "parts": [msg.content]})

        # Start a chat session with the model, injecting the system prompt as the first instruction
        # Note: Depending on the generativeai version, system instructions might need to be passed differently.
        # Here we configure the model directly with system_instruction support if available, 
        # but to be safe across versions, we can inject it into the first prompt or configure the model.
        
        # Newest SDK supports system_instruction
        chat_model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=SYSTEM_PROMPT
        )

        chat_session = chat_model.start_chat(history=formatted_history)
        
        response = chat_session.send_message(request.message)
        
        return {
            "reply": response.text
        }
    except Exception as e:
        print(f"Chatbot Error: {e}")
        # Jika gagal, fallback ke error message yang ramah
        return {"reply": "Maaf, sistem saya sedang sibuk saat ini. Bisakah Anda mengulangi pertanyaannya beberapa saat lagi? 🙏"}
