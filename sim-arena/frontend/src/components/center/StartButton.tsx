import { useState } from 'react';
import { useMainStore } from '../../store/useMainStore';

export default function StartButton() {
  // Lấy thêm hàm setAppStage từ Zustand
  const { mapImage, mapDescription, uploadedShapes, setAppStage } = useMainStore();
  const [isUploading, setIsUploading] = useState(false);

  const isReady = mapImage !== null && mapDescription.trim() !== '';

  const handleStart = async () => {
    if (!isReady || isUploading) return;
    setIsUploading(true);

    try {
      // 1. Gửi ảnh Bản Đồ
      const mapFormData = new FormData();
      mapFormData.append('file', mapImage);
      mapFormData.append('effect_description', mapDescription);

      await fetch('http://localhost:8000/api/upload/map', {
        method: 'POST',
        body: mapFormData,
      });

      // 2. Gửi các Khối Hình
      for (const shape of uploadedShapes) {
        const shapeFormData = new FormData();
        shapeFormData.append('file', shape.file);
        shapeFormData.append('id', shape.id);
        shapeFormData.append('asset_name', `shape_${shape.id.substring(0, 5)}`);

        await fetch('http://localhost:8000/api/upload/shape', {
          method: 'POST',
          body: shapeFormData,
        });
      }

      // 3. [QUAN TRỌNG] Đổi State để App.tsx lật màn hình sang Phase 3
      setAppStage('PHASE_3_SETUP_BOARD');
      
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      // Tạm thời nếu Backend chưa bật hoặc lỗi, mình vẫn ép nó sang Phase 3 để test UI nhé
      alert('Có lỗi Backend, nhưng hệ thống vẫn sẽ chuyển sang Phase 3 để bạn test giao diện!');
      setAppStage('PHASE_3_SETUP_BOARD');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-auto pt-6 relative z-10">
      <button 
        disabled={!isReady || isUploading}
        onClick={handleStart}
        className={`w-full py-4 text-2xl font-bold rounded transition-all duration-300 ${
          isReady && !isUploading
            ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:bg-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isUploading ? 'ĐANG CHUẨN BỊ CHIẾN TRƯỜNG...' : 'BẮT ĐẦU GIẢ LẬP'}
      </button>
    </div>
  );
}