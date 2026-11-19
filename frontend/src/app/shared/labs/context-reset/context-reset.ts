import { Component, computed, output, signal } from '@angular/core';
import { LabResult } from '../lab-result';

interface CarryItem {
  id: string;
  label: string;
  needed: boolean;
}

type Phase = 'decide' | 'continued' | 'carry' | 'done';

/**
 * Episode 2 lab — a new task lands mid-conversation. Continue the old thread
 * or start fresh, then choose what to carry forward.
 */
@Component({
  selector: 'app-context-reset-lab',
  templateUrl: './context-reset.html',
  styleUrl: './context-reset.scss',
})
export class ContextResetLab {
  readonly solved = output<LabResult>();

  private mistakes = 0;

  protected readonly history = [
    { who: 'you', text: 'Refactor AuthGuard to use the new session service.' },
    { who: 'ai', text: 'Done. AuthGuard now injects SessionService…' },
    { who: 'you', text: 'Tests fail on token refresh. Can you look?' },
    { who: 'ai', text: 'Try mocking refreshToken() with a delayed observable…' },
    { who: 'you', text: "That didn't work. Revert it, try the interceptor instead." },
    { who: 'ai', text: 'Reverted. Moving refresh logic into AuthInterceptor…' },
    { who: 'you', text: 'Rename tokenStore to sessionStore everywhere.' },
    { who: 'ai', text: 'Renamed in 11 files.' },
  ];

  protected readonly carryItems: CarryItem[] = [
    { id: 'cmp', label: 'reports-table.component.ts', needed: true },
    { id: 'req', label: 'CSV requirements: columns, date format, file name', needed: true },
    { id: 'auth', label: "this morning's AuthGuard refactor notes", needed: false },
    { id: 'dead', label: 'the token-refresh dead ends', needed: false },
    { id: 'all', label: 'a paste of the entire previous chat', needed: false },
  ];

  protected readonly phase = signal<Phase>('decide');
  protected readonly carried = signal<ReadonlySet<string>>(new Set());
  protected readonly attempted = signal(false);

  protected readonly missing = computed(() =>
    this.carryItems.filter((i) => i.needed && !this.carried().has(i.id)),
  );
  protected readonly baggage = computed(() =>
    this.carryItems.filter((i) => !i.needed && this.carried().has(i.id)),
  );
  /** A rough 0–100 "focus" score for the new conversation. */
  protected readonly focus = computed(() => {
    if (this.phase() === 'continued') {
      return 22;
    }
    return Math.max(5, 100 - this.missing().length * 30 - this.baggage().length * 20);
  });

  protected continueChat(): void {
    this.mistakes++;
    this.phase.set('continued');
  }

  protected startFresh(): void {
    this.carried.set(new Set());
    this.attempted.set(false);
    this.phase.set('carry');
  }

  protected toggle(id: string): void {
    this.attempted.set(false);
    this.carried.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isCarried(id: string): boolean {
    return this.carried().has(id);
  }

  protected launch(): void {
    this.attempted.set(true);
    if (this.missing().length === 0 && this.baggage().length === 0) {
      this.phase.set('done');
      this.solved.emit({ firstTry: this.mistakes === 0 });
    } else {
      this.mistakes++;
    }
  }

  protected restart(): void {
    this.carried.set(new Set());
    this.attempted.set(false);
    this.phase.set('decide');
  }
}
