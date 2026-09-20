import React from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Crosshair, 
  Eye,
  Camera
} from 'lucide-react';
import { RenderMode } from '../types';

interface HUDOverlayProps {
  renderMode: RenderMode;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onResetCamera: () => void;
  onConceptView?: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  renderMode,
  audioEnabled,
  onToggleAudio,
  onResetCamera,
  onConceptView
}) => {
  return (
    <header className="relative z-20 flex flex-wrap justify-between items-center px-4 sm:px-6 py-2.5 sm:py-3 border-b border-cyan-500/30 bg-slate-950/85 backdrop-blur-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-cyan-400 bg-cyan-950/60 text-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.5)]">
          <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="font-orbitron font-black text-base sm:text-lg md:text-xl tracking-wider text-cyan-400 uppercase flex flex-wrap items-center gap-2">
            TEKNOSANAT AKADEMİ{' '}
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono">
              3D UZAY GEMİSİ KAMPÜSÜ
            </span>
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 tracking-widest font-mono">
            BİLİŞSEL ÇEKİRDEK & BİYOSFER GÖVDE SİMÜLASYONU
          </p>
        </div>
      </div>

      {/* Center Telemetry Status */}
      <div className="hidden lg:flex items-center gap-6 text-xs font-mono border-x border-cyan-500/20 px-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400">İON İTKİ & BİYOSFER:</span>
          <span className="text-emerald-400 font-bold">%100 AKTİF</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">GÖRÜNÜM:</span>
          <span className="text-cyan-400 font-bold uppercase">
            {renderMode === 'blueprint' ? 'MİMARİ BLUEPRINT (TEL KAFES)' : '3D KONSEPT GÖVDE (GERÇEKÇİ)'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
        {onConceptView && (
          <button
            id="conceptViewBtn"
            type="button"
            onClick={onConceptView}
            className="px-3 py-1.5 rounded border border-amber-500/40 bg-amber-950/40 hover:bg-amber-500/20 text-amber-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            title="Referans çizimindeki profil açısına odaklan"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">KONSEPT</span> PROFİL
          </button>
        )}

        <button
          id="toggleAudioBtn"
          type="button"
          onClick={onToggleAudio}
          className="px-3 py-1.5 rounded border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition flex items-center gap-2 cursor-pointer"
        >
          {audioEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>SES: AÇIK</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>SES: KAPALI</span>
            </>
          )}
        </button>

        <button
          id="resetCameraBtn"
          type="button"
          onClick={onResetCamera}
          className="px-3 py-1.5 rounded border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition flex items-center gap-2 cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>GEMİYE ODAKLAN</span>
        </button>
      </div>
    </header>
  );
};
