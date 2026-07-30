import os
import uuid

from fastapi import APIRouter, UploadFile, File, Depends
from app import models
from app.auth import require_role

router = APIRouter(prefix="/api/upload", tags=["Upload"])

UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/banner")
async def upload_banner(
    file: UploadFile = File(...),
    current_user: models.User = Depends(require_role("faculty")),
):
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    return {"url": f"/uploads/{filename}"}
