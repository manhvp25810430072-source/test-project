-- Bảng 1: uploaded_assets (Lưu hình ảnh khối)
CREATE TABLE IF NOT EXISTS uploaded_assets (
    id VARCHAR(50) PRIMARY KEY,
    asset_type VARCHAR(20) NOT NULL,
    asset_name VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2: map_configs (Lưu thông số Bản đồ)
CREATE TABLE IF NOT EXISTS map_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bg_image_path VARCHAR(255) NOT NULL,
    effect_description TEXT
);