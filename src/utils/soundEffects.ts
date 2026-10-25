// Pure Web Audio API procedural sound synthesizer (Zero external MP3 dependencies)

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  // Ambient soundscape nodes
  public isAmbientPlaying: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientLfo: OscillatorNode | null = null;
  private ambientChimeTimer: ReturnType<typeof setInterval> | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Public method to resume suspended AudioContext on user interaction
  public resumeAudioContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Soft high-tech hover tick
  playHover() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio might be blocked before first user gesture
    }
  }

  // Futuristic click chirp
  playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Ignore
    }
  }

  // Achievement / Level up chime
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } catch {
      // Ignore
    }
  }

  // Sci-fi warp sound
  playWarp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  // Proximity hazard danger alarm
  playDangerAlarm() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Ignore
    }
  }

  // Ambient Warm Cosmic Soundscape (Procedural Soft Harmonic Pad + Ethereal Bells)
  toggleAmbientSoundscape(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientSoundscape();
      return false;
    } else {
      this.startAmbientSoundscape();
      return true;
    }
  }

  // Soft celestial bell note generator (pentatonic harmony)
  private playRandomCelestialChime() {
    if (!this.ctx || !this.isAmbientPlaying || !this.enabled) return;
    try {
      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Delicate sparkle bell envelope
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.012, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 3.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.2);
    } catch {
      // ignore
    }
  }

  startAmbientSoundscape() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.stopAmbientSoundscape();

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      // Smooth warm fade-in over 2.5 seconds
      masterGain.gain.exponentialRampToValueAtTime(0.038, this.ctx.currentTime + 2.5);

      // Warm buttery lowpass filter - no harsh resonance, soothing cutoff
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(540, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime); // Gentle natural roll-off

      // Uplifting, warm Fmaj9 chord (F3, A3, C4, E4, G4) - friendly, relaxing & comforting
      const freqs = [174.61, 220.00, 261.63, 329.63, 392.00];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Very subtle micro-detune for gentle acoustic warmth
        osc.detune.setValueAtTime((idx - 2) * 2.5, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      // Ultra-slow, peaceful breathing LFO (25-second cycle)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.04, this.ctx.currentTime); // 25s breathing wave
      lfoGain.gain.setValueAtTime(75, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      this.ambientGain = masterGain;
      this.ambientOscs = oscs;
      this.ambientLfo = lfo;
      this.isAmbientPlaying = true;

      // Start friendly celestial chimes every ~5.5 seconds
      this.ambientChimeTimer = setInterval(() => {
        if (Math.random() > 0.15) {
          this.playRandomCelestialChime();
        }
      }, 5500);

      // Play first gentle chime after short delay
      setTimeout(() => this.playRandomCelestialChime(), 1200);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  stopAmbientSoundscape() {
    try {
      if (this.ambientChimeTimer) {
        clearInterval(this.ambientChimeTimer);
        this.ambientChimeTimer = null;
      }
      if (this.ambientGain && this.ctx) {
        // Smooth fade-out over 0.8 seconds
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.ambientOscs.forEach((o) => {
            try { o.stop(); } catch {}
          });
          if (this.ambientLfo) {
            try { this.ambientLfo.stop(); } catch {}
          }
          this.ambientOscs = [];
          this.ambientLfo = null;
          this.ambientGain = null;
        }, 850);
      }
      this.isAmbientPlaying = false;
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundManager = new SoundFX();
