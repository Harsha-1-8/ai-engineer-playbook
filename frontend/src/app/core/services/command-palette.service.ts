import { Injectable, inject, signal } from '@angular/core';
import { ProgressService } from './progress.service';

/**
 * Open/close state for the command palette plus its global shortcut
 * (Ctrl+K, or ⌘K on macOS).
 */
@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly progress = inject(ProgressService);

  readonly isOpen = signal(false);
  /** Display label for the shortcut, adapted to the visitor's OS. */
  readonly shortcut = /mac|iphone|ipad/i.test(globalThis.navigator?.userAgent ?? '')
    ? '⌘K'
    : 'Ctrl K';

  constructor() {
    globalThis.document?.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        this.isOpen() ? this.close() : this.open();
      }
    });
  }

  open(): void {
    this.isOpen.set(true);
    this.progress.recordEvent('palette');
  }

  close(): void {
    this.isOpen.set(false);
  }
}
