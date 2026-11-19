import { Component, computed, output, signal } from '@angular/core';
import { LabResult } from '../lab-result';

type Scope = 'repo' | 'module' | 'function';
type Format = 'prose' | 'summary' | 'steps';
type Depth = 'overview' | 'deep';

interface Scenario {
  brief: string;
  target: { scope: Scope; format: Format; depth: Depth };
  win: string;
}

interface Choice<T> {
  value: T;
  label: string;
  phrase: string;
  weight: number;
}

/**
 * Episode 5 lab — build a prompt by choosing scope, format and depth, watch
 * the response size change, and match two different needs.
 */
@Component({
  selector: 'app-output-shaper-lab',
  templateUrl: './output-shaper.html',
  styleUrl: './output-shaper.scss',
})
export class OutputShaperLab {
  readonly solved = output<LabResult>();

  private misses = 0;

  protected readonly scenarios: Scenario[] = [
    {
      brief: 'Stand-up in five minutes. You just need to remember what validateOrder() does.',
      target: { scope: 'function', format: 'summary', depth: 'overview' },
      win: 'Two lines, one function, ready before stand-up.',
    },
    {
      brief: "You're new to the pricing engine and need to understand how discounts get applied.",
      target: { scope: 'module', format: 'steps', depth: 'deep' },
      win: 'Same developer, different need: now depth is what makes the answer useful.',
    },
  ];

  protected readonly scopes: Choice<Scope>[] = [
    { value: 'repo', label: 'whole repo', phrase: 'the whole codebase', weight: 4 },
    { value: 'module', label: 'module', phrase: 'the pricing module', weight: 2 },
    { value: 'function', label: 'one function', phrase: 'validateOrder()', weight: 1 },
  ];
  protected readonly formats: Choice<Format>[] = [
    { value: 'prose', label: 'free text', phrase: '', weight: 3 },
    { value: 'summary', label: '2-line summary', phrase: ' in a two-line summary', weight: 1 },
    { value: 'steps', label: 'numbered steps', phrase: ' as numbered steps', weight: 2 },
  ];
  protected readonly depths: Choice<Depth>[] = [
    { value: 'overview', label: 'overview', phrase: '', weight: 1 },
    {
      value: 'deep',
      label: 'with trade-offs',
      phrase: ', including the reasoning and trade-offs',
      weight: 3,
    },
  ];

  protected readonly index = signal(0);
  protected readonly scope = signal<Scope>('repo');
  protected readonly format = signal<Format>('prose');
  protected readonly depth = signal<Depth>('overview');
  protected readonly checked = signal(false);
  protected readonly cleared = signal<ReadonlySet<number>>(new Set());

  protected readonly scenario = computed(() => this.scenarios[this.index()]);

  protected readonly prompt = computed(() => {
    const scope = this.find(this.scopes, this.scope());
    const format = this.find(this.formats, this.format());
    const depth = this.find(this.depths, this.depth());
    return `Explain ${scope.phrase}${format.phrase}${depth.phrase}.`;
  });

  /** Simulated response length in lines. */
  protected readonly lines = computed(
    () =>
      this.find(this.scopes, this.scope()).weight *
      this.find(this.formats, this.format()).weight *
      this.find(this.depths, this.depth()).weight *
      2,
  );
  protected readonly skeleton = computed(() =>
    Array.from({ length: Math.min(this.lines(), 18) }, (_, i) => 55 + ((i * 37) % 45)),
  );

  protected readonly mismatches = computed(() => {
    const t = this.scenario().target;
    const out: string[] = [];
    if (this.scope() !== t.scope) {
      out.push(
        t.scope === 'function' ? 'scope is too broad' : 'scope should cover the whole module',
      );
    }
    if (this.format() !== t.format) {
      out.push(
        t.format === 'summary'
          ? 'ask for a short summary'
          : 'a step-by-step format fits this better',
      );
    }
    if (this.depth() !== t.depth) {
      out.push(t.depth === 'deep' ? 'this one needs depth' : 'no need for trade-offs here');
    }
    return out;
  });

  protected readonly canAdvance = computed(
    () =>
      this.checked() && this.mismatches().length === 0 && this.index() < this.scenarios.length - 1,
  );
  protected readonly allCleared = computed(() => this.cleared().size === this.scenarios.length);

  protected setScope(v: Scope): void {
    this.scope.set(v);
    this.checked.set(false);
  }

  protected setFormat(v: Format): void {
    this.format.set(v);
    this.checked.set(false);
  }

  protected setDepth(v: Depth): void {
    this.depth.set(v);
    this.checked.set(false);
  }

  protected send(): void {
    this.checked.set(true);
    if (this.mismatches().length === 0) {
      const next = new Set(this.cleared());
      next.add(this.index());
      this.cleared.set(next);
      if (next.size === this.scenarios.length) {
        this.solved.emit({ firstTry: this.misses === 0 });
      }
    } else {
      this.misses++;
    }
  }

  protected goTo(i: number): void {
    this.index.set(i);
    this.scope.set('repo');
    this.format.set('prose');
    this.depth.set('overview');
    this.checked.set(false);
  }

  private find<T>(choices: Choice<T>[], value: T): Choice<T> {
    return choices.find((c) => c.value === value) ?? choices[0];
  }
}
