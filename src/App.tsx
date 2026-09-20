import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Mouse, Move, ZoomIn } from 'lucide-react';
import { Engine } from './core/Engine';
import { HUDOverlay } from './components/HUDOverlay';
import { Navigation } from './components/Navigation';
import { InfoCard } from './components/InfoCard';
import { RoomHotspots } from './components/RoomHotspots';
import { ROOMS_DATA } from './config/roomsData';
import { HotspotCoordinate, RenderMode } from './types';
import { audioEngine } from './utils/AudioEngine';

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);

  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const [renderMode, setRenderModeState] = useState<RenderMode>('3d');
  const [isInteriorView, setIsInteriorView] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [hotspots, setHotspots] = useState<HotspotCoordinate[]>([]);

  // Room selection handler
  const handleSelectRoom = useCallback((key: string) => {
    setSelectedRoomKey(key);
    audioEngine.playSound('click');
    if (engineRef.current) {
      engineRef.current.selectRoom(key);
    }
  }, []);

  // Initialize Three.js Engine
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const engine = new Engine(canvasContainerRef.current, {
      onRoomSelect: (key: string) => {
        handleSelectRoom(key);
      },
      onHotspotsUpdate: (coords: HotspotCoordinate[]) => {
        setHotspots(coords);
      }
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleSelectRoom]);

  // Close Info Card
  const handleCloseInfo = () => {
    audioEngine.playSound('close');
    setSelectedRoomKey(null);
    if (engineRef.current) {
      engineRef.current.selectRoom(null);
    }
  };

  // Switch Render Mode (Blueprint vs 3D)
  const handleSetRenderMode = (mode: RenderMode) => {
    audioEngine.playSound('switch');
    setRenderModeState(mode);
    if (engineRef.current) {
      engineRef.current.setRenderMode(mode);
    }
  };

  // Enter 3D Room Interior
  const handleEnterInterior = () => {
    if (!selectedRoomKey) return;
    audioEngine.playSound('enter');
    setIsInteriorView(true);
    if (engineRef.current) {
      engineRef.current.enterRoomInterior(selectedRoomKey);
    }
  };

  // Exit 3D Room Interior
  const handleExitInterior = () => {
    audioEngine.playSound('close');
    setIsInteriorView(false);
    if (engineRef.current) {
      engineRef.current.exitRoomInterior();
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    audioEngine.playSound('click');
    if (engineRef.current) {
      engineRef.current.resetCameraView();
    }
  };

  // Concept View Camera
  const handleConceptView = () => {
    audioEngine.playSound('click');
    if (engineRef.current) {
      engineRef.current.setConceptProfileView();
    }
  };

  // Audio Toggle
  const handleToggleAudio = () => {
    const nextState = audioEngine.toggle();
    setAudioEnabled(nextState);
  };

  const selectedRoom = selectedRoomKey ? ROOMS_DATA[selectedRoomKey] : null;

  return (
    <div className="bg-sci-fi-grid h-screen w-screen flex flex-col overflow-hidden text-slate-100 select-none">
      {/* Holographic CRT Effect */}
      <div className="scanlines absolute inset-0 z-10 pointer-events-none" />

      {/* Header Navbar */}
      <HUDOverlay
        renderMode={renderMode}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        onResetCamera={handleResetCamera}
        onConceptView={handleConceptView}
      />

      {/* Main Interactive Stage */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* WebGL Canvas */}
        <div
          ref={canvasContainerRef}
          id="canvas-container"
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Dynamic Floating Labels Container */}
        {!isInteriorView && (
          <RoomHotspots
            hotspots={hotspots}
            selectedRoomKey={selectedRoomKey}
            onSelectRoom={handleSelectRoom}
          />
        )}

        {/* Left Controls & Sector List */}
        {!isInteriorView && (
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex flex-col gap-3 pointer-events-auto">
            <Navigation
              renderMode={renderMode}
              onSetRenderMode={handleSetRenderMode}
              selectedRoomKey={selectedRoomKey}
              onSelectRoom={handleSelectRoom}
            />
          </div>
        )}

        {/* Right HUD Panel - Room Details */}
        {selectedRoom && !isInteriorView && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bottom-4 sm:bottom-6 z-30 pointer-events-auto">
            <InfoCard
              room={selectedRoom}
              onClose={handleCloseInfo}
              onEnterInterior={handleEnterInterior}
            />
          </div>
        )}

        {/* Exit Interior HUD Button */}
        {isInteriorView && (
          <div
            id="exitInteriorHud"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition duration-300 pointer-events-auto animate-in fade-in"
          >
            <button
              id="exitInteriorBtn"
              type="button"
              onClick={handleExitInterior}
              className="px-6 py-3 rounded-full hud-panel-amber text-amber-300 font-orbitron font-bold text-xs tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:bg-amber-500/20 transition flex items-center gap-3 border border-amber-400 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>DIŞ GÖRÜNÜME DÖN (UZAY GEMİSİ)</span>
            </button>
          </div>
        )}

        {/* Footer HUD Controls Help */}
        <div className="absolute bottom-3 left-4 sm:left-6 z-20 text-[11px] font-mono text-slate-400 flex items-center gap-3 sm:gap-4 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800 pointer-events-none">
          <div className="flex items-center gap-1">
            <Mouse className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sol Tık: Görüşü Döndür</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sağ Tık: Pan / Kaydır</span>
          </div>
          <div className="flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tekerlek: Yakınlaştır</span>
          </div>
        </div>
      </div>
    </div>
  );
}
