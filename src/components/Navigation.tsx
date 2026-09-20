import React from 'react';
import { 
  Compass, 
  Rocket, 
  Check, 
  ChevronRight,
  Sparkles,
  Coffee,
  Bath,
  Zap,
  PlayCircle,
  Package,
  Eye,
  GraduationCap
} from 'lucide-react';
import { ROOMS_DATA } from '../config/roomsData';
import { RenderMode } from '../types';

interface NavigationProps {
  renderMode: RenderMode;
  onSetRenderMode: (mode: RenderMode) => void;
  selectedRoomKey: string | null;
  onSelectRoom: (key: string) => void;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'shuttle-space': <Rocket className="w-3.5 h-3.5" />,
  'diagram-project': <Sparkles className="w-3.5 h-3.5" />,
  'mug-hot': <Coffee className="w-3.5 h-3.5" />,
  'restroom': <Bath className="w-3.5 h-3.5" />,
  'bolt': <Zap className="w-3.5 h-3.5" />,
  'circle-play': <PlayCircle className="w-3.5 h-3.5" />,
  'boxes-stacked': <Package className="w-3.5 h-3.5" />,
  'eye': <Eye className="w-3.5 h-3.5" />,
  'graduation-cap': <GraduationCap className="w-3.5 h-3.5" />
};

export const Navigation: React.FC<NavigationProps> = ({
  renderMode,
  onSetRenderMode,
  selectedRoomKey,
  onSelectRoom
}) => {
  return (
    <div className="flex flex-col gap-3 w-56">
      {/* Render Mode Switcher Panel */}
      <div className="hud-panel p-2.5 rounded-lg sci-fi-corners flex flex-col gap-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2 py-0.5 border-b border-cyan-500/20">
          Gövde ve Blueprint Modu
        </span>

        <button
          id="btnModeBlueprint"
          type="button"
          onClick={() => onSetRenderMode('blueprint')}
          className={`w-full text-left px-3 py-2 rounded text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
            renderMode === 'blueprint'
              ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : 'hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>BLUEPRINT (MİMARİ)</span>
          </span>
          {renderMode === 'blueprint' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        <button
          id="btnMode3D"
          type="button"
          onClick={() => onSetRenderMode('3d')}
          className={`w-full text-left px-3 py-2 rounded text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
            renderMode === '3d'
              ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : 'hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>GERÇEKÇİ 3D GÖVDE</span>
          </span>
          {renderMode === '3d' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
        </button>
      </div>

      {/* Room Navigation Shortcut List */}
      <div className="hud-panel p-3 rounded-lg sci-fi-corners flex flex-col gap-2 max-h-80 overflow-y-auto">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest pb-1 border-b border-cyan-500/20">
          Gemi Sektörleri (Kroki)
        </span>
        <div id="quickNavList" className="flex flex-col gap-1 text-xs font-mono">
          {Object.keys(ROOMS_DATA).map((key) => {
            const room = ROOMS_DATA[key];
            const isSelected = selectedRoomKey === key;
            return (
              <button
                id={`quick-nav-${key}`}
                key={key}
                type="button"
                onClick={() => onSelectRoom(key)}
                className={`text-left px-2 py-1.5 rounded transition flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'border-transparent hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <span className="text-cyan-400 text-[10px]">
                    {BADGE_ICONS[room.badgeIcon] || <Compass className="w-3 h-3" />}
                  </span>
                  <span className="truncate">{room.title}</span>
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
