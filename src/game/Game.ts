import { Application } from 'pixi.js';
import { SceneManager } from './SceneManager';
import { InputSystem } from './systems/InputSystem';
import { AudioSystem } from './systems/AudioSystem';
import { AssetSystem } from './systems/AssetSystem';

export interface GameOptions {
  canvas: HTMLCanvasElement;
  background?: string;
  antialias?: boolean;
  resolution?: number;
  /** Fixed design size. Omit for fullscreen resize. */
  width?: number;
  height?: number;
}

/**
 * Thin runtime shell: owns the Pixi Application and shared systems.
 * Genre-specific logic lives in Scenes / Entities, not here.
 */
export class Game {
  readonly app: Application;
  readonly scenes: SceneManager;
  readonly input: InputSystem;
  readonly audio: AudioSystem;
  readonly assets: AssetSystem;

  private readonly options: GameOptions;
  private running = false;
  private lastTime = 0;
  private resizeObserver?: ResizeObserver;

  constructor(options: GameOptions) {
    this.options = options;
    this.app = new Application();
    this.scenes = new SceneManager(this);
    this.input = new InputSystem();
    this.audio = new AudioSystem();
    this.assets = new AssetSystem();
  }

  get width(): number {
    return this.app.screen.width;
  }

  get height(): number {
    return this.app.screen.height;
  }

  async init(): Promise<void> {
    const { canvas, background = '#000000', antialias = true, resolution = 1, width, height } =
      this.options;

    await this.app.init({
      canvas,
      background,
      antialias,
      resolution,
      autoDensity: true,
      preference: 'webgl',
      resizeTo: width && height ? undefined : window,
      width: width ?? window.innerWidth,
      height: height ?? window.innerHeight,
    });

    this.input.attach(canvas);
    this.bindResize();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.app.ticker.add(this.tick);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.app.ticker.remove(this.tick);
  }

  destroy(): void {
    this.stop();
    this.scenes.destroy();
    this.input.detach();
    this.audio.destroy();
    this.resizeObserver?.disconnect();
    this.app.destroy(true);
  }

  private readonly tick = (): void => {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.input.beginFrame();
    this.scenes.update(dt);
    this.input.endFrame();
  };

  private bindResize(): void {
    const { width, height } = this.options;
    if (width && height) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.scenes.resize(this.width, this.height);
    });
    this.resizeObserver.observe(document.body);
  }
}
