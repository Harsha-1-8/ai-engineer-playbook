import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  icon: string;
  title: string;
  detail?: string;
  tone: 'accent' | 'gold';
}

export type BurstSize = 'small' | 'big';

const TOAST_MS = 3600;

/**
 * App-wide moments of delight: toasts and confetti bursts.
 *
 * Anything can call `toast()` or `burst()`; the single <app-celebration>
 * overlay in the app shell renders them. Bursts are a signal "tick" so the
 * overlay can react to each one, even two identical bursts in a row.
 */
@Injectable({ providedIn: 'root' })
export class CelebrationService {
  private nextId = 1;

  readonly toasts = signal<Toast[]>([]);
  /** Last requested confetti burst; `n` changes on every call. */
  readonly lastBurst = signal<{ n: number; size: BurstSize } | null>(null);

  toast(toast: Omit<Toast, 'id' | 'tone'> & { tone?: Toast['tone'] }): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list.slice(-2), { tone: 'accent', ...toast, id }]);
    setTimeout(() => this.dismiss(id), TOAST_MS);
  }

  burst(size: BurstSize = 'small'): void {
    this.lastBurst.set({ n: this.nextId++, size });
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
