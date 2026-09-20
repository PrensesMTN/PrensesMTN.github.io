/**
 * Synthesizes Sci-Fi sound effects using Web Audio API as specified in TeknoSanat Akademi.
 */
class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.initContext();
      this.playSound('enter');
    }
  }

  public toggle(): boolean {
    const next = !this.isEnabled;
    this.setEnabled(next);
    return next;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public playSound(type: 'click' | 'enter' | 'close' | 'switch') {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'enter') {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'close' || type === 'switch') {
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const audioEngine = new AudioEngine();
