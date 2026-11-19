import { Component, computed, output, signal } from '@angular/core';
import { LabResult } from '../lab-result';

type Tier = 'light' | 'reasoning';

interface Task {
  id: string;
  text: string;
  tier: Tier;
  why: string;
}

/**
 * Episode 3 lab — route each task to a lighter model or a reasoning model.
 * Solved when every task is routed correctly.
 */
@Component({
  selector: 'app-model-match-lab',
  templateUrl: './model-match.html',
  styleUrl: './model-match.scss',
})
export class ModelMatchLab {
  readonly solved = output<LabResult>();

  private checks = 0;

  protected readonly tasks: Task[] = [
    {
      id: 't1',
      text: 'Rename a variable across one file',
      tier: 'light',
      why: 'Narrow goal, obvious "done".',
    },
    {
      id: 't2',
      text: 'Design a caching strategy for a slow dashboard that calls four services',
      tier: 'reasoning',
      why: 'Several approaches, real trade-offs.',
    },
    {
      id: 't3',
      text: 'Add aria-labels to the inputs in a form',
      tier: 'light',
      why: 'Clear, mechanical, low ambiguity.',
    },
    {
      id: 't4',
      text: 'Track down a race condition between two services and the UI',
      tier: 'reasoning',
      why: 'Must reason across files and timing.',
    },
    {
      id: 't5',
      text: 'Convert a date utility to return ISO strings',
      tier: 'light',
      why: 'Well-defined input and output.',
    },
    {
      id: 't6',
      text: 'Plan a migration from a hand-rolled store to signals across the app',
      tier: 'reasoning',
      why: 'Broad, open-ended, many constraints.',
    },
  ];

  protected readonly picks = signal<Readonly<Record<string, Tier>>>({});
  protected readonly checked = signal(false);

  protected readonly answered = computed(() => Object.keys(this.picks()).length);
  protected readonly score = computed(
    () => this.tasks.filter((t) => this.picks()[t.id] === t.tier).length,
  );

  protected pick(task: Task, tier: Tier): void {
    this.checked.set(false);
    this.picks.update((p) => ({ ...p, [task.id]: tier }));
  }

  protected pickOf(task: Task): Tier | undefined {
    return this.picks()[task.id];
  }

  protected check(): void {
    this.checked.set(true);
    this.checks++;
    if (this.score() === this.tasks.length) {
      this.solved.emit({ firstTry: this.checks === 1 });
    }
  }

  protected isWrong(task: Task): boolean {
    return this.checked() && this.picks()[task.id] !== task.tier;
  }

  protected reset(): void {
    this.picks.set({});
    this.checked.set(false);
  }
}
