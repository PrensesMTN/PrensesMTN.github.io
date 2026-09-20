import React from 'react';
import { 
  Rocket, 
  Sparkles, 
  Coffee, 
  Bath, 
  Zap, 
  PlayCircle, 
  Package, 
  Eye, 
  GraduationCap, 
  DoorOpen 
} from 'lucide-react';
import { HotspotCoordinate } from '../types';
import { ROOMS_DATA } from '../config/roomsData';

interface RoomHotspotsProps {
  hotspots: HotspotCoordinate[];
  selectedRoomKey: string | null;
  onSelectRoom: (key: string) => void;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'shuttle-space': <Rocket className="w-3.5 h-3.5 text-cyan-300" />,
  'diagram-project': <Sparkles className="w-3.5 h-3.5 text-cyan-300" />,
  'mug-hot': <Coffee className="w-3.5 h-3.5 text-cyan-300" />,
  'restroom': <Bath className="w-3.5 h-3.5 text-cyan-300" />,
  'bolt': <Zap className="w-3.5 h-3.5 text-cyan-300" />,
  'circle-play': <PlayCircle className="w-3.5 h-3.5 text-cyan-300" />,
  'boxes-stacked': <Package className="w-3.5 h-3.5 text-cyan-300" />,
  'eye': <Eye className="w-3.5 h-3.5 text-cyan-300" />,
  'graduation-cap': <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
};

export const RoomHotspots: React.FC<RoomHotspotsProps> = ({
  hotspots,
  selectedRoomKey,
  onSelectRoom
}) => {
  return (
    <div id="room-labels-container" className="absolute inset-0 pointer-events-none z-20">
      {hotspots.map((hs) => {
        if (!hs.visible) return null;
        const room = ROOMS_DATA[hs.key];
        if (!room) return null;
        const isSelected = selectedRoomKey === hs.key;

        return (
          <div
            id={`marker-${hs.key}`}
            key={hs.key}
            onClick={() => onSelectRoom(hs.key)}
            style={{
              left: `${hs.x}px`,
              top: `${hs.y}px`
            }}
            className={`room-marker flex items-center gap-2 group cursor-pointer pointer-events-auto transition-transform duration-200 ${
              isSelected ? 'scale-110 z-30' : 'hover:scale-110 z-20'
            }`}
          >
            {/* Hotspot Icon Pin with Pulse Animation */}
            <div
              className={`marker-icon relative w-8 h-8 rounded-full bg-slate-950/90 border flex items-center justify-center text-xs transition duration-300 ${
                isSelected
                  ? 'border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                  : 'border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
              }`}
            >
              {BADGE_ICONS[room.badgeIcon] || <DoorOpen className="w-3.5 h-3.5" />}
              <span
                className={`absolute inset-0 rounded-full border pulse-effect ${
                  isSelected ? 'border-amber-400' : 'border-cyan-400'
                }`}
              />
            </div>

            {/* Title Label */}
            <div
              className={`hud-panel px-2.5 py-1 rounded text-[11px] font-mono font-bold tracking-wider uppercase border transition ${
                isSelected
                  ? 'text-amber-200 border-amber-400/60 bg-amber-950/70 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'text-cyan-200 border-cyan-500/40 opacity-90 group-hover:opacity-100'
              }`}
            >
              {room.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};
