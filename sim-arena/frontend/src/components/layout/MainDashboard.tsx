import TeamAColumn from '../teams/TeamAColumn';
import TeamBColumn from '../teams/TeamBColumn';
import AssetUploader from '../center/AssetUploader';
import MapUploader from '../center/MapUploader';
import StartButton from '../center/StartButton';
import { useMainStore } from '../../store/useMainStore';

export default function MainDashboard() {
  const { mapPreviewUrl } = useMainStore();

  return (
    <div className="w-full h-screen grid grid-cols-12 bg-gray-950 text-white overflow-hidden">
      
      {/* CỘT TRÁI - ĐỘI A */}
      <div className="col-span-3 border-r border-gray-800 p-4 bg-gray-900 shadow-xl z-20">
        <TeamAColumn />
      </div>

      {/* KHU VỰC TRUNG TÂM */}
      <div className="col-span-6 relative flex flex-col p-8">
        {/* Hình nền mờ dựa trên ảnh Map */}
        {mapPreviewUrl && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${mapPreviewUrl})` }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-wider relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 drop-shadow-sm">
          SIM-ARENA STUDIO
        </h1>

        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full gap-6">
          <AssetUploader />
          <MapUploader />
          <StartButton />
        </div>
      </div>

      {/* CỘT PHẢI - ĐỘI B */}
      <div className="col-span-3 border-l border-gray-800 p-4 bg-gray-900 shadow-xl z-20">
        <TeamBColumn />
      </div>

    </div>
  );
}