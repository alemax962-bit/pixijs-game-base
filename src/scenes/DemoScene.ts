import { Graphics, Text } from 'pixi.js';
import { Scene } from '../game/Scene';
import type { Game } from '../game/Game';

/**
 * Placeholder scene proving the loop works. Replace with your first real scene.
 */
export class DemoScene extends Scene {
  private title!: Text;
  private hint!: Text;
  private orb!: Graphics;
  private time = 0;

  constructor(game: Game) {
    super(game);
  }

  enter(): void {
    this.game.input.bind('confirm', ['Space', 'Enter']);
    this.game.input.bind('cancel', ['Escape']);

    this.title = new Text({
      text: 'PixiJS Game Base',
      style: {
        fill: 0xf4f7fb,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 42,
      },
    });
    this.title.anchor.set(0.5);

    this.hint = new Text({
      text: 'Replace DemoScene • generate assets via npm run generate',
      style: {
        fill: 0x8b9bb4,
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: 16,
      },
    });
    this.hint.anchor.set(0.5);

    this.orb = new Graphics().circle(0, 0, 28).fill(0x3d8bfd);

    this.root.addChild(this.orb, this.title, this.hint);
    this.layout();
  }

  update(dt: number): void {
    this.time += dt;
    this.orb.y = this.game.height * 0.38 + Math.sin(this.time * 2.2) * 18;

    if (this.game.input.wasPressed('confirm')) {
      this.orb.tint = 0x7dd3a7;
    }
  }

  exit(): void {
    /* nothing persistent */
  }

  resize(width: number, height: number): void {
    void width;
    void height;
    this.layout();
  }

  private layout(): void {
    const { width, height } = this.game;
    this.title.position.set(width / 2, height * 0.52);
    this.hint.position.set(width / 2, height * 0.6);
    this.orb.position.set(width / 2, height * 0.38);
  }
}
