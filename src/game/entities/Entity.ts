import { Container } from 'pixi.js';

/**
 * Optional composition root for game objects. Scenes can use plain
 * Containers; Entity is a convenience when you want update hooks.
 */
export class Entity {
  readonly view = new Container();
  alive = true;

  update(_dt: number): void {}

  destroy(): void {
    this.alive = false;
    this.view.destroy({ children: true });
  }
}
