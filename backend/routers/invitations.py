from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import hashlib
import uuid
import traceback
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Import the AI generator function
from ai_generator import create_invitation_html
from ai_generator_free import create_invitation_html_free
from dependencies import get_current_user

# --- Supabase Client Initialization ---
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file")

supabase: Client = create_client(url, key)

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
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        response = supabase.table("invitations").select("*").eq("user_id", user_id).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching invitations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_and_upload_invitation(request: InvitationRequest):
    try:
        form_data = request.dict()
        html_content = create_invitation_html(form_data)
        bucket_name = "generated-invitations"
        file_name = f"{request.slug}.html"
        
        supabase.storage.from_(bucket_name).upload(
            path=file_name, 
            file=html_content.encode('utf-8'), 
            file_options={"content-type": "text/html", "upsert": "true"}
        )
        
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        supabase.table('invitations').update({
            'generated_html_url': public_url
        }).eq('slug', request.slug).execute()

        return {"message": "Invitation generated successfully!", "invitation_public_url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate invitation: {str(e)}")

@router.post("/generate-free", status_code=status.HTTP_200_OK)
async def generate_and_upload_invitation_free(request: InvitationRequest):
    try:
        form_data = request.dict()
        html_content = create_invitation_html_free(form_data)
        bucket_name = "generated-invitations"
        file_name = f"{request.slug}.html"
        
        supabase.storage.from_(bucket_name).upload(
            path=file_name, 
            file=html_content.encode('utf-8'), 
            file_options={"content-type": "text/html", "upsert": "true"}
        )
        
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        
        supabase.table('invitations').update({
            'generated_html_url': public_url
        }).eq('slug', request.slug).execute()

        return {"message": "Free invitation generated successfully!", "invitation_public_url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate free invitation: {str(e)}")

@router.get("/all-rsvps")
async def get_all_user_rsvps(current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        user_id_str = str(user_id)
        
        inv_res = supabase.table("invitations").select("*").eq("user_id", user_id_str).execute()
        
        if not inv_res.data:
            return {"messages": [], "stats": {"total": 0, "hadir": 0, "tidak_hadir": 0}}

        inv_ids = [str(i['id']) for i in inv_res.data]
        inv_map = {}
        for i in inv_res.data:
            content = i.get('generated_content') or {}
            p = content.get('namaMempelaiPria') or content.get('namamempelaipria') or i.get('namaMempelaiPria') or "Pria"
            w = content.get('namaMempelaiWanita') or content.get('namamempelaiwanita') or i.get('namaMempelaiWanita') or "Wanita"
            inv_map[str(i['id'])] = f"{p} & {w}"

        rsvp_res = supabase.table("guestbook_entries").select("*").in_("invitation_id", inv_ids).order('created_at', desc=True).execute()
        
        mapped = []
        stats_data = {"total": 0, "hadir": 0, "tidak_hadir": 0}
        
        for item in rsvp_res.data:
            status_val = str(item.get('rsvp_status') or item.get('rsvpstatus') or "Hadir")
            stats_data["total"] += 1
            if 'tidak' in status_val.lower(): stats_data["tidak_hadir"] += 1
            else: stats_data["hadir"] += 1
                
            inv_id_str = str(item.get('invitation_id'))
            mapped.append({
                'id': item.get('id'),
                'nama': item.get('guest_name') or item.get('guestname') or "Tamu",
                'kehadiran': status_val,
                'ucapan': item.get('message') or "",
                'timestamp': item.get('created_at'),
                'undangan_id': inv_id_str,
                'nama_undangan': inv_map.get(inv_id_str, "Undangan")
            })
            
        return {"messages": mapped, "stats": stats_data}
    except Exception as e:
        print(f"CRITICAL ERROR in all-rsvps:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slug}", response_class=HTMLResponse)
async def get_invitation(slug: str):
    try:
        res = supabase.table("invitations").select("*").eq("slug", slug).execute()
        if not res.data: raise HTTPException(status_code=404)
        
        inv = res.data[0]
        content = inv.get("generated_content") or {}
        
        if isinstance(content, str):
            import json
            try: content = json.loads(content)
            except: content = {}

        def get_val(key_list, source_dicts):
            for d in source_dicts:
                if not d: continue
                for k in key_list:
                    val = d.get(k)
                    if val and val != "N/A": return val
            return None

        form_data = {
            "slug": slug,
            "namaMempelaiPria": get_val(["namaMempelaiPria", "namamempelaipria", "nama_mempelai_pria"], [content, inv]) or "Mempelai Pria",
            "namaMempelaiWanita": get_val(["namaMempelaiWanita", "namamempelaiwanita", "nama_mempelai_wanita"], [content, inv]) or "Mempelai Wanita",
            "namaAyahMempelaiPria": get_val(["namaAyahMempelaiPria", "namaayahmempelaipria"], [content, inv]),
            "namaIbuMempelaiPria": get_val(["namaIbuMempelaiPria", "namaibumempelaipria"], [content, inv]),
            "namaAyahMempelaiWanita": get_val(["namaAyahMempelaiWanita", "namaayahmempelaiwanita"], [content, inv]),
            "namaIbuMempelaiWanita": get_val(["namaIbuMempelaiWanita", "namaibumempelaiwanita"], [content, inv]),
            "tanggalAcara": get_val(["tanggalAcara", "tanggalacara"], [content, inv]) or "Tanggal Acara",
            "lokasiAcara": get_val(["lokasiAcara", "lokasiacara"], [content, inv]) or "Lokasi Acara",
            "waktuAcara": get_val(["waktuAcara", "waktuacara"], [content, inv]),
            "tempatResepsi": get_val(["tempatResepsi", "tempatresepsi"], [content, inv]),
            "waktuResepsi": get_val(["waktuResepsi", "wakturesepsi"], [content, inv]),
            "fotoMempelaiPria": get_val(["fotoMempelaiPria", "fotomempelaipria"], [content, inv]),
            "fotoMempelaiWanita": get_val(["fotoMempelaiWanita", "fotomempelaiwanita"], [content, inv]),
            "musik": get_val(["musik", "music"], [content, inv]),
            "temaWarna": get_val(["temaWarna", "temawarna"], [content, inv]),
            "galeriFoto": get_val(["galeriFoto", "galerifoto"], [content, inv]) or [],
            "catatanKhusus": get_val(["catatanKhusus", "catatankhusus"], [content, inv]),
            "agama": get_val(["agama"], [content, inv]),
            "jenisUndangan": get_val(["jenisUndangan", "jenisundangan"], [content, inv]),
        }
        
        print(f"DEBUG SENDING TO AI: {form_data['namaMempelaiPria']} & {form_data['namaMempelaiWanita']}")
        
        if form_data.get("fotoMempelaiPria") or form_data.get("musik"):
            html = create_invitation_html(form_data)
        else:
            html = create_invitation_html_free(form_data)

        return HTMLResponse(content=html)
    except Exception as e:
        print(f"Error rendering {slug}: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/", status_code=status.HTTP_200_OK)
async def bulk_delete_invitations(request: BulkDeleteRequest, current_user: dict = Depends(get_current_user)):
    try:
        user_id = getattr(current_user, 'id', None) or current_user.get('id')
        slugs = request.slugs
        supabase.table("invitations").delete().eq("user_id", user_id).in_("slug", slugs).execute()
        return {"message": "Deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{slug}/rsvp", status_code=status.HTTP_201_CREATED)
async def submit_rsvp(slug: str, rsvp: RSVPRequest):
    try:
        check = supabase.table('invitations').select('id').eq('slug', slug).execute()
        if not check.data: raise HTTPException(status_code=404)
        inv_id = check.data[0]['id']
        data = {
            'invitation_id': inv_id,
            'guest_name': rsvp.nama,
            'rsvp_status': rsvp.kehadiran,
            'message': rsvp.ucapan,
        }
        supabase.table('guestbook_entries').insert(data).execute()
        return {"message": "Success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{slug}/rsvp")
async def get_rsvp_messages(slug: str):
    try:
        check = supabase.table('invitations').select('id').eq('slug', slug).execute()
        if not check.data: raise HTTPException(status_code=404)
        inv_id = check.data[0]['id']
        res = supabase.table('guestbook_entries').select('*').eq('invitation_id', inv_id).order('created_at', desc=True).execute()
        mapped = [{'nama': i.get('guest_name'), 'kehadiran': i.get('rsvp_status'), 'ucapan': i.get('message'), 'timestamp': i.get('created_at')} for i in res.data]
        return {"messages": mapped}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
