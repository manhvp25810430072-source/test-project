import { useRef } from 'react';
import { useMainStore } from '../../store/useMainStore';

export default function AssetUploader() {
  const { uploadedShapes, addShape } = useMainStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      addShape(file, previewUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="border-dashed border-2 border-gray-600 rounded-lg p-6 flex flex-col items-center bg-gray-800/50 backdrop-blur-sm relative z-10">
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
      >
        Tải lên Khối Hình
      </button>
      
      {/* KHU VỰC ẢNH ĐƯỢC FIX LẠI THÀNH CUỘN NGANG */}
      {uploadedShapes.length > 0 && (
        <div className="flex flex-row overflow-x-auto gap-3 w-full mt-4 pb-2 custom-scrollbar">
          {uploadedShapes.map((shape) => (
            <div key={shape.id} className="relative shrink-0 w-20 h-20">
              <img 
                src={shape.previewUrl} 
                alt="shape" 
                className="w-full h-full object-cover rounded border border-gray-500 shadow-md" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}