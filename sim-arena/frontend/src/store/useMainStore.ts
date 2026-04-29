import { create } from 'zustand'

export interface Character {
  id: string; 
  team: 'A' | 'B';
  name: string;
  personality: string;      
  basicAttackDesc: string;  
  skillDesc: string;        
  stats: {
    hp: number;             
    maxHp?: number; // Thêm maxHp để tính % thanh máu
    agility: number;        
    damage: number;         
    range: number;          
  };
  shapeId: string | null;  
  position: { x: number, y: number } | null;
}

interface MainState {
  mapImage: File | null;
  mapPreviewUrl: string | null;
  mapDescription: string;
  uploadedShapes: Array<{ id: string, file: File, previewUrl: string }>;
  
  teamA: Character[];
  teamB: Character[];
  
  appStage: 'PHASE_1_2_STUDIO' | 'PHASE_3_SETUP_BOARD' | 'PHASE_4_AI_GENERATING' | 'PHASE_5_SIMULATING' | 'PHASE_6_EXPORTING';
  Master_Timeline: any[];

  // --- PHASE 5: REALTIME RENDER STATE ---
  liveLogs: string[]; // Lưu lịch sử hệ thống
  activeDialogues: Record<string, { content: string, emotion: string } | null>; // Bong bóng chat trên đầu nhân vật
  activeVFX: Record<string, any>; // Lưu hiệu ứng CSS/Animation

  // Actions
  setMap: (file: File, previewUrl: string) => void;
  setMapDescription: (desc: string) => void;
  addShape: (file: File, previewUrl: string) => void;

  addCharacter: (team: 'A' | 'B', char: Character) => void;
  updateCharacter: (team: 'A' | 'B', id: string, updatedChar: Character) => void;
  removeCharacter: (team: 'A' | 'B', id: string) => void;

  setAppStage: (stage: 'PHASE_1_2_STUDIO' | 'PHASE_3_SETUP_BOARD' | 'PHASE_4_AI_GENERATING' | 'PHASE_5_SIMULATING' | 'PHASE_6_EXPORTING') => void;
  placeCharacterOnBoard: (team: 'A' | 'B', charId: string, x: number, y: number) => void;
  setMasterTimeline: (timeline: any[]) => void;

  // --- PHASE 5: ACTIONS ---
  addLiveLog: (log: string) => void;
  setActiveDialogue: (charId: string, dialogue: { content: string, emotion: string } | null) => void;
  applyDamageById: (id: string, damage: number) => void;
  moveCharacterById: (id: string, x: number, y: number) => void;
  setVFXById: (id: string, vfx: any | null) => void;
}

export const useMainStore = create<MainState>((set) => ({
  mapImage: null,
  mapPreviewUrl: null,
  mapDescription: '',
  uploadedShapes: [],
  teamA: [],
  teamB: [],
  
  appStage: 'PHASE_1_2_STUDIO',
  Master_Timeline: [],
  
  liveLogs: [],
  activeDialogues: {},
  activeVFX: {},
  
  setMap: (file, previewUrl) => set({ mapImage: file, mapPreviewUrl: previewUrl }),
  setMapDescription: (desc) => set({ mapDescription: desc }),
  addShape: (file, previewUrl) => set((state) => ({ 
      uploadedShapes: [...state.uploadedShapes, { id: crypto.randomUUID(), file, previewUrl }] 
  })),

  addCharacter: (team, char) => set((state) => {
    const newChar = { ...char, stats: { ...char.stats, maxHp: char.stats.hp } }; // Lưu máu gốc
    return team === 'A' ? { teamA: [...state.teamA, newChar] } : { teamB: [...state.teamB, newChar] };
  }),
  
  updateCharacter: (team, id, updatedChar) => set((state) => {
    const newChar = { ...updatedChar, stats: { ...updatedChar.stats, maxHp: updatedChar.stats.hp } };
    if (team === 'A') return { teamA: state.teamA.map(c => c.id === id ? newChar : c) };
    return { teamB: state.teamB.map(c => c.id === id ? newChar : c) };
  }),
  
  removeCharacter: (team, id) => set((state) => {
    if (team === 'A') return { teamA: state.teamA.filter(c => c.id !== id) };
    return { teamB: state.teamB.filter(c => c.id !== id) };
  }),

  setAppStage: (stage) => set({ appStage: stage }),

  placeCharacterOnBoard: (team, charId, x, y) => set((state) => {
    if (team === 'A') return { teamA: state.teamA.map(c => c.id === charId ? { ...c, position: { x, y } } : c) };
    return { teamB: state.teamB.map(c => c.id === charId ? { ...c, position: { x, y } } : c) };
  }),

  setMasterTimeline: (timeline) => set({ Master_Timeline: timeline }),

  // --- PHASE 5 LOGIC ---
  addLiveLog: (log) => set((state) => ({ liveLogs: [...state.liveLogs, log] })),

  setActiveDialogue: (charId, dialogue) => set((state) => {
    if (dialogue === null) {
      const { [charId]: _, ...rest } = state.activeDialogues;
      return { activeDialogues: rest };
    }
    return {
      activeDialogues: { ...state.activeDialogues, [charId]: dialogue }
    };
  }),

  applyDamageById: (id, damage) => set((state) => {
    const updateFn = (c: Character) => {
      if (c.id === id) {
        // Máu không được nhỏ hơn 0. Lưu ý: damage AI gửi về thường là số âm (vd: -50)
        const newHp = Math.max(0, c.stats.hp + damage); 
        return { ...c, stats: { ...c.stats, hp: newHp } };
      }
      return c;
    };
    return { teamA: state.teamA.map(updateFn), teamB: state.teamB.map(updateFn) };
  }),

  moveCharacterById: (id, x, y) => set((state) => {
    const updateFn = (c: Character) => c.id === id ? { ...c, position: { x, y } } : c;
    return { teamA: state.teamA.map(updateFn), teamB: state.teamB.map(updateFn) };
  }),

  setVFXById: (id, vfx) => set((state) => ({
    activeVFX: { ...state.activeVFX, [id]: vfx }
  }))
}))
