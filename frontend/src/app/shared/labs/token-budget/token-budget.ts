import { Component, computed, inject, output, signal } from '@angular/core';
import { ProgressService } from '../../../core/services/progress.service';
import { LabResult } from '../lab-result';

interface ContextItem {
  id: string;
  name: string;
  detail: string;
  tokens: number;
  relevant: boolean;
}

type Outcome = 'focused' | 'bloated' | 'missing';

/** Max tokens drawn on the meter; purely a visual scale. */
const WINDOW = 120_000;

/**
 * Episode 1 lab — build the context for a bug fix and watch the token meter.
 * Solved when every relevant item is attached and nothing else.
 */
@Component({
  selector: 'app-token-budget-lab',
  templateUrl: './token-budget.html',
  styleUrl: './token-budget.scss',
})
export class TokenBudgetLab {
  readonly solved = output<LabResult>();

  private readonly progress = inject(ProgressService);
  private attempts = 0;

  protected readonly items: ContextItem[] = [
    {
      id: 'cmp',
      name: 'user-edit.component.ts',
      detail: 'where the save logic lives',
      tokens: 1_400,
      relevant: true,
    },
    {
      id: 'tpl',
      name: 'user-edit.component.html',
      detail: 'binds [disabled] on the button',
      tokens: 700,
      relevant: true,
    },
    {
      id: 'err',
      name: 'error + expected behavior',
      detail: '"Save stays disabled after edit; should enable"',
      tokens: 150,
      relevant: true,
    },
    {
      id: 'src',
      name: 'src/ (entire folder)',
      detail: '214 files',
      tokens: 46_000,
      relevant: false,
    },
    {
      id: 'log',
      name: 'full build log',
      detail: 'every line since npm start',
      tokens: 21_000,
      relevant: false,
    },
    {
      id: 'lock',
      name: 'package-lock.json',
      detail: 'dependency tree',
      tokens: 38_000,
      relevant: false,
    },
    {
      id: 'dash',
      name: 'dashboard.component.ts',
      detail: 'unrelated feature',
      tokens: 1_600,
      relevant: false,
    },
    { id: 'readme', name: 'README.md', detail: 'project overview', tokens: 1_900, relevant: false },
  ];

  protected readonly selected = signal<ReadonlySet<string>>(new Set());
  protected readonly outcome = signal<Outcome | null>(null);

  protected readonly usedTokens = computed(() =>
    this.items.filter((i) => this.selected().has(i.id)).reduce((sum, i) => sum + i.tokens, 0),
  );
  protected readonly noiseTokens = computed(() =>
    this.items
      .filter((i) => this.selected().has(i.id) && !i.relevant)
      .reduce((sum, i) => sum + i.tokens, 0),
  );
  protected readonly fill = computed(() => Math.min(100, (this.usedTokens() / WINDOW) * 100));
  protected readonly fillTone = computed(() =>
    this.fill() > 50 ? 'danger' : this.fill() > 10 ? 'warning' : 'ok',
  );
  protected readonly missing = computed(() =>
    this.items.filter((i) => i.relevant && !this.selected().has(i.id)),
  );
  /** How many times more tokens than the focused minimum were sent. */
  protected readonly overhead = computed(() => {
    const minimum = this.items.filter((i) => i.relevant).reduce((s, i) => s + i.tokens, 0);
    return Math.max(1, Math.round(this.usedTokens() / minimum));
  });

  protected toggle(id: string): void {
    this.outcome.set(null);
    this.selected.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  protected send(): void {
    this.attempts++;
    if (this.missing().length > 0) {
      this.outcome.set('missing');
    } else if (this.noiseTokens() > 0) {
      this.outcome.set('bloated');
      if (this.selected().size === this.items.length) {
        this.progress.recordEvent('rohan'); // sent literally everything
      }
    } else {
      this.outcome.set('focused');
      this.solved.emit({ firstTry: this.attempts === 1 });
    }
  }

  protected attachEverything(): void {
    this.outcome.set(null);
    this.selected.set(new Set(this.items.map((i) => i.id)));
  }

  protected reset(): void {
    this.outcome.set(null);
    this.selected.set(new Set());
  }

  protected format(tokens: number): string {
    return tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : String(tokens);
  }
}
