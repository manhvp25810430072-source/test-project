import { useState, useEffect } from 'react';
import { useMainStore } from '../../store/useMainStore';

export default function ExportPanel() {
  const { setAppStage } = useMainStore();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Đang gửi dữ liệu lên Google Veo Cloud...');

  useEffect(() => {
    // Mô phỏng quá trình render video
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('✅ VIDEO ĐÃ SẴN SÀNG!');
          return 100;
        }
        if (prev === 30) setStatus('Đang khởi tạo môi trường 3D & Ánh sáng...');
        if (prev === 60) setStatus('Đang diễn hoạt (Animating) dựa trên kịch bản AI...');
        if (prev === 85) setStatus('Đang áp dụng hiệu ứng âm thanh và nhạc nền...');
        return prev + 1;
      });
    }, 100); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-1/2 flex flex-col p-8 bg-gray-900 border-l border-gray-800 items-center justify-center text-center">
      <div className="mb-10">
        <div className="w-24 h-24 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(147,51,234,0.5)] animate-pulse">
          <span className="text-5xl">🎬</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">XUẤT VIDEO ĐIỆN ẢNH</h2>
        <p className="text-gray-400">Sử dụng mô hình Google Veo để tạo phim 4K</p>
      </div>

      <div className="w-full max-w-md bg-gray-800 h-4 rounded-full overflow-hidden mb-4 border border-gray-700">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-purple-400 font-mono mb-10 h-6">{status}</p>

      {progress === 100 && (
        <div className="space-y-4 w-full max-w-sm fade-in">
          <button 
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
            onClick={() => alert("Đang tải xuống video SimArena_Battle_01.mp4...")}
          >
            📥 TẢI VIDEO (4K MP4)
          </button>
          <button 
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold rounded-lg transition-all"
            onClick={() => {
              window.location.reload();
              setAppStage('PHASE_1_2_STUDIO');
            }}
          >
            🔄 TẠO TRẬN CHIẾN MỚI
          </button>
        </div>
      )}
    </div>
  );
}