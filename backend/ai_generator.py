import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the generative AI model
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set!")
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.5-pro')

def create_invitation_html(data: dict) -> str:
    """
    Generates a complete, modern, and beautiful HTML file for a wedding invitation
    by filling a robust template with the provided form data.

    Args:
        data: A dictionary containing the form data from the frontend.

    Returns:
        A string containing the full HTML of the invitation.
    """

    # Define the template as a standard multiline string. No f-string needed.
    # This avoids all curly brace escaping issues.
    prompt_template = """
    You are an expert web designer. Your task is to populate the provided HTML template with the user's wedding details.
    You MUST use the exact HTML structure provided. Only replace the placeholders (e.g., [BRIDE_NAME]) with the corresponding data.
    Customize the colors to match the requested theme, but do not alter the core structure, especially the <head> section.
    The final output must be ONLY the complete HTML code, starting with `<!DOCTYPE html>`.

    **Wedding Details:**
    - Bride's Name: [BRIDE_NAME]
    - Bride's Parents: [BRIDE_PARENTS]
    - Groom's Name: [GROOM_NAME]
    - Groom's Parents: [GROOM_PARENTS]
    - Event Date: [EVENT_DATE]
    - Ceremony Time: [CEREMONY_TIME]
    - Ceremony Location: [CEREMONY_LOCATION]
    - Reception Time: [RECEPTION_TIME]
    - Reception Location: [RECEPTION_LOCATION]
    - Color Theme: [COLOR_THEME]
    - Invitation Style: [INVITATION_STYLE]
    - Background Music URL: [MUSIC_URL]
    - Special Notes: [SPECIAL_NOTES]

    **HTML TEMPLATE TO FILL:**
    ```html
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>The Wedding of [BRIDE_NAME] & [GROOM_NAME]</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@300;400;600&family=Great+Vibes&display=swap" rel="stylesheet">
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            'theme-primary': '#8B5E34',
                            'theme-secondary': '#F0E6D2',
                            'theme-accent': '#C89B6D',
                            'theme-text': '#4A4A4A',
                            'theme-bg': '#F9F6F2',
                        },
                        fontFamily: {
                            'serif': ['Playfair Display', 'serif'],
                            'sans': ['Montserrat', 'sans-serif'],
                            'script': ['Great Vibes', 'cursive'],
                        }
                    }
                }
            }
        </script>
        <style>
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            .animate-on-scroll.is-visible {
                opacity: 1;
                transform: translateY(0);
            }
        </style>
    </head>
    <body class="bg-theme-bg text-theme-text font-sans">

        <div id="cover" class="fixed inset-0 bg-theme-bg z-50 flex flex-col justify-center items-center text-center p-4">
            <p class="text-lg tracking-widest">THE WEDDING OF</p>
            <h1 class="font-script text-6xl md:text-8xl text-theme-primary my-4">[BRIDE_NAME] & [GROOM_NAME]</h1>
            <p class="font-semibold">[EVENT_DATE]</p>
            <button id="open-invitation" class="mt-8 bg-theme-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-theme-accent transition-transform transform hover:scale-105">
                Buka Undangan
            </button>
        </div>

        <div id="main-content" class="opacity-0 transition-opacity duration-1000">
            <header class="h-screen min-h-[500px] flex flex-col justify-center items-center text-center p-6 bg-theme-secondary">
                <div class="animate-on-scroll">
                    <p class="tracking-widest">WE ARE GETTING MARRIED</p>
                    <h1 class="font-script text-7xl md:text-9xl text-theme-primary my-2">[BRIDE_NAME] & [GROOM_NAME]</h1>
                    <p class="font-serif text-xl">[EVENT_DATE]</p>
                </div>
            </header>
            <main>
                <section class="py-20 px-6 text-center">
                    <div class="max-w-3xl mx-auto animate-on-scroll">
                        <h2 class="font-script text-5xl text-theme-primary mb-4">Om Swastyastu</h2>
                        <p class="leading-relaxed">
                            Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud mengundang Bapak/Ibu/Saudara/i, untuk menghadiri upacara Manusa Yadnya Pawiwahan (Pernikahan) putra-putri kami:
                        </p>
                    </div>
                    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
                        <div class="text-center md:text-right animate-on-scroll">
                            [BRIDE_PHOTO]
                            <h3 class="font-serif text-4xl text-theme-primary">[BRIDE_NAME]</h3>
                            <p class="font-semibold mt-2">Putri dari Pasangan</p>
                            <p>[BRIDE_PARENTS]</p>
                        </div>
                        <div class="font-script text-7xl text-theme-accent animate-on-scroll">&</div>
                        <div class="text-center md:text-left animate-on-scroll">
                            [GROOM_PHOTO]
                            <h3 class="font-serif text-4xl text-theme-primary">[GROOM_NAME]</h3>
                            <p class="font-semibold mt-2">Putra dari Pasangan</p>
                            <p>[GROOM_PARENTS]</p>
                        </div>
                    </div>
                </section>
                <section class="py-20 px-6 bg-theme-secondary">
                    <div class="max-w-4xl mx-auto text-center">
                        <div class="animate-on-scroll">
                            <h2 class="font-serif text-4xl text-theme-primary mb-2">Save The Date</h2>
                            <p class="mb-10">Detail Acara</p>
                        </div>
                        <div class="flex flex-col md:flex-row gap-8 justify-center">
                            <div class="bg-theme-bg p-8 rounded-lg shadow-md flex-1 animate-on-scroll">
                                <h3 class="font-serif text-3xl text-theme-primary mb-4">Upacara Pawiwahan</h3>
                                <p class="font-bold">[EVENT_DATE]</p>
                                <p>[CEREMONY_TIME]</p>
                                <p class="mt-2">[CEREMONY_LOCATION]</p>
                            </div>
                            <div class="bg-theme-bg p-8 rounded-lg shadow-md flex-1 animate-on-scroll" style="transition-delay: 200ms">
                                <h3 class="font-serif text-3xl text-theme-primary mb-4">Resepsi</h3>
                                <p class="font-bold">[EVENT_DATE]</p>
                                <p>[RECEPTION_TIME]</p>
                                <p class="mt-2">[RECEPTION_LOCATION]</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="py-20 px-6 text-center">
                    <div class="max-w-3xl mx-auto animate-on-scroll">
                        <h2 class="font-serif text-4xl text-theme-primary mb-8">Menghitung Hari</h2>
                        <div id="countdown" class="flex justify-center gap-4 text-theme-primary">
                            <div><div id="days" class="text-4xl font-bold">0</div><div class="text-sm">Hari</div></div>
                            <div><div id="hours" class="text-4xl font-bold">0</div><div class="text-sm">Jam</div></div>
                            <div><div id="minutes" class="text-4xl font-bold">0</div><div class="text-sm">Menit</div></div>
                            <div><div id="seconds" class="text-4xl font-bold">0</div><div class="text-sm">Detik</div></div>
                        </div>
                    </div>
                </section>
                <section class="py-20 px-6 bg-theme-bg text-center">
                    <div class="max-w-5xl mx-auto animate-on-scroll">
                        <h2 class="font-serif text-4xl text-theme-primary mb-8">Galeri Foto</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="photo-gallery">
                            [PHOTO_GALLERY]
                        </div>
                    </div>
                </section>
            </main>
            <footer class="py-16 px-6 text-center bg-theme-secondary">
                <div class="animate-on-scroll">
                    <p class="leading-relaxed max-w-2xl mx-auto">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir untuk memberikan doa restu.</p>
                    <h2 class="font-script text-5xl text-theme-primary my-6">Terima Kasih</h2>
                    <p class="text-sm text-theme-text/70">&copy; 2025 [BRIDE_NAME] & [GROOM_NAME]</p>
                </div>
            </footer>
        </div>
        [AUDIO_PLAYER]
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const cover = document.getElementById('cover');
                const mainContent = document.getElementById('main-content');
                const openButton = document.getElementById('open-invitation');
                const audio = document.getElementById('background-music');
                openButton.addEventListener('click', () => {
                    cover.style.opacity = '0';
                    setTimeout(() => {
                        cover.style.display = 'none';
                        mainContent.style.opacity = '1';
                        document.body.style.overflow = 'auto';
                        if (audio) {
                            audio.play().catch(e => console.error("Audio autoplay failed:", e));
                        }
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    entry.target.classList.add('is-visible');
                                    observer.unobserve(entry.target);
                                }
                            });
                        }, { threshold: 0.1 });
                        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
                    }, 600);
                });
                document.body.style.overflow = 'hidden';
                const countdownDate = new Date("[EVENT_DATE_ISO]").getTime();
                const timer = setInterval(function() {
                    const now = new Date().getTime();
                    const distance = countdownDate - now;
                    if (distance < 0) {
                        clearInterval(timer);
                        document.getElementById('countdown').innerHTML = "<p>The event has started!</p>";
                        return;
                    }
                    document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
                    document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    document.getElementById('minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    document.getElementById('seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000);
                }, 1000);
            });
        </script>
    </body>
    </html>
    ```

    **INSTRUCTIONS FOR AI:**
    1.  Replace the placeholders like [BRIDE_NAME] with the details provided.
    2.  **Color Customization:** Based on the 'Color Theme' ([COLOR_THEME]), replace the default hex codes in the `tailwind.config` script.
        -   'Classic Gold': primary: '#D4AF37', secondary: '#FFF8DC', accent: '#B8860B', bg: '#FFFFFF', text: '#363636'
        -   'Navy Blue': primary: '#000080', secondary: '#F0F8FF', accent: '#4682B4', bg: '#FFFFFF', text: '#191970'
        -   'Rose Pink': primary: '#FFC0CB', secondary: '#FFF0F5', accent: '#DB7093', bg: '#FFFFFF', text: '#8B4513'
        -   'Forest Green': primary: '#228B22', secondary: '#F0FFF0', accent: '#556B2F', bg: '#FFFFFF', text: '#006400'
        -   'Purple Royal': primary: '#8A2BE2', secondary: '#F8F0FF', accent: '#9370DB', bg: '#FFFFFF', text: '#4B0082'
        -   'Sunset Orange': primary: '#FF7F50', secondary: '#FFF5EE', accent: '#FF6347', bg: '#FFFFFF', text: '#8B4513'
    3.  Do not add any explanations. The output should be only the raw HTML code.
    """

    # Helper to format date for JS
    event_date_iso = data.get('tanggalAcara', '')
    event_time = data.get('waktuAcara', '00:00:00')
    if event_date_iso and ':' in event_time:
        event_date_iso = f"{event_date_iso}T{event_time}"

    # Manually replace all placeholders in the template, ensuring no None values are passed to replace()
    prompt = prompt_template.replace("[BRIDE_NAME]", data.get('namaMempelaiWanita') or 'N/A')
    prompt = prompt.replace("[BRIDE_PARENTS]", f"{data.get('namaAyahMempelaiWanita') or 'Bapak Mempelai Wanita'} & {data.get('namaIbuMempelaiWanita') or 'Ibu Mempelai Wanita'}")
    prompt = prompt.replace("[GROOM_NAME]", data.get('namaMempelaiPria') or 'N/A')
    prompt = prompt.replace("[GROOM_PARENTS]", f"{data.get('namaAyahMempelaiPria') or 'Bapak Mempelai Pria'} & {data.get('namaIbuMempelaiPria') or 'Ibu Mempelai Pria'}")
    prompt = prompt.replace("[EVENT_DATE]", data.get('tanggalAcara') or 'Tanggal Acara')
    prompt = prompt.replace("[EVENT_DATE_ISO]", event_date_iso or "")
    prompt = prompt.replace("[CEREMONY_TIME]", data.get('waktuAcara') or 'Waktu Acara')
    prompt = prompt.replace("[CEREMONY_LOCATION]", data.get('lokasiAcara') or 'Lokasi Acara')
    prompt = prompt.replace("[RECEPTION_TIME]", data.get('waktuResepsi') or 'Waktu Resepsi')
    prompt = prompt.replace("[RECEPTION_LOCATION]", data.get('tempatResepsi') or 'Lokasi Resepsi')
    prompt = prompt.replace("[COLOR_THEME]", data.get('temaWarna') or 'Classic Gold')
    prompt = prompt.replace("[INVITATION_STYLE]", data.get('jenisUndangan') or 'Modern Minimalist')
    prompt = prompt.replace("[MUSIC_URL]", data.get('musik') or 'N/A')
    prompt = prompt.replace("[SPECIAL_NOTES]", data.get('catatanKhusus') or 'N/A')

    # Handle photo embedding
    bride_photo_html = ""
    if data.get('fotoMempelaiWanita'):
        bride_photo_html = f'<img src="{data['fotoMempelaiWanita']}" alt="Foto Mempelai Wanita" class="w-32 h-32 rounded-full object-cover mx-auto mb-4">'
    prompt = prompt.replace("[BRIDE_PHOTO]", bride_photo_html)

    groom_photo_html = ""
    if data.get('fotoMempelaiPria'):
        groom_photo_html = f'<img src="{data['fotoMempelaiPria']}" alt="Foto Mempelai Pria" class="w-32 h-32 rounded-full object-cover mx-auto mb-4">'
    prompt = prompt.replace("[GROOM_PHOTO]", groom_photo_html)

    gallery_html = ""
    if data.get('galeriFoto'):
        gallery_html = "".join([f'<img src="{url}" alt="Gallery Image" class="w-full h-48 object-cover rounded-lg">' for url in data['galeriFoto']])
    prompt = prompt.replace("[PHOTO_GALLERY]", gallery_html)

    musik_url = data.get("musik")
    audio_player_html = f'<audio id="background-music" loop><source src="{musik_url}" type="audio/mpeg"></audio>' if musik_url else ""
    prompt = prompt.replace("[AUDIO_PLAYER]", audio_player_html)

    try:
        response = model.generate_content(prompt)
        # Clean up the response to ensure it's just raw HTML
        html_content = response.text.strip()
        if html_content.startswith("```html"):
            html_content = html_content[7:]
        if html_content.endswith("```"):
            html_content = html_content[:-3]
        
        return html_content.strip()
    except Exception as e:
        print(f"An error occurred while generating HTML: {e}")
        return f"<html><body><h1>Error Generating Invitation</h1><p>{e}</p></body></html>"