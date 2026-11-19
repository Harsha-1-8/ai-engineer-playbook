import { Injectable, effect, inject, signal } from '@angular/core';
import { ProgressService } from './progress.service';

export type Theme = 'dark' | 'light';

/** Must match the key read by the inline script in index.html. */
const STORAGE_KEY = 'aep.theme';

/** Browser UI colour (mobile address bar) per theme; mirrors --bg in styles.scss. */
const CHROME_COLOR: Record<Theme, string> = { dark: '#0a0c11', light: '#f5f6f8' };

/**
 * Light/dark theme with signals.
 *
 * - First visit follows the OS preference (`prefers-color-scheme`), and keeps
 *   following it live until the visitor picks a theme themselves.
 * - An explicit choice is saved and wins from then on.
 * - The theme is applied as `data-theme` on <html>; all colours are CSS
 *   variables, so no component needs to know about themes.
 *
 * index.html applies the saved/OS theme before Angular boots, so there is
 * no flash of the wrong theme on load.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly progress = inject(ProgressService);
  private readonly media = globalThis.matchMedia?.('(prefers-color-scheme: light)');
  private explicit = readStored() !== null;

  private readonly theme = signal<Theme>(readStored() ?? this.systemTheme());
  readonly current = this.theme.asReadonly();

  constructor() {
    effect(() => applyTheme(this.theme()));

    // Track OS changes only while the visitor hasn't made their own choice.
    this.media?.addEventListener('change', () => {
      if (!this.explicit) {
        this.theme.set(this.systemTheme());
      }
    });
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.progress.recordEvent(`theme-${this.theme()}`);
    this.progress.recordEvent(`theme-${theme}`);
    this.explicit = true;
    this.theme.set(theme);
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable: the choice lasts for this visit only.
    }
  }

  private systemTheme(): Theme {
    return this.media?.matches ? 'light' : 'dark';
  }
}

function readStored(): Theme | null {
  try {
    const value = globalThis.localStorage?.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme): void {
  const root = globalThis.document?.documentElement;
  if (!root) {
    return;
  }
  root.dataset['theme'] = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CHROME_COLOR[theme]);
}
