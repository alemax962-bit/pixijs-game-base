/**
 * Lightweight Web Audio wrapper for SFX and looping music.
 * Generated clips from Tango live under public/assets/audio/.
 */
export class AudioSystem {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private musicSource: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  async unlock(): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  async load(key: string, url: string): Promise<void> {
    const ctx = this.ensureContext();
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const buffer = await ctx.decodeAudioData(data);
    this.buffers.set(key, buffer);
  }

  play(key: string, options: { volume?: number; loop?: boolean } = {}): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    const buffer = this.buffers.get(key);
    if (!buffer || !this.masterGain) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop ?? false;

    const gain = ctx.createGain();
    gain.gain.value = options.volume ?? 1;
    source.connect(gain);
    gain.connect(this.masterGain);
    source.start(0);

    if (options.loop) {
      this.stopMusic();
      this.musicSource = source;
    }
  }

  stopMusic(): void {
    try {
      this.musicSource?.stop();
    } catch {
      /* already stopped */
    }
    this.musicSource = null;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  destroy(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
    this.buffers.clear();
  }
}
