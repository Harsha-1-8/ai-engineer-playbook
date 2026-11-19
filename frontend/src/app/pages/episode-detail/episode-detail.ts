import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonService } from '../../core/services/lesson.service';
import { ProgressService } from '../../core/services/progress.service';
import { CelebrationService } from '../../core/services/celebration.service';
import { LabResult } from '../../shared/labs/lab-result';
import { LabKind, WorkflowStep } from '../../content/lessons/episode.model';
import { LessonSectionView, NumberedSection } from './lesson-section/lesson-section';
import { TokenBudgetLab } from '../../shared/labs/token-budget/token-budget';
import { ContextResetLab } from '../../shared/labs/context-reset/context-reset';
import { ModelMatchLab } from '../../shared/labs/model-match/model-match';
import { LogHuntLab } from '../../shared/labs/log-hunt/log-hunt';
import { OutputShaperLab } from '../../shared/labs/output-shaper/output-shaper';
import { AskOrAgentLab } from '../../shared/labs/ask-or-agent/ask-or-agent';
import { SpotTheBugLab } from '../../shared/labs/spot-the-bug/spot-the-bug';
import { WorkflowBuilderLab } from '../../shared/labs/workflow-builder/workflow-builder';
import { Quiz } from '../../shared/labs/quiz/quiz';

/** One entry in the on-page outline (table of contents). */
interface OutlineEntry {
  id: string;
  step: string;
  label: string;
  interactive: boolean;
}

/** Labels for the interactive sections injected into every episode. */
const LAB_LABEL = 'Interactive lab';
const QUIZ_LABEL = 'Check yourself';

/**
 * Episode Detail page.
 *
 * The `slug` route param binds straight to an input (withComponentInputBinding),
 * and everything else derives from it with `computed`. The episode's authored
 * sections are split around an injected lab + quiz, which sit just before the
 * takeaway (or, for the finale, before the workflow it asks you to rebuild).
 */
@Component({
  selector: 'app-episode-detail',
  imports: [
    RouterLink,
    LessonSectionView,
    TokenBudgetLab,
    ContextResetLab,
    ModelMatchLab,
    LogHuntLab,
    OutputShaperLab,
    AskOrAgentLab,
    SpotTheBugLab,
    WorkflowBuilderLab,
    Quiz,
  ],
  templateUrl: './episode-detail.html',
  styleUrl: './episode-detail.scss',
  host: { '(window:scroll)': 'onScroll()' },
})
export class EpisodeDetail {
  readonly slug = input.required<string>();

  private readonly lessons = inject(LessonService);
  protected readonly progress = inject(ProgressService);
  private readonly celebration = inject(CelebrationService);

  protected readonly episode = computed(() => this.lessons.getBySlug(this.slug()));
  protected readonly previous = computed(() => this.lessons.getAdjacent(this.slug(), -1));
  protected readonly next = computed(() => this.lessons.getAdjacent(this.slug(), 1));
  protected readonly quiz = computed(() => this.lessons.getQuiz(this.slug()));
  protected readonly lab = computed<LabKind | undefined>(() => this.episode()?.lab);
  protected readonly status = computed(() => this.progress.progressFor(this.slug()));
  protected readonly complete = computed(() => this.progress.isComplete(this.slug()));

  /** Lit nodes in the finale constellation: one per completed episode 1–7. */
  protected readonly constellation = computed(() =>
    this.lessons
      .getAll()
      .filter((e) => !e.finale)
      .map((e) => this.progress.isComplete(e.slug)),
  );

  /** Where the lab + quiz are inserted among the authored sections. */
  private readonly splitAt = computed(() => {
    const sections = this.episode()?.sections ?? [];
    const anchor = this.episode()?.finale ? 'workflow' : 'takeaway';
    const index = sections.findIndex((s) => s.block.type === anchor);
    return index === -1 ? sections.length : index;
  });

  /** Number of interactive sections inserted (lab, plus quiz when present). */
  private readonly inserted = computed(() => (this.lab() ? 1 : 0) + (this.quiz().length ? 1 : 0));

  protected readonly leadSections = computed<NumberedSection[]>(() =>
    (this.episode()?.sections ?? [])
      .slice(0, this.splitAt())
      .map((s, i) => ({ ...s, step: pad(i + 1) })),
  );

  protected readonly tailSections = computed<NumberedSection[]>(() => {
    const offset = this.splitAt() + this.inserted();
    return (this.episode()?.sections ?? [])
      .slice(this.splitAt())
      .map((s, i) => ({ ...s, step: pad(offset + i + 1) }));
  });

  protected readonly labStep = computed(() => pad(this.splitAt() + 1));
  protected readonly quizStep = computed(() => pad(this.splitAt() + (this.lab() ? 2 : 1)));

  protected readonly outline = computed<OutlineEntry[]>(() => {
    const entries: OutlineEntry[] = this.leadSections().map((s) => ({
      id: s.id,
      step: s.step,
      label: s.label,
      interactive: false,
    }));
    if (this.lab()) {
      entries.push({ id: 'lab', step: this.labStep(), label: LAB_LABEL, interactive: true });
    }
    if (this.quiz().length) {
      entries.push({ id: 'quiz', step: this.quizStep(), label: QUIZ_LABEL, interactive: true });
    }
    for (const s of this.tailSections()) {
      entries.push({ id: s.id, step: s.step, label: s.label, interactive: false });
    }
    return entries;
  });

  /** Steps for the finale's workflow-builder lab, taken from the authored workflow. */
  protected readonly workflowSteps = computed<WorkflowStep[]>(() => {
    for (const section of this.episode()?.sections ?? []) {
      if (section.block.type === 'workflow') {
        return section.block.steps;
      }
    }
    return [];
  });

  /** 0–100: how far the reader has scrolled through the page. */
  protected readonly readProgress = signal(0);

  protected readonly labLabel = LAB_LABEL;
  protected readonly quizLabel = QUIZ_LABEL;

  protected onScroll(): void {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    this.readProgress.set(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);
  }

  /** Outline links scroll in place (a bare #hash would resolve against <base href>). */
  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected onLabSolved(result: LabResult): void {
    const firstSolve = !this.status().lab;
    const wasComplete = this.complete();
    this.progress.completeLab(this.slug(), result.firstTry);
    if (!firstSolve) {
      return; // replays don't re-celebrate
    }
    if (!this.celebrateCompletion(wasComplete)) {
      this.celebration.burst('small');
      this.celebration.toast({
        icon: result.firstTry ? '🎯' : '✓',
        title: result.firstTry ? 'lab solved · first try' : 'lab solved',
        detail: this.quiz().length ? 'One quiz left to finish this episode.' : undefined,
      });
    }
  }

  protected onQuizFinished(score: number): void {
    const wasComplete = this.complete();
    this.progress.recordQuiz(this.slug(), score);
    this.celebrateCompletion(wasComplete);
  }

  /**
   * Celebrates if this action just completed the episode (or the chapter).
   * Returns whether it celebrated.
   */
  private celebrateCompletion(wasComplete: boolean): boolean {
    if (wasComplete || !this.complete()) {
      return false;
    }
    const done = this.progress.completedCount();
    const total = this.progress.totalCount;
    if (done === total) {
      this.celebration.burst('big');
      this.celebration.toast({
        icon: '🏁',
        title: 'chapter 1 complete',
        detail: `All ${total} episodes cleared. Your playbook is assembled.`,
      });
    } else {
      const next = this.progress.nextUp();
      this.celebration.burst('small');
      this.celebration.toast({
        icon: '✓',
        title: `episode ${pad(this.episode()?.number ?? 0)} complete`,
        detail: `${done}/${total} cleared${next ? ` · next: ${next.title}` : ''}`,
      });
    }
    return true;
  }

  protected pad(n: number): string {
    return pad(n);
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
