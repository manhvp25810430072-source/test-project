import { useState, useEffect } from 'react';
import { useMainStore } from '../../store/useMainStore';

export default function AIPanel() {
  const { teamA, teamB, mapDescription, setMasterTimeline, setAppStage } = useMainStore();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Hàm gọi API Backend để nhờ AI viết kịch bản
  const generateScript = async (isRegenerate = false) => {
    setIsLoading(true);
    try {
      // 1. Gom toàn bộ thông tin nhân vật đang đứng trên bàn cờ
      const currentGridState: any = {};
      [...teamA, ...teamB].forEach(char => {
        if (char.position) {
          currentGridState[char.id] = {
            team: char.team,
            name: char.name,
            hp: char.stats.hp,
            x: char.position.x,
            y: char.position.y,
            agility: char.stats.agility,
            damage: char.stats.damage,
            range: char.stats.range,
            personality: char.personality,
            basicAttackDesc: char.basicAttackDesc,
            skillDesc: char.skillDesc
          };
        }
      });

      // 2. Đóng gói dữ liệu chuẩn bị gửi
      const payload = {
        map_description: mapDescription || "Sân đấu tiêu chuẩn",
        current_grid_state: currentGridState,
        start_ms: 0,      // Bắt đầu từ giây số 0
        end_ms: 15000,    // Kịch bản dài 15 giây (15000 ms)
        is_regenerate: isRegenerate
      };

      // 3. Bắn API sang Backend
      const res = await fetch('http://localhost:8000/api/ai/generate-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Lỗi kết nối Backend/AI");
      const data = await res.json();
      setAiResult(data);

    } catch (error) {
      console.error(error);
      alert("Lỗi khi gọi Đạo diễn AI. Hãy kiểm tra terminal Backend xem có bị lỗi API Key không nhé!");
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động gọi AI ngay khi vừa mở Panel này lên
  useEffect(() => {
    generateScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm khi người dùng bấm nút "Duyệt"
  const handleApprove = () => {
    if (aiResult && aiResult.timeline) {
      setMasterTimeline(aiResult.timeline); // Nạp kịch bản vào Store
      setAppStage('PHASE_5_SIMULATING');    // Chuyển sang Màn hình Diễn (Phase 5)
    }
  };

  return (
    <div className="w-1/2 flex flex-col p-6 overflow-y-auto bg-gray-900 border-l border-gray-800 relative z-20">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
        <span>🧠</span> ĐẠO DIỄN AI ĐANG LÀM VIỆC
      </h2>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <p className="text-purple-300 animate-pulse font-semibold text-lg text-center">
            Đang phân tích tâm lý và tính toán <br/> kết quả vật lý cho 15 giây tiếp theo...
          </p>
        </div>
      ) : aiResult ? (
        <div className="flex flex-col h-full fade-in">
          <div className="bg-gray-800 p-5 rounded-lg mb-4 flex-1 overflow-y-auto custom-scrollbar shadow-inner">
            <h3 className="font-bold text-green-400 mb-2 text-lg">TÓM TẮT DIỄN BIẾN:</h3>
            <p className="text-gray-300 italic mb-6 leading-relaxed border-l-4 border-green-500 pl-3">
              "{aiResult.chunk_summary}"
            </p>

            <h3 className="font-bold text-blue-400 mb-3 text-lg">
              TIMELINE CHI TIẾT ({aiResult.timeline?.length || 0} hành động):
            </h3>
            <div className="space-y-3">
              {aiResult.timeline?.map((event: any, idx: number) => (
                <div key={idx} className="bg-gray-900 p-3 rounded-md text-sm border border-gray-700 shadow-sm">
                  <div className="flex items-center mb-1">
                    <span className="text-yellow-500 font-mono font-bold w-14 bg-yellow-500/10 px-1 rounded">
                      {(event.time_offset_ms / 1000).toFixed(1)}s
                    </span>
                    <span className="text-white font-bold ml-2 bg-gray-700 px-2 py-0.5 rounded text-xs">
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="ml-14 text-gray-400">
                    {event.type === 'NARRATIVE' && <span className="text-gray-300 italic">"{event.content}"</span>}
                    {event.type === 'DIALOGUE' && <span className="text-blue-300 font-semibold">"{event.content}"</span>}
                    {(event.type === 'ATTACK' || event.type === 'SKILL') && (
                      <span className="text-red-400">
                        Sát thương: <span className="font-bold text-red-500">{event.hp_change} HP</span> 
                        {event.is_critical && <span className="text-orange-400 ml-2">💥 BẠO KÍCH!</span>}
                      </span>
                    )}
                    {event.type === 'MOVE' && <span className="text-green-300">Di chuyển tới tọa độ ({event.target_x}, {event.target_y})</span>}
                    {event.type === 'VFX' && <span className="text-purple-300">Tạo hiệu ứng hình ảnh/hoạt ảnh</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-auto pt-4 border-t border-gray-800">
            <button
              onClick={() => generateScript(true)}
              className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow transition-all active:scale-95"
            >
              🔄 VIẾT LẠI KỊCH BẢN
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.6)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transition-all active:scale-95 text-lg"
            >
              🎬 DUYỆT & DIỄN NGAY
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-red-500 font-bold">
          Không có dữ liệu trả về.
        </div>
      )}
    </div>
  );
}
