from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.routes_ai import router as ai_router
from app.db.database import init_db
from app.api.routes_assets import router as assets_router
app = FastAPI(title="SimArena API")

# 1. Cấu hình CORS để Frontend (port 5173) có thể gọi API vào Backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong lúc phát triển mình để tất cả, sau này sẽ bóp lại
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Tĩnh hóa thư mục uploads để có thể xem ảnh qua URL (VD: http://localhost:8000/uploads/maps/abc.jpg)
# Tạo đường dẫn tuyệt đối tới thư mục uploads
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# 3. Sự kiện chạy khi khởi động Server: Tự động tạo Database và Bảng
@app.on_event("startup")
async def startup_event():
    await init_db()
    print("--- Database đã sẵn sàng! ---")

app.include_router(assets_router, prefix="/api")
app.include_router(ai_router, prefix="/api/ai")
@app.get("/")
async def root():
    return {"message": "SimArena Backend is Running!"}