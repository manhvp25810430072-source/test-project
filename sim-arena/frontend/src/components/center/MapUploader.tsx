import { useRef } from 'react';
import { useMainStore } from '../../store/useMainStore';

export default function MapUploader() {
  const { setMap, mapDescription, setMapDescription } = useMainStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMap(file, previewUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col mt-6 relative z-10">
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded shadow transition-colors w-full md:w-1/2 mx-auto"
      >
        Tải Ảnh Bản Đồ
      </button>
      
      {/* Ô nhập mô tả hiệu ứng gửi cho AI */}
      <textarea 
        className="w-full bg-gray-800/80 text-white p-3 rounded mt-4 border border-gray-600 focus:border-blue-400 focus:outline-none placeholder-gray-400" 
        placeholder="Nhập mô tả hiệu ứng bản đồ (VD: Khu rừng sương mù, tầm nhìn giảm, phe Đỏ được tăng sức mạnh ẩn nấp...)"
        rows={3}
        value={mapDescription}
        onChange={(e) => setMapDescription(e.target.value)}
      />
    </div>
  );
}