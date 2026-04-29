import { useState, useRef, useEffect } from 'react';
import { useMainStore } from '../../store/useMainStore';

export default function SimulationPanel() {
  // Đã thêm setAppStage vào đây để gọi trực tiếp từ Store
  const {
    Master_Timeline,
    liveLogs,
    addLiveLog,
    applyDamageById,
    moveCharacterById,
    setActiveDialogue,
    setVFXById,
    setAppStage 
  } = useMainStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Dùng useRef để lưu các bộ đếm giờ (Pha xử lý TypeScript cực bén của bạn!)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup: Tự động xóa các bộ đếm giờ nếu người dùng thoát màn hình
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const startSimulation = () => {
    if (isPlaying || Master_Timeline.length === 0) return;
    
    setIsPlaying(true);
    setIsFinished(false);
    addLiveLog("🎬 [HỆ THỐNG] Máy quay bắt đầu chạy! 15 giây đếm ngược...");

    let maxTime = 0;

    Master_Timeline.forEach((event) => {
      if (event.time_offset_ms > maxTime) maxTime = event.time_offset_ms;

      const timer = setTimeout(() => {
        switch (event.type) {
          case 'NARRATIVE':
            addLiveLog(`📢 DẪN TRUYỆN: ${event.content}`);
            break;
            
          case 'DIALOGUE':
            addLiveLog(`💬 HỘI THOẠI: Nhân vật vừa lên tiếng.`);
            setActiveDialogue(event.actor_id, { content: event.content, emotion: event.emotion });
            setTimeout(() => setActiveDialogue(event.actor_id, null), 3000);
            break;
            
          case 'ATTACK':
          case 'SKILL':
            addLiveLog(`⚔️ CHIẾN ĐẤU: Đã trừ ${Math.abs(event.hp_change)} HP.`);
            if (event.target_id && event.hp_change) {
              applyDamageById(event.target_id, event.hp_change);
            }
            break;
            
          case 'MOVE':
            addLiveLog(`🏃 DI CHUYỂN: Tới tọa độ (${event.target_x}, ${event.target_y})`);
            moveCharacterById(event.actor_id, event.target_x, event.target_y);
            break;
            
          case 'VFX':
            if (event.target_id) {
                setVFXById(event.target_id, event);
                const duration = event.duration_ms || 2000;
                setTimeout(() => setVFXById(event.target_id, null), duration);
            }
            break;
        }
      }, event.time_offset_ms);

      timeoutRefs.current.push(timer);
    });

    const endTimer = setTimeout(() => {
      setIsPlaying(false);
      setIsFinished(true);
      addLiveLog("⏹️ [HỆ THỐNG] CẮT! Đã hoàn thành kịch bản.");
    }, maxTime + 1000); 

    timeoutRefs.current.push(endTimer);
  };

  return (
    <div className="w-1/2 flex flex-col p-6 overflow-y-auto bg-gray-900 border-l border-gray-800 relative z-20">
      <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
        <span>🎥</span> ĐANG TRÊN PHIM TRƯỜNG
      </h2>

      <div className="flex-1 bg-gray-950 border border-gray-700 rounded-lg p-4 mb-6 overflow-y-auto custom-scrollbar flex flex-col gap-2">
        {liveLogs.length === 0 ? (
          <div className="text-gray-500 italic text-center my-auto">
            Bấm "BẮT ĐẦU DIỄN" để xem các nhân vật hoạt động...
          </div>
        ) : (
          liveLogs.map((log, index) => (
            <div key={index} className="text-sm font-mono text-gray-300 border-b border-gray-800/50 pb-1 fade-in">
              {log}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <button
          onClick={startSimulation}
          disabled={isPlaying || isFinished}
          className={`py-4 font-bold text-xl rounded-lg shadow-lg transition-all ${
            isPlaying ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
            isFinished ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-600' :
            'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] active:scale-95'
          }`}
        >
          {isPlaying ? '🎬 ĐANG DIỄN...' : isFinished ? '✅ ĐÃ DIỄN XONG' : '▶️ BẮT ĐẦU DIỄN'}
        </button>

        {isFinished && (
          <button
            onClick={() => setAppStage('PHASE_6_EXPORTING')}
            className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-bounce"
          >
            🎞️ XUẤT THÀNH VIDEO
          </button>
        )}
      </div>
    </div>
  );
}
