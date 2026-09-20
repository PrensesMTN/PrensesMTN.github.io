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
  GraduationCap,
  Layers
} from 'lucide-react';
import { ROOMS_DATA } from '../config/roomsData';
import { RenderMode, ThemeMode } from '../types';

interface NavigationProps {
  renderMode: RenderMode;
  theme?: ThemeMode;
  onSetRenderMode: (mode: RenderMode) => void;
  selectedRoomKey: string | null;
  onSelectRoom: (key: string) => void;
  conceptOverlayEnabled?: boolean;
  onToggleConceptOverlay?: () => void;
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
  theme = 'dark',
  onSetRenderMode,
  selectedRoomKey,
  onSelectRoom,
  conceptOverlayEnabled = true,
  onToggleConceptOverlay
}) => {
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col gap-3 w-56">
      {/* Render Mode Switcher Panel */}
      <div className="hud-panel p-2.5 rounded-lg sci-fi-corners flex flex-col gap-2">
        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border-b ${
          isLight ? 'text-cyan-800 border-cyan-200' : 'text-cyan-400 border-cyan-500/20'
        }`}>
          Gövde ve Blueprint Modu
        </span>

        <button
          id="btnModeBlueprint"
          type="button"
          onClick={() => onSetRenderMode('blueprint')}
          className={`w-full text-left px-3 py-2 rounded text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
            renderMode === 'blueprint'
              ? isLight
                ? 'bg-cyan-100 border border-cyan-500 text-cyan-900 shadow-sm'
                : 'bg-cyan-500/25 border border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : isLight
                ? 'hover:bg-slate-100 text-slate-600 hover:text-cyan-800'
                : 'hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Compass className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
            <span>BLUEPRINT (MİMARİ)</span>
          </span>
          {renderMode === 'blueprint' && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />}
        </button>

        <button
          id="btnMode3D"
          type="button"
          onClick={() => onSetRenderMode('3d')}
          className={`w-full text-left px-3 py-2 rounded text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
            renderMode === '3d'
              ? isLight
                ? 'bg-cyan-100 border border-cyan-500 text-cyan-900 shadow-sm'
                : 'bg-cyan-500/25 border border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : isLight
                ? 'hover:bg-slate-100 text-slate-600 hover:text-cyan-800'
                : 'hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Rocket className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
            <span>GERÇEKÇİ 3D GÖVDE</span>
          </span>
          {renderMode === '3d' && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />}
        </button>

        {/* Concept Overlay Toggle */}
        {renderMode === '3d' && onToggleConceptOverlay && (
          <button
            id="btnToggleConceptOverlay"
            type="button"
            onClick={onToggleConceptOverlay}
            className={`w-full text-left px-2.5 py-1.5 rounded text-[10px] font-mono transition flex items-center justify-between cursor-pointer border ${
              conceptOverlayEnabled
                ? isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                  : 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : isLight
                  ? 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <Layers className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">Çizim Katmanı (Transparan)</span>
            </span>
            <span className="font-bold text-[9px] shrink-0">
              {conceptOverlayEnabled ? 'AÇIK' : 'KAPALI'}
            </span>
          </button>
        )}
      </div>

      {/* Room Navigation Shortcut List */}
      <div className="hud-panel p-3 rounded-lg sci-fi-corners flex flex-col gap-2 max-h-80 overflow-y-auto">
        <span className={`text-[10px] font-mono uppercase tracking-widest pb-1 border-b ${
          isLight ? 'text-cyan-800 border-cyan-200' : 'text-cyan-400 border-cyan-500/20'
        }`}>
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
                    ? isLight
                      ? 'bg-cyan-100 text-cyan-900 border-cyan-400 font-bold shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : isLight
                      ? 'border-transparent hover:bg-slate-100 text-slate-600 hover:text-cyan-800'
                      : 'border-transparent hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30'
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <span className={`text-[10px] ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                    {BADGE_ICONS[room.badgeIcon] || <Compass className="w-3 h-3" />}
                  </span>
                  <span className="truncate">{room.title}</span>
                </span>
                <ChevronRight className={`w-3 h-3 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
