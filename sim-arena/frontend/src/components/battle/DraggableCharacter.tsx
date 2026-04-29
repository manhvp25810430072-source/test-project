import { useDraggable } from '@dnd-kit/core';
import type { Character } from '../../store/useMainStore';
import { useMainStore } from '../../store/useMainStore';

interface Props {
  character: Character;
}

export default function DraggableCharacter({ character }: Props) {
  // Khai báo thẻ này có thể kéo được với id là id của nhân vật
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: character.id,
    data: { team: character.team }
  });

  const { uploadedShapes } = useMainStore();
  const shape = uploadedShapes.find(s => s.id === character.shapeId);

  // CSS để thẻ di chuyển mượt theo chuột
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`p-2 mb-2 rounded border-2 cursor-grab active:cursor-grabbing flex items-center gap-3 bg-gray-800 transition-colors ${
        character.team === 'A' ? 'border-blue-500/50 hover:border-blue-400' : 'border-red-500/50 hover:border-red-400'
      }`}
    >
      {shape && (
        <img src={shape.previewUrl} alt="avatar" className="w-10 h-10 object-cover rounded" />
      )}
      <div>
        <div className="font-bold text-sm">{character.name}</div>
        <div className="text-xs text-gray-400">HP: {character.stats.hp} | ATK: {character.stats.damage}</div>
      </div>
    </div>
  );
}