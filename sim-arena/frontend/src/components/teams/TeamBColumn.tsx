import { useState } from 'react';
import { useMainStore } from '../../store/useMainStore';
import CharacterModal from './CharacterModal';

export default function TeamBColumn() {
  const { teamB, removeCharacter, uploadedShapes } = useMainStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleOpenModal = (id: string | null = null) => {
    setEditId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
      <h2 className="text-2xl font-bold text-red-500 mb-6 text-center sticky top-0 bg-gray-900 py-2 z-10">ĐỘI B</h2>
      
      <div className="flex-1 space-y-3">
        {teamB.map((char) => {
          const shape = uploadedShapes.find(s => s.id === char.shapeId);
          return (
            <div key={char.id} className="group relative bg-gray-800 border border-gray-700 p-3 rounded-md flex justify-between items-center hover:border-red-500/50 transition-all">
              <div className="flex items-center gap-3">
                {shape && (
                  <img src={shape.previewUrl} className="w-10 h-10 rounded object-cover border border-gray-600" alt="avatar" />
                )}
                <div>
                  <div className="font-bold text-white">{char.name}</div>
                  <div className="text-xs text-gray-400">HP: {char.stats.hp} | ATK: {char.stats.damage}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(char.id)}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => removeCharacter('B', char.id)}
                  className="p-1.5 hover:bg-red-900/30 rounded text-red-500 hover:text-red-400 transition-colors"
                >
                  ❌
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => handleOpenModal()}
          className="w-full border-2 border-dashed border-gray-600 text-gray-500 hover:border-red-400 hover:text-red-400 py-4 rounded-lg flex items-center justify-center cursor-pointer transition-all mt-4"
        >
          <span className="text-2xl mr-2">+</span> Thêm Quân
        </button>
      </div>

      {isModalOpen && (
        <CharacterModal team="B" onClose={handleCloseModal} editId={editId} />
      )}
    </div>
  );
}

