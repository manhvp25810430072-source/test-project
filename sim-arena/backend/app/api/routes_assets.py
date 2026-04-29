from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import shutil
import os
import uuid
from app.db.database import get_db_connection

router = APIRouter()

# Đường dẫn vật lý đến thư mục uploads
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")

@router.post("/upload/shape")
async def upload_shape(
    file: UploadFile = File(...),
    id: str = Form(...), # ID từ Frontend gửi lên (Zustand)
    asset_name: str = Form(...)
):
    try:
        # Lấy đuôi file (VD: png, jpg)
        file_ext = file.filename.split(".")[-1]
        # Tạo đường dẫn lưu file
        file_path = f"/uploads/shapes/{id}.{file_ext}"
        physical_path = os.path.join(UPLOAD_DIR, "shapes", f"{id}.{file_ext}")
        
        # Lưu file vật lý
        with open(physical_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Lưu vào Database SQLite
        db = await get_db_connection()
        await db.execute(
            "INSERT INTO uploaded_assets (id, asset_type, asset_name, file_path) VALUES (?, ?, ?, ?)",
            (id, 'SHAPE', asset_name, file_path)
        )
        await db.commit()
        await db.close()
        
        return {"message": "Shape uploaded successfully!", "file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload/map")
async def upload_map(
    file: UploadFile = File(...),
    effect_description: str = Form(...)
):
    try:
        map_id = str(uuid.uuid4())
        file_ext = file.filename.split(".")[-1]
        file_path = f"/uploads/maps/{map_id}.{file_ext}"
        physical_path = os.path.join(UPLOAD_DIR, "maps", f"{map_id}.{file_ext}")
        
        with open(physical_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        db = await get_db_connection()
        cursor = await db.execute(
            "INSERT INTO map_configs (bg_image_path, effect_description) VALUES (?, ?)",
            (file_path, effect_description)
        )
        await db.commit()
        await db.close()
        
        return {"message": "Map uploaded successfully!", "file_path": file_path, "map_id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
