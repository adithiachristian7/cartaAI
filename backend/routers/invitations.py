from fastapi import APIRouter, HTTPException, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Import the AI generator function
from ai_generator import create_invitation_html

# --- Supabase Client Initialization ---
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
# PENTING: Gunakan Service Role Key untuk bypass RLS saat update dari backend
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file")

supabase: Client = create_client(url, key)
# --- End of Initialization ---


router = APIRouter(
    prefix="/invitations",
    tags=["Invitations"],
)

# Model data diperbarui untuk menyertakan slug
class InvitationRequest(BaseModel):
    slug: str # Slug diperlukan untuk mengidentifikasi record di DB
    namaMempelaiPria: str
    namaAyahMempelaiPria: Optional[str] = None
    namaIbuMempelaiPria: Optional[str] = None
    namaMempelaiWanita: str
    namaAyahMempelaiWanita: Optional[str] = None
    namaIbuMempelaiWanita: Optional[str] = None
    tanggalAcara: str
    waktuAcara: Optional[str] = None
    lokasiAcara: str
    waktuResepsi: Optional[str] = None
    tempatResepsi: Optional[str] = None
    temaWarna: Optional[str] = None
    jenisUndangan: Optional[str] = None
    agama: Optional[str] = None
    catatanKhusus: Optional[str] = None
    musik: Optional[str] = None
    fotoMempelaiPria: Optional[str] = None
    fotoMempelaiWanita: Optional[str] = None
    galeriFoto: Optional[List[str]] = []


@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_and_upload_invitation(request: InvitationRequest):
    """
    Menerima data undangan, generate HTML, upload ke Supabase Storage,
    dan update record di database dengan URL publiknya.
    """
    try:
        form_data = request.dict()

        # 1. Panggil AI untuk generate HTML
        print("Generating HTML with AI...")
        html_content = create_invitation_html(form_data)
        print("HTML generation complete.")

        # 2. Upload HTML ke Supabase Storage
        bucket_name = "generated-invitations"
        # Gunakan slug untuk nama file agar unik dan mudah diidentifikasi
        file_name = f"{request.slug}.html"
        
        print(f"Uploading {file_name} to bucket {bucket_name}...")
        # Metode upload butuh bytes, jadi kita encode string HTML nya
        # `upsert=True` akan menimpa file jika sudah ada, berguna untuk regenerasi
        # TAPI, untuk memastikan Content-Type ter-update, kita hapus dulu file lama jika ada.
        try:
            supabase.storage.from_(bucket_name).remove([file_name])
            print(f"Successfully removed existing file: {file_name}")
        except Exception as e:
            # Abaikan error jika file tidak ada (ini diharapkan pada pembuatan pertama)
            print(f"Could not remove file (may not exist): {file_name}, error: {e}")

        print(f"Uploading {file_name} to bucket {bucket_name}...")
        supabase.storage.from_(bucket_name).upload(
            path=file_name, 
            file=html_content.encode('utf-8'), 
            file_options={"content-type": "text/html", "upsert": "true"}
        )
        
        # 3. Dapatkan URL publik dari file yang di-upload
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        print(f"File uploaded. Public URL: {public_url}")

        # 4. Update baris yang sesuai di database
        print(f"Updating database record for slug: {request.slug}")
        update_response = supabase.table('invitations').update({
            'generated_html_url': public_url
        }).eq('slug', request.slug).execute()

        if not update_response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invitation with slug '{request.slug}' not found.")

        return {
            "message": "Invitation generated and URL saved successfully!",
            "invitation_public_url": public_url
        }

    except Exception as e:
        print(f"An error occurred in the endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate invitation: {str(e)}"
        )


@router.get("/{slug}", response_class=HTMLResponse)
async def get_invitation(slug: str):
    """
    Serve the generated invitation HTML file directly from Supabase storage
    """
    try:
        bucket_name = "generated-invitations"
        file_name = f"{slug}.html"

        # Get the invitation HTML content from Supabase storage
        response = supabase.storage.from_(bucket_name).download(file_name)
        html_content = response.decode('utf-8')

        return HTMLResponse(content=html_content)
    except Exception as e:
        print(f"Error retrieving invitation: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invitation with slug '{slug}' not found."
        )# RSVP Models
class RSVPRequest(BaseModel):
    nama: str
    kehadiran: str  # "Hadir" or "Tidak Hadir"
    ucapan: Optional[str] = None


@router.post("/{slug}/rsvp", status_code=status.HTTP_201_CREATED)
async def submit_rsvp(slug: str, rsvp: RSVPRequest):
    """
    Submit an RSVP message for the invitation and store it in Supabase.
    """
    try:
        # Check if invitation exists
        invitation_check = supabase.table('invitations').select('id').eq('slug', slug).execute()
        if not invitation_check.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invitation with slug '{slug}' not found.")

        invitation_id = invitation_check.data[0]['id']

        # Insert RSVP into database
        rsvp_data = {
            'invitation_id': invitation_id,
            'guest_name': rsvp.nama,
            'rsvp_status': rsvp.kehadiran,
            'message': rsvp.ucapan,
        }

        response = supabase.table('guestbook_entries').insert(rsvp_data).execute()

        return {"message": "RSVP submitted successfully!", "data": response.data[0]}

    except Exception as e:
        print(f"Error submitting RSVP: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit RSVP: {str(e)}"
        )


@router.get("/{slug}/rsvp")
async def get_rsvp_messages(slug: str):
    """
    Retrieve all RSVP messages for the invitation.
    """
    try:
        # Get invitation ID
        invitation_check = supabase.table('invitations').select('id').eq('slug', slug).execute()
        if not invitation_check.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invitation with slug '{slug}' not found.")

        invitation_id = invitation_check.data[0]['id']

        # Get RSVP messages
        response = supabase.table('guestbook_entries').select('guest_name, rsvp_status, message, created_at').eq('invitation_id', invitation_id).order('created_at', desc=True).execute()

        # Map to expected output format
        mapped_data = []
        for item in response.data:
            mapped_data.append({
                'nama': item.get('guest_name'),
                'kehadiran': item.get('rsvp_status'),
                'ucapan': item.get('message'),
                'timestamp': item.get('created_at')
            })

        return {"messages": mapped_data}

    except Exception as e:
        print(f"Error retrieving RSVP messages: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve RSVP messages: {str(e)}"
        )



