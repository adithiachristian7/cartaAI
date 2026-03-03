import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the generative AI model using GOOGLE_API_KEY2 for the free tier
api_key = os.getenv("GOOGLE_API_KEY2")
if not api_key:
    # Fallback if KEY2 is missing
    api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY2 environment variable not set!")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

def create_invitation_html_free(data: dict) -> str:
    """
    Generates a simplified, standard modern HTML file for a free-tier wedding invitation.
    It ignores custom colors, themes, photos, and music.
    """

    prompt_template = """
    You are an expert web designer. Your task is to generate a complete, beautiful wedding invitation HTML based on the provided wedding details.
    Since this is a free tier layout, you must use a standard, elegant, minimal design (e.g., clean white/off-white background, serif fonts for headings, and soft gold or gray accents). 
    Do not use any custom photos, backgrounds, or music. Use CSS gradients or simple patterns if needed.
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
    - Religion: [RELIGION]
    - Special Notes: [SPECIAL_NOTES]

    **INSTRUCTIONS FOR AI:**
    1. Create a clean, elegant HTML design using standard CSS or Tailwind via CDN.
    2. Include essential sections: Cover page, Hero/Introduction, Couple details, Event details with countdown, RSVP form, Comments section, and Footer.
    3. Ensure a "Created with CartaAI - Free Version" watermark or badge is placed neatly in the footer.
    4. Replace all placeholders with the corresponding wedding details provided.
    5. **RSVP & Guestbook JavaScript Logic (VERY IMPORTANT):**
        - Create one combined section for "RSVP & Ucapan".
        - This section must contain a single form with inputs for `nama` (name), `kehadiran` (attendance status: Hadir/Tidak Hadir), and `ucapan` (message).
        - Create one JavaScript function, for example `loadRsvpMessages()`.
        - **`loadRsvpMessages()` function:**
            - It must perform a `fetch` GET request to `/api/invitations/[SLUG]/rsvp`.
            - The response will be a JSON object like `{ "messages": [...] }`. You **must** access the array using `data.messages`.
            - On success, it must clear the guestbook display container (e.g., `<div id="guestbook-list">`).
            - Then, it must loop through the `data.messages` array. For each message, create a new HTML element and display the `nama`, `kehadiran`, and `ucapan`. Append this element to the container.
        - **On Page Load:** When the page's DOM is fully loaded, call `loadRsvpMessages()` to display the initial data.
        - **On Form Submission:**
            - After a successful `POST` to `/api/invitations/[SLUG]/rsvp` with the form data, you **must** call `loadRsvpMessages()` again to refresh the list with the new message.
    """

    # Helper to format date for JS
    event_date_iso = data.get('tanggalAcara', '')
    event_time = data.get('waktuAcara', '00:00:00')
    if event_date_iso and ':' in event_time:
        event_date_iso = f"{event_date_iso}T{event_time}"

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
    prompt = prompt.replace("[RELIGION]", data.get('agama') or 'Lainnya')
    prompt = prompt.replace("[SPECIAL_NOTES]", data.get('catatanKhusus') or 'N/A')

    try:
        response = model.generate_content(prompt)
        html_content = response.text.strip()
        if html_content.startswith("```html"):
            html_content = html_content[7:]
        if html_content.endswith("```"):
            html_content = html_content[:-3]
        
        return html_content.strip()
    except Exception as e:
        print(f"An error occurred while generating HTML (Free tier): {e}")
        return f"<html><body><h1>Error Generating Invitation</h1><p>{e}</p></body></html>"
