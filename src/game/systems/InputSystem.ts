type KeyState = { down: boolean; pressed: boolean; released: boolean };

/**
 * Keyboard + pointer input. Poll in scene update(); use wasPressed for edge triggers.
 * Bind game actions via aliases instead of hardcoding keys in gameplay code.
 */
export class InputSystem {
  private keys = new Map<string, KeyState>();
  private aliases = new Map<string, string[]>();
  private pointer = { x: 0, y: 0, down: false, pressed: false, released: false };
  private target: HTMLElement | null = null;

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    const key = e.code;
    const state = this.keys.get(key) ?? { down: false, pressed: false, released: false };
    if (!state.down) state.pressed = true;
    state.down = true;
    this.keys.set(key, state);
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    const key = e.code;
    const state = this.keys.get(key) ?? { down: false, pressed: false, released: false };
    state.down = false;
    state.released = true;
    this.keys.set(key, state);
  };

  private readonly onPointerDown = (e: PointerEvent): void => {
    this.updatePointer(e);
    if (!this.pointer.down) this.pointer.pressed = true;
    this.pointer.down = true;
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    this.updatePointer(e);
    this.pointer.down = false;
    this.pointer.released = true;
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    this.updatePointer(e);
  };

  attach(target: HTMLElement): void {
    this.target = target;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('pointerdown', this.onPointerDown);
    target.addEventListener('pointerup', this.onPointerUp);
    target.addEventListener('pointermove', this.onPointerMove);
    target.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  detach(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.target) {
      this.target.removeEventListener('pointerdown', this.onPointerDown);
      this.target.removeEventListener('pointerup', this.onPointerUp);
      this.target.removeEventListener('pointermove', this.onPointerMove);
    }
    this.target = null;
  }

  /** Map a gameplay action to one or more KeyboardEvent.code values. */
  bind(action: string, codes: string[]): void {
    this.aliases.set(action, codes);
  }

  isDown(codeOrAction: string): boolean {
    return this.resolve(codeOrAction).some((c) => this.keys.get(c)?.down);
  }

  wasPressed(codeOrAction: string): boolean {
    return this.resolve(codeOrAction).some((c) => this.keys.get(c)?.pressed);
  }

  wasReleased(codeOrAction: string): boolean {
    return this.resolve(codeOrAction).some((c) => this.keys.get(c)?.released);
  }

  get pointerX(): number {
    return this.pointer.x;
  }

  get pointerY(): number {
    return this.pointer.y;
  }

  get pointerDown(): boolean {
    return this.pointer.down;
  }

  get pointerPressed(): boolean {
    return this.pointer.pressed;
  }

  beginFrame(): void {
    /* edge flags cleared in endFrame */
  }

  endFrame(): void {
    for (const state of this.keys.values()) {
      state.pressed = false;
      state.released = false;
    }
    this.pointer.pressed = false;
    this.pointer.released = false;
  }

  private resolve(codeOrAction: string): string[] {
    return this.aliases.get(codeOrAction) ?? [codeOrAction];
  }

  private updatePointer(e: PointerEvent): void {
    if (!this.target) return;
    const rect = this.target.getBoundingClientRect();
    this.pointer.x = e.clientX - rect.left;
    this.pointer.y = e.clientY - rect.top;
  }
}
