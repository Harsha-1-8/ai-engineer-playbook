import { Component, computed, output, signal } from '@angular/core';
import { LabResult } from '../lab-result';

type Mode = 'ask' | 'agent';

interface Card {
  situation: string;
  mode: Mode;
  why: string;
}

const PASS_MARK = 5;

/**
 * Episode 6 lab — a deck of situations. For each, choose Ask or Agent.
 * Solved with at least five of six correct.
 */
@Component({
  selector: 'app-ask-or-agent-lab',
  templateUrl: './ask-or-agent.html',
  styleUrl: './ask-or-agent.scss',
})
export class AskOrAgentLab {
  readonly solved = output<LabResult>();

  private plays = 1;

  protected readonly cards: Card[] = [
    {
      situation: 'You hit an unfamiliar RxJS pipe and want to know what it actually does.',
      mode: 'ask',
      why: 'You need understanding, not edits.',
    },
    {
      situation: 'Rename UserService to AccountService and update every import.',
      mode: 'agent',
      why: 'Mechanical, multi-file change. Delegate it, then review.',
    },
    {
      situation: 'Compare two approaches to form state before you commit to one.',
      mode: 'ask',
      why: 'Exploring options comes before changing code.',
    },
    {
      situation: 'Add a "phone" field across the model, form, API call and template.',
      mode: 'agent',
      why: 'A coordinated change across related files.',
    },
    {
      situation: 'Why does this test fail only on CI?',
      mode: 'ask',
      why: 'Diagnose first. Changes come after you understand it.',
    },
    {
      situation: 'Apply the agreed lint fix across the module and run the tests.',
      mode: 'agent',
      why: 'Multi-step work including running dev actions.',
    },
  ];

  protected readonly position = signal(0);
  protected readonly answer = signal<Mode | null>(null);
  protected readonly correct = signal(0);
  protected readonly finished = signal(false);

  protected readonly card = computed(() => this.cards[this.position()]);
  protected readonly isRight = computed(() => this.answer() === this.card().mode);
  protected readonly passed = computed(() => this.correct() >= PASS_MARK);
  protected readonly passMark = PASS_MARK;

  protected choose(mode: Mode): void {
    if (this.answer() !== null) {
      return;
    }
    this.answer.set(mode);
    if (mode === this.card().mode) {
      this.correct.update((n) => n + 1);
    }
  }

  protected next(): void {
    if (this.position() === this.cards.length - 1) {
      this.finished.set(true);
      if (this.passed()) {
        // First try = a perfect run on the very first play-through.
        this.solved.emit({ firstTry: this.plays === 1 && this.correct() === this.cards.length });
      }
      return;
    }
    this.position.update((p) => p + 1);
    this.answer.set(null);
  }

  protected restart(): void {
    this.plays++;
    this.position.set(0);
    this.answer.set(null);
    this.correct.set(0);
    this.finished.set(false);
  }
}
