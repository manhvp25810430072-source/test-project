import ExportPanel from './ExportPanel';
import SimulationPanel from './SimulationPanel';
import AIPanel from './AIPanel';
import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import ArenaBoard from './ArenaBoard';
import ManagementPanel from './ManagementPanel';
import { useMainStore } from '../../store/useMainStore';

export default function BattleLayout() {
  const { placeCharacterOnBoard, teamA, teamB, appStage } = useMainStore();

  // Hàm chạy khi người dùng thả chuột
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Nếu nhả chuột ra ngoài bàn cờ thì không làm gì cả
    if (!over) return;

    const charId = active.id as string;
    const team = active.data.current?.team as 'A' | 'B';
    const cellId = over.id as string; // dạng "cell-x-y"

    // Tách x và y từ ID của ô
    const parts = cellId.split('-');
    if (parts.length !== 3) return;
    const x = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);

    // Luật chống đè: Kiểm tra xem ô (x,y) này đã có ai đứng chưa
    const isOccupied = [...teamA, ...teamB].some(
      c => c.position?.x === x && c.position?.y === y
    );

    if (isOccupied) {
      console.log('Ô này đã có người đứng!');
      return; // Bị đè -> DndContext tự động búng thẻ quay về chỗ cũ
    }

    // Nếu hợp lệ, lưu tọa độ vào Zustand
    placeCharacterOnBoard(team, charId, x, y);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full h-screen flex flex-row bg-gray-950 text-white overflow-hidden">
        <ArenaBoard />
        
        {/* Máy Trạng Thái quản lý Cột Bên Phải */}
        {appStage === 'PHASE_4_AI_GENERATING' && <AIPanel />}
        {appStage === 'PHASE_5_SIMULATING' && <SimulationPanel />}
        {appStage === 'PHASE_6_EXPORTING' && <ExportPanel />}
        {(appStage !== 'PHASE_4_AI_GENERATING' && appStage !== 'PHASE_5_SIMULATING' && appStage !== 'PHASE_6_EXPORTING') && <ManagementPanel />}
        
      </div>
    </DndContext>
  );
}