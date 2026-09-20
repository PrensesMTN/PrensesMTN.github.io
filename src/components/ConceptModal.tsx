import React from 'react';
import { X, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface ConceptModalProps {
  isOpen: boolean;
  theme?: ThemeMode;
  onClose: () => void;
  onAlignCamera: () => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  isOpen,
  theme = 'dark',
  onClose,
  onAlignCamera
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md ${
      isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'
    }`}>
      <div 
        className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl border p-4 sm:p-6 flex flex-col gap-4 font-mono shadow-2xl ${
          isLight 
            ? 'border-slate-300 bg-white text-slate-800' 
            : 'border-cyan-500/40 bg-slate-900/95 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-cyan-500/30'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className={`font-orbitron font-bold text-base sm:text-lg ${
              isLight ? 'text-cyan-900' : 'text-cyan-300'
            }`}>
              ORİJİNAL KONSEPT GEMİ GİYDİRMESİ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isLight 
                ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-600' 
                : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Showcase - Clean Transparent Visual without black wall box */}
        <div className={`relative rounded-lg overflow-hidden border p-4 sm:p-6 flex items-center justify-center shadow-inner transition-colors ${
          isLight
            ? 'border-cyan-200 bg-gradient-to-b from-slate-100 to-slate-200/80'
            : 'border-cyan-500/30 bg-gradient-to-b from-slate-900/60 to-slate-950/95'
        }`}>
          <img
            src="/mothership_concept_nobg.png"
            alt="Mothership Reference Concept"
            className="w-full max-h-[48vh] object-contain drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
          />
          <div className={`absolute top-2 left-2 px-2.5 py-1 rounded border text-[11px] font-mono ${
            isLight
              ? 'bg-white/90 border-cyan-400 text-cyan-800 shadow-sm'
              : 'bg-slate-950/80 border-cyan-500/50 text-cyan-300'
          }`}>
            ORİJİNAL ÇİZİM (ARKA PLANI TEMİZLENMİŞ)
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className={`p-2.5 rounded border flex flex-col gap-1 ${
            isLight ? 'border-cyan-200 bg-cyan-50/60' : 'border-cyan-500/20 bg-cyan-950/20'
          }`}>
            <div className={`flex items-center gap-1.5 font-bold ${
              isLight ? 'text-cyan-800' : 'text-cyan-300'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
              1. Bilişsel Çekirdek (Pruva)
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Saydam cam kubbe içinde parlayan lümisens 3D beyin, sinaps kıvılcımları ve çift renkli nöral hatlar.
            </p>
          </div>

          <div className={`p-2.5 rounded border flex flex-col gap-1 ${
            isLight ? 'border-amber-200 bg-amber-50/60' : 'border-amber-500/20 bg-amber-950/20'
          }`}>
            <div className={`flex items-center gap-1.5 font-bold ${
              isLight ? 'text-amber-800' : 'text-amber-300'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              2. Gözlem Katı & Refakatçi
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Sıcak amber ışıklı iç güverte pencereleri ve geminin altında bağımsız süzülen keşif mekiği.
            </p>
          </div>

          <div className={`p-2.5 rounded border flex flex-col gap-1 ${
            isLight ? 'border-emerald-200 bg-emerald-50/60' : 'border-emerald-500/20 bg-emerald-950/20'
          }`}>
            <div className={`flex items-center gap-1.5 font-bold ${
              isLight ? 'text-emerald-800' : 'text-emerald-300'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
              3. Biyosfer Kubbesi (Pupa)
            </div>
            <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Kavisli sütunlar üstünde yükselen botanik şemsiye kubbe, canlı ağaçlar ve sera fanusları.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className={`flex items-center justify-between border-t pt-3 text-xs ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            3D sahnede geminin her iki gövdesi bu dokuyla kaplanmıştır.
          </span>
          <button
            type="button"
            onClick={() => {
              onAlignCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Compass className="w-4 h-4" />
            3D KONSEPT PROFİLİNE ODAKLAN
          </button>
        </div>
      </div>
    </div>
  );
};
