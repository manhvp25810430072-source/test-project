import { useDroppable } from '@dnd-kit/core';
import { useMainStore } from '../../store/useMainStore';

interface Props {
  x: number;
  y: number;
}

export default function DroppableCell({ x, y }: Props) {
  const cellId = `cell-${x}-${y}`;
  const { isOver, setNodeRef } = useDroppable({ id: cellId });

  // Lấy thêm các state của Phase 5 từ Store
  const { teamA, teamB, uploadedShapes, activeDialogues, activeVFX } = useMainStore();

  const charAtCell = [...teamA, ...teamB].find(
    c => c.position?.x === x && c.position?.y === y
  );
  
  const shape = charAtCell ? uploadedShapes.find(s => s.id === charAtCell.shapeId) : null;
  const dialogue = charAtCell ? activeDialogues[charAtCell.id] : null;
  const vfx = charAtCell ? activeVFX[charAtCell.id] : null;

  // Tính % máu để tô màu thanh HP
  const hpPercent = charAtCell ? Math.max(0, (charAtCell.stats.hp / (charAtCell.stats.maxHp || 1)) * 100) : 0;

  return (
    <div 
      ref={setNodeRef}
      className={`w-full h-full border border-white/5 relative transition-colors ${
        isOver ? 'bg-green-500/40' : ''
      }`}
    >
      {shape && charAtCell && (
        <div 
          className={`absolute inset-0 m-[1px] border-[1.5px] rounded flex flex-col items-center justify-center transition-all duration-300 ${
            charAtCell.team === 'A' ? 'border-blue-500 shadow-[0_0_8px_blue]' : 'border-red-500 shadow-[0_0_8px_red]'
          } ${charAtCell.stats.hp <= 0 ? 'grayscale opacity-30 scale-90' : ''}`} // Hiệu ứng chết: Trắng đen, mờ đi
          style={vfx?.css_override || {}}
        >
          {/* Bong bóng Chat (Chỉ hiện khi có người nói) */}
          {dialogue && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg z-50 min-w-[80px] text-center pointer-events-none animate-bounce">
              {dialogue.content}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
            </div>
          )}

          {/* Ảnh Avatar */}
          <img src={shape.previewUrl} alt="unit" className="w-full h-full object-cover rounded-[2px]" />
          
          {/* Thanh Máu (Chỉ hiện khi còn sống) */}
          {charAtCell.stats.hp > 0 && (
            <div className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gray-900 border border-gray-700 rounded-full overflow-hidden z-10">
              <div 
                className={`h-full transition-all duration-300 ${hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${hpPercent}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}