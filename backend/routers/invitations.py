from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Import the AI generator function
from ai_generator import create_invitation_html
from dependencies import get_current_user

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

# --- Pydantic Models ---
class InvitationRequest(BaseModel):
    slug: str
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

class RSVPRequest(BaseModel):
    nama: str
    kehadiran: str
    ucapan: Optional[str] = None

class BulkDeleteRequest(BaseModel):
    slugs: List[str]

# --- Endpoints ---

@router.get("/")
async def get_user_invitations(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.id
        response = supabase.table("invitations").select("*").eq("user_id", user_id).order("created_at", ascending=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_and_upload_invitation(request: InvitationRequest):
    try:
        form_data = request.dict()
        html_content = create_invitation_html(form_data)
        bucket_name = "generated-invitations"
        file_name = f"{request.slug}.html"
        
        try:
            supabase.storage.from_(bucket_name).remove([file_name])
        except Exception:
            pass # Ignore if file doesn't exist

        supabase.storage.from_(bucket_name).upload(
            path=file_name, 
            file=html_content.encode('utf-8'), 
            file_options={"content-type": "text/html", "upsert": "true"}
        )
        
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        update_response = supabase.table('invitations').update({
            'generated_html_url': public_url
        }).eq('slug', request.slug).execute()

        if not update_response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invitation with slug '{request.slug}' not found.")

        return {"message": "Invitation generated successfully!", "invitation_public_url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate invitation: {str(e)}")

@router.delete("/", status_code=status.HTTP_200_OK)
async def bulk_delete_invitations(request: BulkDeleteRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.id
        slugs_to_delete = request.slugs

        if not slugs_to_delete:
            raise HTTPException(status_code=400, detail="No slugs provided for deletion.")

        # Verify all slugs belong to the current user before deleting
        user_invitations_response = supabase.table("invitations").select("slug").eq("user_id", user_id).in_("slug", slugs_to_delete).execute()
        owned_slugs = {inv['slug'] for inv in user_invitations_response.data}

        if not all(slug in owned_slugs for slug in slugs_to_delete):
            raise HTTPException(status_code=403, detail="You do not have permission to delete one or more of the selected invitations.")

        # Delete files from storage
        bucket_name = "generated-invitations"
        file_names = [f"{slug}.html" for slug in owned_slugs]
        if file_names:
            supabase.storage.from_(bucket_name).remove(file_names)

        # Delete records from database
        supabase.table("invitations").delete().in_("slug", list(owned_slugs)).execute()

        return {"message": f"Successfully deleted {len(owned_slugs)} invitations."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slug}", response_class=HTMLResponse)
async def get_invitation(slug: str):
    try:
        bucket_name = "generated-invitations"
        file_name = f"{slug}.html"
        response = supabase.storage.from_(bucket_name).download(file_name)
        return HTMLResponse(content=response.decode('utf-8'))
    except Exception:
        raise HTTPException(status_code=404, detail=f"Invitation with slug '{slug}' not found.")

@router.delete("/{slug}", status_code=status.HTTP_200_OK)
async def delete_invitation(slug: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.id
        invitation_response = supabase.table("invitations").select("id, user_id").eq("slug", slug).single().execute()
        
        if not invitation_response.data:
            raise HTTPException(status_code=404, detail="Invitation not found.")
        if invitation_response.data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="You do not have permission to delete this invitation.")

        bucket_name = "generated-invitations"
        file_name = f"{slug}.html"
        supabase.storage.from_(bucket_name).remove([file_name])
        supabase.table("invitations").delete().eq("slug", slug).execute()

        return {"message": f"Invitation '{slug}' deleted successfully."}
    except Exception as e:
        if "list index out of range" in str(e) or "NoneType" in str(e):
             raise HTTPException(status_code=404, detail="Invitation not found.")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{slug}/rsvp", status_code=status.HTTP_201_CREATED)
async def submit_rsvp(slug: str, rsvp: RSVPRequest):
    try:
        invitation_check = supabase.table('invitations').select('id').eq('slug', slug).execute()
        if not invitation_check.data:
            raise HTTPException(status_code=404, detail=f"Invitation with slug '{slug}' not found.")
        invitation_id = invitation_check.data[0]['id']
        rsvp_data = {
            'invitation_id': invitation_id,
            'guest_name': rsvp.nama,
            'rsvp_status': rsvp.kehadiran,
            'message': rsvp.ucapan,
        }
        response = supabase.table('guestbook_entries').insert(rsvp_data).execute()
        return {"message": "RSVP submitted successfully!", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit RSVP: {str(e)}")

@router.get("/{slug}/rsvp")
async def get_rsvp_messages(slug: str):
    try:
        invitation_check = supabase.table('invitations').select('id').eq('slug', slug).execute()
        if not invitation_check.data:
            raise HTTPException(status_code=404, detail=f"Invitation with slug '{slug}' not found.")
        invitation_id = invitation_check.data[0]['id']
        response = supabase.table('guestbook_entries').select('guest_name, rsvp_status, message, created_at').eq('invitation_id', invitation_id).order('created_at', desc=True).execute()
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
        raise HTTPException(status_code=500, detail=f"Failed to retrieve RSVP messages: {str(e)}")