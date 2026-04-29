import aiosqlite
import os

# Đường dẫn vật lý tới file CSDL và file schema
DB_PATH = os.path.join(os.path.dirname(__file__), "simarena.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schemas.sql")

async def init_db():
    # Khởi tạo database và tạo bảng từ file schemas.sql
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("PRAGMA foreign_keys = ON")
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_script = f.read()
        await db.executescript(schema_script)
        await db.commit()

async def get_db_connection():
    # Hàm để các API gọi vào khi cần thao tác với DB
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    return db