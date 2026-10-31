import { Container } from 'pixi.js';
import type { Game } from './Game';

/**
 * Base scene: a self-contained game state (menu, level, pause overlay, etc.).
 * Extend this for any 2D genre — platformer rooms, top-down maps, puzzle boards.
 */
export abstract class Scene {
  readonly root = new Container();
  protected readonly game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  /** Called once when the scene becomes active. Load assets here. */
  abstract enter(): Promise<void> | void;

  /** Called every frame with delta time in seconds. */
  abstract update(dt: number): void;

  /** Called when leaving this scene. Clean up listeners / tweens. */
  abstract exit(): void;

  /** Optional: react to canvas resize. */
  resize(_width: number, _height: number): void {}
}
