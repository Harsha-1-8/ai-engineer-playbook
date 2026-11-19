import { Component, computed, output, signal } from '@angular/core';
import { LabResult } from '../lab-result';

interface LogLine {
  id: number;
  level: 'info' | 'warn' | 'error' | 'trace';
  text: string;
  signal: boolean;
}

/**
 * Episode 4 lab — click the log lines worth sharing and add the expected
 * behavior. Solved when every signal line is picked with at most one stray
 * line, and the expected behavior is included.
 */
@Component({
  selector: 'app-log-hunt-lab',
  templateUrl: './log-hunt.html',
  styleUrl: './log-hunt.scss',
})
export class LogHuntLab {
  readonly solved = output<LabResult>();

  private submits = 0;

  protected readonly lines: LogLine[] = [
    { id: 1, level: 'info', text: '[vite] connected.', signal: false },
    { id: 2, level: 'info', text: 'Angular is running in development mode.', signal: false },
    {
      id: 3,
      level: 'warn',
      text: 'DEPRECATION: legacy-js-api will be removed in Dart Sass 2.0',
      signal: false,
    },
    { id: 4, level: 'info', text: '[hmr] Updated modules: dashboard.component.ts', signal: false },
    { id: 5, level: 'info', text: 'GET /api/users 200 (84ms)', signal: false },
    { id: 6, level: 'info', text: 'PUT /api/users/17 400 (31ms)', signal: true },
    {
      id: 7,
      level: 'error',
      text: "ERROR TypeError: Cannot read properties of undefined (reading 'email')",
      signal: true,
    },
    {
      id: 8,
      level: 'trace',
      text: '    at UserEditComponent.buildPayload (user-edit.component.ts:58:31)',
      signal: true,
    },
    {
      id: 9,
      level: 'trace',
      text: '    at UserEditComponent.save (user-edit.component.ts:42:22)',
      signal: true,
    },
    {
      id: 10,
      level: 'trace',
      text: '    at executeListenerWithErrorHandling (core.mjs:27011:16)',
      signal: false,
    },
    {
      id: 11,
      level: 'trace',
      text: '    at wrapListenerIn_markDirtyAndPreventDefault (core.mjs:27044:22)',
      signal: false,
    },
    {
      id: 12,
      level: 'trace',
      text: '    at HTMLButtonElement.<anonymous> (platform-browser.mjs:663:38)',
      signal: false,
    },
    {
      id: 13,
      level: 'info',
      text: '[hmr] Updated modules: user-list.component.scss',
      signal: false,
    },
    {
      id: 14,
      level: 'warn',
      text: 'NG0913: image "logo.png" has intrinsic size much larger than rendered',
      signal: false,
    },
    { id: 15, level: 'info', text: 'GET /assets/i18n/en.json 304 (3ms)', signal: false },
  ];

  /** Rough tokens per log line, for the comparison panel. */
  private readonly perLine = 26;
  /** The real log is far longer than what is shown here. */
  protected readonly fullLogTokens = 18_400;

  protected readonly picked = signal<ReadonlySet<number>>(new Set());
  protected readonly expected = signal(false);
  protected readonly submitted = signal(false);

  private readonly signalIds = this.lines.filter((l) => l.signal).map((l) => l.id);

  protected readonly found = computed(
    () => this.signalIds.filter((id) => this.picked().has(id)).length,
  );
  protected readonly noise = computed(
    () => [...this.picked()].filter((id) => !this.signalIds.includes(id)).length,
  );
  protected readonly sharedTokens = computed(
    () => this.picked().size * this.perLine + (this.expected() ? 30 : 0),
  );
  /** Visual only: scaled up so a focused selection is still visible next to the full log. */
  protected readonly sharedFill = computed(() =>
    Math.min(100, (this.sharedTokens() / this.fullLogTokens) * 2500),
  );
  protected readonly isSolved = computed(
    () => this.found() === this.signalIds.length && this.noise() <= 1 && this.expected(),
  );
  protected readonly totalSignal = this.signalIds.length;

  protected toggle(id: number): void {
    this.submitted.set(false);
    this.picked.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isPicked(id: number): boolean {
    return this.picked().has(id);
  }

  protected toggleExpected(): void {
    this.submitted.set(false);
    this.expected.update((v) => !v);
  }

  protected submit(): void {
    this.submitted.set(true);
    this.submits++;
    if (this.isSolved()) {
      this.solved.emit({ firstTry: this.submits === 1 });
    }
  }

  protected reveal(id: number): 'hit' | 'miss' | 'stray' | null {
    if (!this.submitted()) {
      return null;
    }
    const line = this.lines.find((l) => l.id === id);
    if (!line) {
      return null;
    }
    if (line.signal) {
      return this.isPicked(id) ? 'hit' : 'miss';
    }
    return this.isPicked(id) ? 'stray' : null;
  }

  protected reset(): void {
    this.picked.set(new Set());
    this.expected.set(false);
    this.submitted.set(false);
  }
}
