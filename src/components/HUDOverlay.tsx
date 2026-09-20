import React from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Crosshair, 
  Eye, 
  Camera, 
  Image as ImageIcon,
  Sun,
  Moon
} from 'lucide-react';
import { RenderMode, ThemeMode } from '../types';

interface HUDOverlayProps {
  renderMode: RenderMode;
  theme: ThemeMode;
  onToggleTheme: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onResetCamera: () => void;
  onConceptView?: () => void;
  onOpenConceptModal?: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  renderMode,
  theme,
  onToggleTheme,
  audioEnabled,
  onToggleAudio,
  onResetCamera,
  onConceptView,
  onOpenConceptModal
}) => {
  const isLight = theme === 'light';

  return (
    <header className={`relative z-20 flex flex-wrap justify-between items-center px-4 sm:px-6 py-2.5 sm:py-3 border-b backdrop-blur-md transition-colors duration-300 ${
      isLight 
        ? 'border-slate-300 bg-white/90 text-slate-800 shadow-sm' 
        : 'border-cyan-500/30 bg-slate-950/85 text-slate-100 shadow-lg'
    }`}>
      {/* Brand & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border transition-all ${
          isLight
            ? 'border-cyan-600 bg-cyan-50 text-cyan-600 shadow-[0_0_12px_rgba(8,145,178,0.2)]'
            : 'border-cyan-400 bg-cyan-950/60 text-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.5)]'
        }`}>
          <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className={`font-orbitron font-black text-base sm:text-lg md:text-xl tracking-wider uppercase flex flex-wrap items-center gap-2 ${
            isLight ? 'text-cyan-800' : 'text-cyan-400'
          }`}>
            TEKNOSANAT AKADEMİ{' '}
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono ${
              isLight 
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' 
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
            }`}>
              3D UZAY GEMİSİ KAMPÜSÜ
            </span>
          </h1>
          <p className={`text-[10px] sm:text-xs tracking-widest font-mono ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            BİLİŞSEL ÇEKİRDEK & BİYOSFER GÖVDE SİMÜLASYONU
          </p>
        </div>
      </div>

      {/* Center Telemetry Status */}
      <div className={`hidden lg:flex items-center gap-6 text-xs font-mono border-x px-6 ${
        isLight ? 'border-slate-300' : 'border-cyan-500/20'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>İON İTKİ & BİYOSFER:</span>
          <span className="text-emerald-500 font-bold">%100 AKTİF</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
          <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>GÖRÜNÜM:</span>
          <span className={`font-bold uppercase ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
            {renderMode === 'blueprint' ? 'MİMARİ BLUEPRINT' : '3D KONSEPT GÖVDE (GLTF PBR)'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 mt-2 sm:mt-0">
        {/* Theme Toggle Button */}
        <button
          id="toggleThemeBtn"
          type="button"
          onClick={onToggleTheme}
          className={`px-3 py-1.5 rounded border text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
            isLight
              ? 'border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 shadow-sm'
              : 'border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
          }`}
          title={isLight ? 'Karanlık uzay temasına geç' : 'Aydınlık tersane temasına geç'}
        >
          {isLight ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-600" />
              <span>TEMA: LIGHT</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>TEMA: DARK</span>
            </>
          )}
        </button>

        {onOpenConceptModal && (
          <button
            id="openConceptModalBtn"
            type="button"
            onClick={onOpenConceptModal}
            className={`px-3 py-1.5 rounded border text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                : 'border-cyan-400/50 bg-cyan-950/50 hover:bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
            }`}
            title="Orijinal konsept çizimini ve sektör detaylarını incele"
          >
            <ImageIcon className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
            <span className="hidden md:inline">KONSEPT</span> GÖRSEL
          </button>
        )}

        {onConceptView && (
          <button
            id="conceptViewBtn"
            type="button"
            onClick={onConceptView}
            className={`px-3 py-1.5 rounded border text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
              isLight
                ? 'border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800'
                : 'border-amber-500/40 bg-amber-950/40 hover:bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            }`}
            title="Referans çizimindeki profil açısına odaklan"
          >
            <Camera className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">KONSEPT</span> PROFİL
          </button>
        )}

        <button
          id="toggleAudioBtn"
          type="button"
          onClick={onToggleAudio}
          className={`px-3 py-1.5 rounded border text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
            isLight
              ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300'
          }`}
        >
          {audioEnabled ? (
            <>
              <Volume2 className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
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
          className={`px-3 py-1.5 rounded border text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
            isLight
              ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>GEMİYE ODAKLAN</span>
        </button>
      </div>
    </header>
  );
};
