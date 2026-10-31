import { Assets, Texture, Spritesheet, type SpritesheetData } from 'pixi.js';

/**
 * Thin facade over Pixi Assets. Prefer aliases defined here so scenes
 * do not hardcode URLs — generated files land under /assets/...
 */
export class AssetSystem {
  async loadTexture(alias: string, url: string): Promise<Texture> {
    if (Assets.cache.has(alias)) {
      return Assets.get<Texture>(alias);
    }
    Assets.add({ alias, src: url });
    return Assets.load<Texture>(alias);
  }

  async loadSpritesheet(alias: string, url: string, data: SpritesheetData): Promise<Spritesheet> {
    const texture = await this.loadTexture(`${alias}-base`, url);
    const sheet = new Spritesheet(texture, data);
    await sheet.parse();
    Assets.cache.set(alias, sheet);
    return sheet;
  }

  getTexture(alias: string): Texture {
    return Assets.get<Texture>(alias);
  }

  async bundle(manifest: Record<string, string>): Promise<void> {
    const aliases = Object.keys(manifest);
    for (const [alias, src] of Object.entries(manifest)) {
      if (!Assets.cache.has(alias)) {
        Assets.add({ alias, src });
      }
    }
    await Assets.load(aliases);
  }
}
