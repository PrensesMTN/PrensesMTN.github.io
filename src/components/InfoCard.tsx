import React from 'react';
import { 
  X, 
  DoorOpen, 
  ChevronRight, 
  Info, 
  Cpu, 
  Camera, 
  Glasses,
  Rocket,
  Sparkles,
  Coffee,
  Bath,
  Zap,
  PlayCircle,
  Package,
  Eye,
  GraduationCap
} from 'lucide-react';
import { RoomData, ThemeMode } from '../types';

interface InfoCardProps {
  room: RoomData;
  theme?: ThemeMode;
  onClose: () => void;
  onEnterInterior: () => void;
  onSelectConnectedDoor?: (doorName: string) => void;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'shuttle-space': <Rocket className="w-5 h-5 text-cyan-500" />,
  'diagram-project': <Sparkles className="w-5 h-5 text-cyan-500" />,
  'mug-hot': <Coffee className="w-5 h-5 text-cyan-500" />,
  'restroom': <Bath className="w-5 h-5 text-cyan-500" />,
  'bolt': <Zap className="w-5 h-5 text-cyan-500" />,
  'circle-play': <PlayCircle className="w-5 h-5 text-cyan-500" />,
  'boxes-stacked': <Package className="w-5 h-5 text-cyan-500" />,
  'eye': <Eye className="w-5 h-5 text-cyan-500" />,
  'graduation-cap': <GraduationCap className="w-5 h-5 text-cyan-500" />
};

export const InfoCard: React.FC<InfoCardProps> = ({
  room,
  theme = 'dark',
  onClose,
  onEnterInterior
}) => {
  const isLight = theme === 'light';

  return (
    <aside 
      id="infoPanel" 
      className="w-80 sm:w-96 max-h-[85vh] hud-panel p-4 sm:p-5 rounded-xl flex flex-col sci-fi-corners shadow-2xl pointer-events-auto overflow-hidden animate-in fade-in slide-in-from-right duration-300"
    >
      {/* Header */}
      <div className={`flex items-start justify-between pb-3 border-b ${
        isLight ? 'border-slate-200' : 'border-cyan-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div 
            id="infoBadge" 
            className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
              isLight 
                ? 'bg-cyan-50 border-cyan-300 text-cyan-700 shadow-sm' 
                : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
            }`}
          >
            {BADGE_ICONS[room.badgeIcon] || <DoorOpen className="w-5 h-5 text-cyan-500" />}
          </div>
          <div>
            <h2 id="infoTitle" className={`font-orbitron font-bold text-base sm:text-lg tracking-wide ${
              isLight ? 'text-cyan-900' : 'text-cyan-300'
            }`}>
              {room.title}
            </h2>
            <span id="infoSubTitle" className={`text-xs font-mono uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {room.subtitle}
            </span>
          </div>
        </div>
        <button 
          id="closeInfoBtn"
          type="button" 
          onClick={onClose} 
          className={`text-lg transition p-1 cursor-pointer ${
            isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-cyan-400'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className={`flex-1 overflow-y-auto my-3 pr-1 space-y-4 text-xs font-sans ${
        isLight ? 'text-slate-700' : 'text-slate-300'
      }`}>
        {/* Top 3-Stat Matrix */}
        <div className={`grid grid-cols-3 gap-2 font-mono text-[10px] p-2.5 rounded border text-center ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-cyan-500/20'
        }`}>
          <div>
            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>OKSİJEN</div>
            <div className="text-emerald-500 font-bold">%99.9</div>
          </div>
          <div>
            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>GÜÇ</div>
            <div className={isLight ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-bold'}>240 KW</div>
          </div>
          <div>
            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>KAPASİTE</div>
            <div id="infoCapacity" className="text-amber-500 font-bold">
              {room.capacity}
            </div>
          </div>
        </div>

        {/* Sector Description */}
        <div>
          <h3 className={`font-mono font-semibold mb-1 uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? 'text-cyan-800' : 'text-cyan-400'
          }`}>
            <Info className="w-3.5 h-3.5" />
            <span>Sektör Tanımı</span>
          </h3>
          <p id="infoDescription" className={`leading-relaxed p-3 rounded border ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
          }`}>
            {room.desc}
          </p>
        </div>

        {/* Connected Doors */}
        <div>
          <h3 className={`font-mono font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? 'text-cyan-800' : 'text-cyan-400'
          }`}>
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Bağlantılı Kapı Geçişleri (=)</span>
          </h3>
          <div id="infoDoors" className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {(room.doors && room.doors.length > 0 ? room.doors : ['Üst Koridor (=)']).map((door, idx) => (
              <span 
                key={idx} 
                className={`px-2 py-1 rounded border flex items-center gap-1 ${
                  isLight 
                    ? 'bg-amber-50 border-amber-300 text-amber-800' 
                    : 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                }`}
              >
                <DoorOpen className="w-3 h-3 text-amber-500" />
                <span>{door}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hardware Features */}
        <div>
          <h3 className={`font-mono font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? 'text-cyan-800' : 'text-cyan-400'
          }`}>
            <Cpu className="w-3.5 h-3.5" />
            <span>Donanım Özellikleri</span>
          </h3>
          <div id="infoFeatures" className="grid grid-cols-2 gap-2 font-mono">
            {room.features.map((feat, idx) => (
              <div 
                key={idx} 
                className={`px-2.5 py-1.5 rounded border text-[11px] flex items-center gap-1.5 ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-700' 
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <ChevronRight className={`w-3 h-3 shrink-0 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Sector View Simulation Image */}
        <div>
          <h3 className={`font-mono font-semibold mb-1.5 uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? 'text-cyan-800' : 'text-cyan-400'
          }`}>
            <Camera className="w-3.5 h-3.5" />
            <span>Canlı Sektör Görünümü</span>
          </h3>
          <div className={`relative w-full h-32 rounded border overflow-hidden bg-slate-950 flex items-center justify-center group ${
            isLight ? 'border-slate-300' : 'border-cyan-500/30'
          }`}>
            <img 
              id="infoImage" 
              src={room.img} 
              alt={room.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-mono text-white flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>SİMÜLASYON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enter 3D Interior Button */}
      <div className={`pt-3 border-t ${
        isLight ? 'border-slate-200' : 'border-cyan-500/30'
      }`}>
        <button
          id="btnEnterInterior"
          type="button"
          onClick={onEnterInterior}
          className="w-full py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-bold text-xs tracking-wider shadow-[0_0_18px_rgba(6,182,212,0.4)] transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Glasses className="w-4 h-4" />
          <span>3D İÇ MEKANA GİR (360° İNCELE)</span>
        </button>
      </div>
    </aside>
  );
};
