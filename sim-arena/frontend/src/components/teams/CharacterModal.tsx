import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Thêm công cụ Portal
import { useMainStore } from '../../store/useMainStore';
import type { Character } from '../../store/useMainStore';

interface CharacterModalProps {
  team: 'A' | 'B';
  onClose: () => void;
  editId?: string | null;
}

export default function CharacterModal({ team, onClose, editId }: CharacterModalProps) {
  const { uploadedShapes, teamA, teamB, addCharacter, updateCharacter } = useMainStore();

  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [basicAttackDesc, setBasicAttackDesc] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [hp, setHp] = useState(100);
  const [agility, setAgility] = useState(10);
  const [damage, setDamage] = useState(20);
  const [range, setRange] = useState(1);
  const [shapeId, setShapeId] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const charList = team === 'A' ? teamA : teamB;
      const char = charList.find(c => c.id === editId);
      if (char) {
        setName(char.name);
        setPersonality(char.personality);
        setBasicAttackDesc(char.basicAttackDesc);
        setSkillDesc(char.skillDesc);
        setHp(char.stats.hp);
        setAgility(char.stats.agility);
        setDamage(char.stats.damage);
        setRange(char.stats.range);
        setShapeId(char.shapeId);
      }
    }
  }, [editId, team, teamA, teamB]);

  const isValid = name.trim() !== '' && personality.trim() !== '' && shapeId !== null;

  const handleClose = () => {
    const hasUnsavedChanges = name !== '' || personality !== '';
    if (hasUnsavedChanges && !editId) {
      if (!window.confirm("Bạn có chắc muốn thoát? Dữ liệu chưa lưu sẽ bị mất.")) {
        return;
      }
    }
    onClose();
  };

  const handleSave = () => {
    if (!isValid) return;

    const charData: Character = {
      id: editId || crypto.randomUUID(),
      team,
      name,
      personality,
      basicAttackDesc,
      skillDesc,
      stats: { hp, agility, damage, range },
      shapeId,
      position: null
    };

    if (editId) {
      updateCharacter(team, editId, charData);
    } else {
      addCharacter(team, charData);
    }
    onClose();
  };

  // NỘI DUNG MODAL ĐƯỢC GIỮ NGUYÊN
  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="absolute inset-0" onClick={handleClose}></div>
      
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl p-6 relative z-10 shadow-2xl">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl px-2"
        >
          X Đóng
        </button>
        
        <h2 className={`text-2xl font-bold mb-6 border-b border-gray-700 pb-2 ${team === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
          {editId ? '✏️ CHỈNH SỬA NHÂN VẬT' : '✨ TẠO MỚI NHÂN VẬT'} - ĐỘI {team}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Tên nhân vật *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Mô tả Tính cách nhân vật *</label>
              <textarea value={personality} onChange={e => setPersonality(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" placeholder="VD: Điên cuồng, thích lao vào chỗ đông người..."></textarea>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Mô tả cách thức tấn công cơ bản</label>
              <textarea value={basicAttackDesc} onChange={e => setBasicAttackDesc(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" placeholder="VD: Phóng dao điện từ xa..."></textarea>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Mô tả kỹ năng (nếu có)</label>
              <textarea value={skillDesc} onChange={e => setSkillDesc(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" placeholder="(Tùy chọn) Bỏ trống nếu là lính thường"></textarea>
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Chỉ số Chiến đấu</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Máu (HP)</label>
                  <input type="number" min="1" value={hp} onChange={e => setHp(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Nhanh nhẹn</label>
                  <input type="number" min="1" value={agility} onChange={e => setAgility(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Sát thương</label>
                  <input type="number" min="0" value={damage} onChange={e => setDamage(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Tầm đánh</label>
                  <input type="number" min="1" value={range} onChange={e => setRange(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex-1 border border-gray-700 rounded-lg p-4 bg-gray-800/50">
              <label className="block text-gray-400 text-sm mb-2">Chọn Khối Hình Đại Diện *</label>
              {uploadedShapes.length === 0 ? (
                <p className="text-red-400 text-sm italic font-semibold border border-red-900 bg-red-900/20 p-2 rounded">
                  ⚠️ Vui lòng tải khối hình ở khung giữa màn hình trước!
                </p>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                  {uploadedShapes.map(shape => (
                    <img 
                      key={shape.id} 
                      src={shape.previewUrl} 
                      alt="shape"
                      onClick={() => setShapeId(shape.id)}
                      className={`w-full aspect-square object-cover rounded cursor-pointer border-2 transition-all ${
                        shapeId === shape.id 
                          ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] scale-105' 
                          : 'border-transparent hover:border-gray-500 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={!isValid}
              className={`w-full py-4 text-xl font-bold rounded mt-auto transition-all ${
                isValid 
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              ✔️ LƯU NHÂN VẬT
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Bắn Modal thẳng ra thẻ <body> để thoát khỏi bẫy Z-Index
  return createPortal(modalContent, document.body);
}
