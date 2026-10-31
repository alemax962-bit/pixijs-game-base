import type { Game } from './Game';
import type { Scene } from './Scene';

type SceneFactory = () => Scene;

export class SceneManager {
  private readonly game: Game;
  private readonly registry = new Map<string, SceneFactory>();
  private current: Scene | null = null;
  private currentName: string | null = null;

  constructor(game: Game) {
    this.game = game;
  }

  register(name: string, factory: SceneFactory): void {
    this.registry.set(name, factory);
  }

  get active(): Scene | null {
    return this.current;
  }

  get activeName(): string | null {
    return this.currentName;
  }

  async change(name: string): Promise<void> {
    const factory = this.registry.get(name);
    if (!factory) {
      throw new Error(`Scene "${name}" is not registered`);
    }

    if (this.current) {
      this.current.exit();
      this.game.app.stage.removeChild(this.current.root);
      this.current.root.destroy({ children: true });
    }

    this.current = factory();
    this.currentName = name;
    this.game.app.stage.addChild(this.current.root);
    await this.current.enter();
    this.current.resize(this.game.width, this.game.height);
  }

  update(dt: number): void {
    this.current?.update(dt);
  }

  resize(width: number, height: number): void {
    this.current?.resize(width, height);
  }

  destroy(): void {
    if (this.current) {
      this.current.exit();
      this.game.app.stage.removeChild(this.current.root);
      this.current.root.destroy({ children: true });
      this.current = null;
      this.currentName = null;
    }
    this.registry.clear();
  }
}
