import { Component, computed, input, output, signal } from '@angular/core';
import { QuizQuestion } from '../../../content/lessons/episode.model';

/**
 * A short, one-question-at-a-time knowledge check with instant feedback.
 * Emits the final score when the learner reaches the end.
 */
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  readonly questions = input.required<QuizQuestion[]>();
  /** Best previous score, shown as context. */
  readonly bestScore = input<number | null>(null);
  readonly finished = output<number>();

  protected readonly position = signal(0);
  protected readonly selected = signal<number | null>(null);
  protected readonly score = signal(0);
  protected readonly done = signal(false);

  protected readonly question = computed(() => this.questions()[this.position()]);
  protected readonly isLast = computed(() => this.position() === this.questions().length - 1);
  protected readonly isCorrect = computed(() => this.selected() === this.question().answer);

  protected choose(index: number): void {
    if (this.selected() !== null) {
      return;
    }
    this.selected.set(index);
    if (index === this.question().answer) {
      this.score.update((s) => s + 1);
    }
  }

  protected optionState(index: number): 'correct' | 'wrong' | null {
    const selected = this.selected();
    if (selected === null) {
      return null;
    }
    if (index === this.question().answer) {
      return 'correct';
    }
    return index === selected ? 'wrong' : null;
  }

  protected next(): void {
    if (this.isLast()) {
      this.done.set(true);
      this.finished.emit(this.score());
      return;
    }
    this.position.update((p) => p + 1);
    this.selected.set(null);
  }

  protected restart(): void {
    this.position.set(0);
    this.selected.set(null);
    this.score.set(0);
    this.done.set(false);
  }

  protected letter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
