import { Component, computed, input, output, signal } from '@angular/core';
import { WorkflowStep } from '../../../content/lessons/episode.model';
import { LabResult } from '../lab-result';

/** A fixed scramble so the puzzle is identical for everyone. */
const SCRAMBLE = [3, 0, 5, 1, 4, 2];

/**
 * Finale lab — rebuild the six-step workflow from memory by clicking the
 * steps in order. Solved when the chain is complete.
 */
@Component({
  selector: 'app-workflow-builder-lab',
  templateUrl: './workflow-builder.html',
  styleUrl: './workflow-builder.scss',
})
export class WorkflowBuilderLab {
  readonly steps = input.required<WorkflowStep[]>();
  readonly solved = output<LabResult>();

  protected readonly placed = signal(0);
  protected readonly wrong = signal<number | null>(null);
  protected readonly mistakes = signal(0);

  /** Indices into `steps()` in shuffled display order. */
  protected readonly pool = computed(() => {
    const count = this.steps().length;
    const order = SCRAMBLE.filter((i) => i < count);
    for (let i = 0; i < count; i++) {
      if (!order.includes(i)) {
        order.push(i);
      }
    }
    return order;
  });

  protected readonly done = computed(() => this.placed() === this.steps().length);

  protected isPlaced(index: number): boolean {
    return index < this.placed();
  }

  protected pick(index: number): void {
    if (this.isPlaced(index) || this.done()) {
      return;
    }
    if (index === this.placed()) {
      this.placed.update((n) => n + 1);
      if (this.done()) {
        this.solved.emit({ firstTry: this.mistakes() === 0 });
      }
    } else {
      this.mistakes.update((n) => n + 1);
      this.wrong.set(index);
      setTimeout(() => this.wrong.set(null), 400);
    }
  }

  protected reset(): void {
    this.placed.set(0);
    this.mistakes.set(0);
    this.wrong.set(null);
  }
}
