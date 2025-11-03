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
    You are an expert web designer. Your task is to generate a complete, modern, and beautiful wedding invitation HTML based on the provided wedding details.
    The design, colors, theme, and style should be fully determined by the user's specified Color Theme and Invitation Style. Do not use any fixed or predefined designs; create a custom design that matches the user's preferences.
    Ensure that images, music, and gallery photos are properly included using the provided URLs.
    The final output must be ONLY the complete HTML code, starting with `<!DOCTYPE html>`.

    **Wedding Details:**
    - Slug: [SLUG]
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
    - Religion: [RELIGION]
    - Background Music URL: [MUSIC_URL]
    - Bride Photo URL: [BRIDE_PHOTO_URL]
    - Groom Photo URL: [GROOM_PHOTO_URL]
    - Gallery Photo URLs: [GALLERY_PHOTOS]
    - Special Notes: [SPECIAL_NOTES]

    **INSTRUCTIONS FOR AI:**
    1. Create a fully custom HTML design based on the Color Theme and Invitation Style. For example, if Color Theme is "Pastel Pink", use soft pinks and whites; if Invitation Style is "Romantic", incorporate floral elements and elegant fonts.
    2. Include essential sections: Cover page, Hero/Introduction, Couple details, Event details with countdown, Gallery, RSVP form, Comments section, and Footer.
    3. Use modern web technologies like Tailwind CSS for styling, and include animations, responsive design, and interactivity.
    4. Replace all placeholders (e.g., [BRIDE_NAME]) with the corresponding wedding details provided.
    5. [GALLERY_PHOTOS_HTML] is already generated - include it in the gallery section without modification.
    6. If music URL is provided, include an audio player with toggle button; otherwise, omit it.
    7. Ensure the HTML is complete, functional, and includes all provided images and URLs.
    8. Set the background image for cover and hero sections to [BACKGROUND_URL] using CSS background-size: cover to prevent breaking.
    9. For RSVP, modify the JavaScript to use fetch API for realtime: POST to '/invitations/[SLUG]/rsvp' with JSON body {nama, kehadiran, ucapan} to submit RSVP, and load messages on page load and after submission by GET from '/invitations/[SLUG]/rsvp'. Remove localStorage usage. Use the correct endpoint '/invitations/[SLUG]/rsvp' for both POST and GET. Display success message on successful submission and error message "Gagal mengirim konfirmasi. Silakan coba lagi." on failure.
    10. Use 'Pemberkatan Nikah' instead of 'Akad Nikah' in the event details section to make it more general.
    11. Ensure all invitation phrases, greetings, and calls to action are neutral and suitable for all religions, avoiding specific religious references. Use universal wedding language like "Join us in celebrating our union" instead of religion-specific terms.
    12. In the RSVP JavaScript, add try-catch blocks for fetch requests. If loading messages fails, display "Gagal memuat pesan. Coba lagi nanti." in the guest book section. For comments, use POST to '/invitations/[SLUG]/comments' to submit, and GET from '/invitations/[SLUG]/comments' to load comments.
    13. Add a Comments section after RSVP with a form (name, message), JavaScript to POST to '/invitations/[SLUG]/comments' with JSON body {nama, pesan} for submission and GET from '/invitations/[SLUG]/comments' to load and display comments in real-time. Include try-catch for fetch requests in comments JS, displaying error messages if loading fails. Display success message on successful comment submission and error message "Gagal mengirim komentar. Silakan coba lagi." on failure.
    14. Based on the Religion field ([RELIGION]), customize the opening and closing phrases to be appropriate for that religion. For example:
        - If Islam: Use phrases like "Assalamualaikum" for opening, "Wassalamualaikum" for closing, and include relevant Islamic wedding blessings.
        - If Kristen: Use phrases like "Salam Sejahtera" for opening, "Tuhan Memberkati" for closing, and include Christian wedding blessings.
        - If Hindu: Use phrases like "Om Swastiastu" for opening, "Om Shanti Shanti Shanti Om" for closing, and include Hindu wedding blessings.
        - If Buddha: Use phrases like "Namo Buddhaya" for opening, "Sadhu Sadhu Sadhu" for closing, and include Buddhist wedding blessings.
        - If Lainnya or unspecified: Use neutral universal phrases.
    15. Include appropriate religious verses or quotes in the invitation based on the Religion field. For example:
        - Islam: Include verses from Al-Quran like "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang." (Ar-Rum: 21)
        - Kristen: Include verses from Bible like "Karena itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya, sehingga keduanya itu menjadi satu daging." (Kejadian 2:24)
        - Hindu: Include quotes like "May the love between you two be as eternal as the stars in the sky."
        - Buddha: Include quotes like "All that we are is the result of what we have thought. The mind is everything. What we think we become."
        - If Lainnya or unspecified: Use inspirational quotes about love and marriage.
    16. Do not add any explanations. The output should be only the raw HTML code.
    """

    # Helper to format date for JS
    event_date_iso = data.get('tanggalAcara', '')
    event_time = data.get('waktuAcara', '00:00:00')
    if event_date_iso and ':' in event_time:
        event_date_iso = f"{event_date_iso}T{event_time}"

    # Generate gallery photos HTML in Python
    gallery_photos = data.get('galeriFoto', [])
    gallery_html = ""
    if gallery_photos:
        for i, url in enumerate(gallery_photos):
            col_span = ""
            if len(gallery_photos) > 3 and i >= len(gallery_photos) - 2:
                col_span = "col-span-2 md:col-span-1"
            gallery_html += f'<div class="scroll-reveal {col_span}"><img src="{url}" alt="Gallery Image" class="rounded-lg shadow-lg w-full h-full object-cover aspect-square transition-transform transform hover:scale-105"></div>\n                        '

    # Set background image to first gallery photo if available
    background_url = gallery_photos[0] if gallery_photos else 'N/A'

    # Check if music URL is valid
    music_url = data.get('musik') or 'N/A'
    has_music = music_url != 'N/A' and music_url.strip() != ''

    # Manually replace all placeholders in the template, ensuring no None values are passed to replace()
    prompt = prompt_template.replace("[SLUG]", data.get('slug') or 'N/A')
    prompt = prompt.replace("[BRIDE_NAME]", data.get('namaMempelaiWanita') or 'N/A')
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
    prompt = prompt.replace("[RELIGION]", data.get('agama') or 'Lainnya')
    prompt = prompt.replace("[MUSIC_URL]", music_url)
    prompt = prompt.replace("[BRIDE_PHOTO_URL]", data.get('fotoMempelaiWanita') or 'N/A')
    prompt = prompt.replace("[GROOM_PHOTO_URL]", data.get('fotoMempelaiPria') or 'N/A')
    prompt = prompt.replace("[GALLERY_PHOTOS_HTML]", gallery_html.strip())
    prompt = prompt.replace("[SPECIAL_NOTES]", data.get('catatanKhusus') or 'N/A')
    prompt = prompt.replace("[BACKGROUND_URL]", background_url)

    # Add explicit instructions for music and images
    if has_music:
        prompt += "\n\nIMPORTANT: Include the audio element and music toggle button exactly as shown in the example. The audio src must be set to [MUSIC_URL]. The music toggle button must be visible and functional."
    else:
        prompt += "\n\nIMPORTANT: Do not include any audio element or music toggle button since no music URL was provided."

    prompt += "\n\nCRITICAL: Use the exact URLs provided for images without any modification. Set the background image of the cover and hero sections to [BACKGROUND_URL]. Use [GROOM_PHOTO_URL] for the groom's photo. Include all gallery images from [GALLERY_PHOTOS_HTML]."

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