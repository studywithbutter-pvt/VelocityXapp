class AudioEngine {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private spaceGain: GainNode | null = null;
  private thunderGain: GainNode | null = null;
  private lofiGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isInitialized = false;
  private lofiInterval: number | null = null;

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Rain channel
    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.rainGain.connect(this.masterGain);
    this.startRainGenerator();

    // Space drone channel
    this.spaceGain = this.ctx.createGain();
    this.spaceGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.spaceGain.connect(this.masterGain);
    this.startSpaceGenerator();

    // Thunder channel
    this.thunderGain = this.ctx.createGain();
    this.thunderGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.thunderGain.connect(this.masterGain);

    // Lofi channel
    this.lofiGain = this.ctx.createGain();
    this.lofiGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.lofiGain.connect(this.masterGain);
    this.startLofiGenerator();

    this.isInitialized = true;
  }

  public ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Pink noise generator for rain
  private startRainGenerator() {
    if (!this.ctx || !this.rainGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for gentle rain sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    whiteNoise.start(0);
  }

  // Space Drone: Low sine + detuned sine + gentle modulation
  private startSpaceGenerator() {
    if (!this.ctx || !this.spaceGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(55.6, this.ctx.currentTime); // Detuned

    sub.type = 'triangle';
    sub.frequency.setValueAtTime(110, this.ctx.currentTime); // A2

    const subFilter = this.ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

    osc1.connect(this.spaceGain);
    osc2.connect(this.spaceGain);
    sub.connect(subFilter);
    subFilter.connect(this.spaceGain);

    osc1.start();
    osc2.start();
    sub.start();
  }

  // Lo-Fi Electric Piano Chords generator
  private startLofiGenerator() {
    if (!this.ctx || !this.lofiGain) return;
    const chords = [
      [220, 261.63, 329.63, 392],     // Am7
      [174.61, 220, 261.63, 329.63],  // Fmaj7
      [261.63, 329.63, 392, 493.88],  // Cmaj7
      [196, 246.94, 293.66, 349.23],  // G7
    ];
    let chordIndex = 0;

    const playChord = () => {
      if (!this.ctx || !this.lofiGain) return;
      if (this.lofiGain.gain.value <= 0.01) return; // Don't compute if muted

      const chord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.lofiGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);

        const noteTime = this.ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.06, noteTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.lofiGain);

        osc.start(noteTime);
        osc.stop(noteTime + 4.0);
      });
    };

    this.lofiInterval = window.setInterval(playChord, 4000);
  }

  public setVolume(channel: 'rain' | 'space' | 'thunder' | 'lofi' | 'master', val: number) {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const clamped = Math.max(0, Math.min(1, val));

    switch (channel) {
      case 'rain':
        this.rainGain?.gain.setTargetAtTime(clamped * 0.4, now, 0.1);
        break;
      case 'space':
        this.spaceGain?.gain.setTargetAtTime(clamped * 0.35, now, 0.1);
        break;
      case 'thunder':
        this.thunderGain?.gain.setTargetAtTime(clamped * 0.5, now, 0.1);
        break;
      case 'lofi':
        this.lofiGain?.gain.setTargetAtTime(clamped * 0.6, now, 0.1);
        break;
      case 'master':
        this.masterGain?.gain.setTargetAtTime(clamped, now, 0.1);
        break;
    }
  }

  // Sound Effects
  public playIgnition() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Low rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 1.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + 1.5);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  public playSuccessChime() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.01, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.4);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.5);
    });
  }

  public playCrashSound() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 1.0);
  }
}

export const audioEngine = new AudioEngine();

