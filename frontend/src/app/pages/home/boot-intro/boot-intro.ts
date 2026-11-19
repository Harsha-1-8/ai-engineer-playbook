import { Component, OnDestroy, effect, inject, signal, untracked } from '@angular/core';
import { BootIntroService } from '../../../core/services/boot-intro.service';
import { LessonService } from '../../../core/services/lesson.service';

interface BootLine {
  text: string;
  status?: string;
}

const SESSION_KEY = 'aep.booted';
const LINE_MS = 280;
const HOLD_MS = 450;
const FADE_MS = 420;

/**
 * A short, skippable "terminal boot" shown on the first visit to Home in a
 * browser session, and again whenever the logo is clicked. Never shown with
 * reduced motion. Any key or tap skips it.
 */
@Component({
  selector: 'app-boot-intro',
  templateUrl: './boot-intro.html',
  styleUrl: './boot-intro.scss',
  host: {
    '(document:keydown)': 'skip()',
  },
})
export class BootIntro implements OnDestroy {
  private readonly lessons = inject(LessonService);
  private readonly bootIntro = inject(BootIntroService);

  protected readonly lines: BootLine[] = (() => {
    const episodes = this.lessons.getAll();
    const labs = episodes.filter((e) => e.lab).length;
    return [
      { text: '$ npx playbook start' },
      { text: `› loading ${episodes.length} episodes`, status: 'ok' },
      { text: `› compiling ${labs} labs`, status: 'ok' },
      { text: '› trimming context to what matters', status: 'ok' },
      { text: '› verifying the AI’s homework', status: 'ok' },
      { text: '✓ ready' },
    ];
  })();

  protected readonly visible = signal(0);
  protected readonly leaving = signal(false);
  protected readonly active = signal(false);

  private timers: ReturnType<typeof setTimeout>[] = [];

  protected isShown(index: number): boolean {
    return index < this.visible();
  }

  protected typing(): boolean {
    return this.visible() < this.lines.length;
  }

  constructor() {
    if (shouldShow()) {
      this.play();
    }

    // Replays requested elsewhere (the logo). Works whether Home is already
    // on screen or is being navigated to.
    effect(() => {
      if (this.bootIntro.replayPending()) {
        untracked(() => {
          this.bootIntro.replayPending.set(false);
          if (!prefersReducedMotion()) {
            this.play();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }

  private play(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    markShown();
    this.visible.set(0);
    this.leaving.set(false);
    this.active.set(true);
    this.lines.forEach((_, i) => {
      this.timers.push(setTimeout(() => this.visible.set(i + 1), 120 + i * LINE_MS));
    });
    this.timers.push(setTimeout(() => this.skip(), 120 + this.lines.length * LINE_MS + HOLD_MS));
  }

  protected skip(): void {
    if (!this.active() || this.leaving()) {
      return;
    }
    this.timers.forEach(clearTimeout);
    this.visible.set(this.lines.length);
    this.leaving.set(true);
    this.timers = [setTimeout(() => this.active.set(false), FADE_MS)];
  }
}

function prefersReducedMotion(): boolean {
  return !!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function shouldShow(): boolean {
  try {
    return !prefersReducedMotion() && globalThis.sessionStorage?.getItem(SESSION_KEY) !== '1';
  } catch {
    return false;
  }
}

function markShown(): void {
  try {
    globalThis.sessionStorage?.setItem(SESSION_KEY, '1');
  } catch {
    // Without sessionStorage the intro may show again on the next visit; harmless.
  }
}
