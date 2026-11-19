import { Injectable, inject } from '@angular/core';
import { CelebrationService } from './celebration.service';
import { ProgressService } from './progress.service';

const SECRET = 'sudo';
const GLITCH_MS = 1200;

/**
 * Type "sudo" anywhere (outside a text field) for a surprise. Also reachable
 * by typing "sudo" into the command palette. Unlocks a hidden achievement.
 */
@Injectable({ providedIn: 'root' })
export class EasterEggService {
  private readonly celebration = inject(CelebrationService);
  private readonly progress = inject(ProgressService);
  private buffer = '';

  constructor() {
    globalThis.document?.addEventListener('keydown', (event) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
      if (typing || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
        return;
      }
      this.buffer = (this.buffer + event.key.toLowerCase()).slice(-SECRET.length);
      if (this.buffer === SECRET) {
        this.buffer = '';
        this.trigger();
      }
    });
  }

  trigger(): void {
    this.progress.recordEvent('sudo');
    this.celebration.burst('big');
    this.celebration.toast({
      icon: '🔓',
      title: 'sudo: permission granted',
      detail: "Root access unlocked. Don't tell Rohan, he'd paste the whole repo.",
      tone: 'gold',
    });

    const root = globalThis.document?.documentElement;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (root && !reduced) {
      root.classList.add('sudo-glitch');
      setTimeout(() => root.classList.remove('sudo-glitch'), GLITCH_MS);
    }
  }
}
