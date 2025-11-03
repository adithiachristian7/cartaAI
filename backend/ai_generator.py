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
    9. **Guestbook and Comments JavaScript Logic (VERY IMPORTANT):**
        - Create two JavaScript functions: `loadRsvp()` and `loadComments()`.
        - **`loadRsvp()` function:**
            - It must perform a `fetch` GET request to `/invitations/[SLUG]/rsvp`.
            - The response will be a JSON object like `{ "messages": [...] }`. You **must** access the array using `data.messages`.
            - On success, it must clear the RSVP display container (e.g., `<div id="rsvp-list">`).
            - Then, it must loop through the `data.messages` array. For each message, create a new HTML element and display `nama`, `kehadiran`, and `ucapan`. Append this element to the container.
        - **`loadComments()` function:**
            - It must perform a `fetch` GET request to `/invitations/[SLUG]/comments`.
            - The response will be a JSON object like `{ "comments": [...] }`. You **must** access the array using `data.comments`.
            - It must clear the comments display container (e.g., `<div id="comments-list">`) and render the list of comments by looping through the `data.comments` array, displaying `nama` and `pesan`.
        - **On Page Load:** When the page's DOM is fully loaded, call both `loadRsvp()` and `loadComments()` to display the initial data.
        - **On Form Submission:**
            - For the RSVP form, after a successful `POST` to `/invitations/[SLUG]/rsvp`, you **must** call `loadRsvp()` again to refresh the list.
            - For the Comments form, after a successful `POST` to `/invitations/[SLUG]/comments`, you **must** call `loadComments()` again to refresh the list.
        - Display error messages like "Gagal memuat pesan..." inside the respective containers if the `fetch` calls fail.
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