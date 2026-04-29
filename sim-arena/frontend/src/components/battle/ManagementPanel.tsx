import { useState } from 'react';
import { useMainStore } from '../../store/useMainStore';
import DraggableCharacter from './DraggableCharacter';

export default function ManagementPanel() {
  const { teamA, teamB, setAppStage, setMasterTimeline } = useMainStore();
  const [jsonInput, setJsonInput] = useState('');

  // Lọc ra những nhân vật có position = null (chưa được đưa vào bàn)
  const draftTeamA = teamA.filter(c => c.position === null);
  const draftTeamB = teamB.filter(c => c.position === null);

  // Kích hoạt Ready State nếu 2 đội có người VÀ tất cả đã được kéo vào bàn
  const isDraftingComplete = teamA.length > 0 && teamB.length > 0 && draftTeamA.length === 0 && draftTeamB.length === 0;

  const handleManualRun = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.timeline || !Array.isArray(parsed.timeline)) {
        alert("JSON không hợp lệ! Thiếu mảng 'timeline'.");
        return;
      }
      setMasterTimeline(parsed.timeline);
      alert('Đã nạp kịch bản JSON! Chuẩn bị chuyển sang Phase 5 (Render).');
      // Ở Phase 6 mình sẽ chèn logic quay video vào đây. Tạm thời ép nhảy qua Phase 5
      setAppStage('PHASE_5_SIMULATING'); 
    } catch (e) {
      alert("Cú pháp JSON bị sai! Vui lòng kiểm tra lại.");
    }
  };

  if (isDraftingComplete) {
    return (
      <div className="w-1/2 flex flex-col p-6 overflow-y-auto bg-gray-900 justify-center">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">TẤT CẢ QUÂN CỜ ĐÃ VÀO VỊ TRÍ</h2>
          <p className="text-gray-400">Hãy chọn phương thức đạo diễn kịch bản</p>
        </div>

        {/* Nút Gọi AI (Sẽ làm ở Phase 4) */}
        <button 
          onClick={() => setAppStage('PHASE_4_AI_GENERATING')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)] mb-8 transition-all"
        >
          🧠 TIẾP TỤC - KẾT NỐI VỚI ĐẠO DIỄN AI
        </button>

        {/* Box Tùy chỉnh JSON (Bypass Logic) */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-300">Chế độ Nhập Kịch Bản Nhanh (JSON)</span>
            <button className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">📥 Tải file .json</button>
          </div>
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-32 bg-gray-950 text-green-400 font-mono p-3 rounded border border-gray-700 outline-none focus:border-green-500 text-sm mb-4"
            placeholder="Dán mã JSON kịch bản vào đây..."
          />
          <button 
            onClick={handleManualRun}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-[0_0_10px_rgba(234,88,12,0.4)] animate-pulse"
          >
            ⚡ CHẠY GIẢ LẬP NGAY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 flex flex-col p-6 overflow-y-auto bg-gray-900 border-l border-gray-800 custom-scrollbar">
      <h2 className="text-2xl font-bold text-white mb-6">QUẢN LÝ QUÂN LÍNH</h2>
      <p className="text-gray-400 text-sm mb-6">Kéo và thả nhân vật sang sa bàn bên trái để sắp xếp đội hình.</p>
      
      <div className="grid grid-cols-2 gap-6 flex-1">
        <div>
          <h3 className="text-blue-400 font-bold mb-3 border-b border-blue-900/50 pb-2">ĐỘI A ({draftTeamA.length})</h3>
          {draftTeamA.map(char => <DraggableCharacter key={char.id} character={char} />)}
        </div>
        <div>
          <h3 className="text-red-400 font-bold mb-3 border-b border-red-900/50 pb-2">ĐỘI B ({draftTeamB.length})</h3>
          {draftTeamB.map(char => <DraggableCharacter key={char.id} character={char} />)}
        </div>
      </div>
    </div>
  );
}
