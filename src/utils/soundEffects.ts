// Pure Web Audio API procedural sound synthesizer (Zero external MP3 dependencies)

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  // Dedicated Master Audio Bus for Background Ambient Soundscape
  public isAmbientPlaying: boolean = false;
  private ambientMasterGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private ambientLfo: OscillatorNode | null = null;
  private ambientChimeTimer: ReturnType<typeof setInterval> | null = null;
  private ambientChimeTimeout: ReturnType<typeof setTimeout> | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      // Create permanent master gain for ambient soundscape
      if (!this.ambientMasterGain) {
        this.ambientMasterGain = this.ctx.createGain();
        this.ambientMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientMasterGain.connect(this.ctx.destination);
      }
    }
  }

  // Public method to resume suspended AudioContext on user interaction
  public resumeAudioContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    // Only launch ambient soundscape if it is flagged as active and not muted
    if (this.isAmbientPlaying && this.ambientOscs.length === 0) {
      this.startAmbientSoundscape();
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
  private ambientVolume: number = 0.6; // 0.0 to 1.0

  getAmbientVolume(): number {
    return this.ambientVolume;
  }

  // Real-time volume control directly modulating ambientMasterGain
  setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    this.initCtx();
    if (this.ambientMasterGain && this.ctx) {
      this.ambientMasterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      if (this.isAmbientPlaying) {
        // Soft acoustic scaling (max ceiling 0.08)
        const targetGain = this.ambientVolume * 0.08;
        this.ambientMasterGain.gain.setValueAtTime(this.ambientMasterGain.gain.value, this.ctx.currentTime);
        this.ambientMasterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.04);
      } else {
        this.ambientMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    }
  }

  toggleAmbientSoundscape(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientSoundscape();
      return false;
    } else {
      this.startAmbientSoundscape();
      return true;
    }
  }

  // Soft celestial bell note generator (pentatonic harmony) routed into ambientMasterGain
  private playRandomCelestialChime() {
    if (!this.ctx || !this.isAmbientPlaying || !this.enabled || !this.ambientMasterGain) return;
    try {
      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Delicate sparkle bell envelope
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 3.0);

      osc.connect(gain);
      // Connected to ambientMasterGain so volume slider and mute control it 100%
      gain.connect(this.ambientMasterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.0);
    } catch {
      // ignore
    }
  }

  startAmbientSoundscape() {
    try {
      this.initCtx();
      if (!this.ctx || !this.ambientMasterGain) return;

      this.isAmbientPlaying = true;

      // 1. Smoothly ramp master gain to current user volume
      const targetGain = this.ambientVolume * 0.08;
      this.ambientMasterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientMasterGain.gain.setValueAtTime(this.ambientMasterGain.gain.value, this.ctx.currentTime);
      this.ambientMasterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.8);

      // 2. If oscillators are already active, unmuting the master bus is sufficient
      if (this.ambientOscs.length > 0) {
        if (!this.ambientChimeTimer) {
          this.ambientChimeTimer = setInterval(() => {
            if (Math.random() > 0.2) this.playRandomCelestialChime();
          }, 5000);
        }
        return;
      }

      // 3. Warm buttery lowpass filter - friendly, comforting & relaxing
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(540, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);
      filter.connect(this.ambientMasterGain);
      this.ambientFilter = filter;

      // 4. Uplifting, warm Fmaj9 chord (F3, A3, C4, E4, G4)
      const freqs = [174.61, 220.00, 261.63, 329.63, 392.00];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime((idx - 2) * 2.5, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      // 5. Ultra-slow, peaceful breathing LFO (25-second cycle)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.04, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(75, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      this.ambientOscs = oscs;
      this.ambientLfo = lfo;

      // 6. Celestial chimes
      if (this.ambientChimeTimer) {
        clearInterval(this.ambientChimeTimer);
      }
      this.ambientChimeTimer = setInterval(() => {
        if (Math.random() > 0.2) {
          this.playRandomCelestialChime();
        }
      }, 5000);

      if (this.ambientChimeTimeout) {
        clearTimeout(this.ambientChimeTimeout);
      }
      this.ambientChimeTimeout = setTimeout(() => {
        this.playRandomCelestialChime();
      }, 1000);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  stopAmbientSoundscape() {
    try {
      this.isAmbientPlaying = false;

      // 1. Immediately cancel chime timers
      if (this.ambientChimeTimer) {
        clearInterval(this.ambientChimeTimer);
        this.ambientChimeTimer = null;
      }
      if (this.ambientChimeTimeout) {
        clearTimeout(this.ambientChimeTimeout);
        this.ambientChimeTimeout = null;
      }

      // 2. Immediately ramp master gain down to 0 (50ms clean fade - absolute silence, no clicks)
      if (this.ambientMasterGain && this.ctx) {
        this.ambientMasterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.ambientMasterGain.gain.setValueAtTime(this.ambientMasterGain.gain.value, this.ctx.currentTime);
        this.ambientMasterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
      }

      // 3. Synchronously stop and disconnect all running oscillators
      this.ambientOscs.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch {}
      });
      this.ambientOscs = [];

      if (this.ambientLfo) {
        try {
          this.ambientLfo.stop();
          this.ambientLfo.disconnect();
        } catch {}
        this.ambientLfo = null;
      }

      if (this.ambientFilter) {
        try {
          this.ambientFilter.disconnect();
        } catch {}
        this.ambientFilter = null;
      }
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundManager = new SoundFX();
