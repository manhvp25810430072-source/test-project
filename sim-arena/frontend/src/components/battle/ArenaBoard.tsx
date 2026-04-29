import { useMainStore } from '../../store/useMainStore';
import DroppableCell from './DroppableCell';

export default function ArenaBoard() {
  const { mapPreviewUrl } = useMainStore();

  // Tạo mảng 400 ô tọa độ (20x20)
  const gridCells = [];
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      gridCells.push({ x, y });
    }
  }

  return (
    <div className="w-1/2 flex flex-col items-center justify-center p-4 relative bg-gray-950">
      
      <div className="w-full max-w-[500px] flex flex-col relative">
        {/* Khung Hội Thoại Mô Phỏng (Top Area) */}
        <div 
          className="w-full bg-gray-900/80 border border-gray-700 rounded-t-lg mb-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-2"
          style={{ height: '150px' }} // Chiều cao = 30% của 500px
        >
          <div className="text-xs text-gray-500 italic text-center">--- Bắt đầu ghi log diễn biến ---</div>
          <div className="text-sm text-gray-300">Trận chiến chuẩn bị bắt đầu. Bầu không khí căng thẳng...</div>
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 shrink-0"></div>
            <div className="bg-blue-900/50 p-2 rounded-lg text-sm text-white">Chúng ta sẽ nghiền nát chúng!</div>
          </div>
        </div>

        {/* Khung Vuông Giả Lập 20x20 */}
        <div 
          className="w-full aspect-square relative bg-cover bg-center rounded-b-lg overflow-hidden shadow-2xl border border-gray-600"
          style={{ backgroundImage: `url(${mapPreviewUrl})` }}
        >
          {/* Lớp phủ tối */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Lưới tọa độ vô hình */}
          <div 
            className="absolute inset-0"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(20, minmax(0, 1fr))', gridTemplateRows: 'repeat(20, minmax(0, 1fr))' }}
          >
            {gridCells.map(cell => (
              <DroppableCell key={`cell-${cell.x}-${cell.y}`} x={cell.x} y={cell.y} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}