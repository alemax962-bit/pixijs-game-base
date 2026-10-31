import { Game } from './game/Game';
import { DemoScene } from './scenes/DemoScene';

async function bootstrap(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
  if (!canvas) {
    throw new Error('Missing #game-canvas element');
  }

  const game = new Game({
    canvas,
    background: '#0b0f14',
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
  });

  await game.init();
  game.scenes.register('demo', () => new DemoScene(game));
  await game.scenes.change('demo');
  game.start();
}

bootstrap().catch((error) => {
  console.error('Failed to start game:', error);
});
