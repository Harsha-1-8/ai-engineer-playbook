import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonService } from '../../core/services/lesson.service';
import { ProgressService } from '../../core/services/progress.service';
import { AchievementsService } from '../../core/services/achievements.service';
import { LAB_NAMES } from '../../content/lessons/lab-names';
import { LabKind } from '../../content/lessons/episode.model';

/** The series as a commit-log style timeline with live progress. */
@Component({
  selector: 'app-learning-journey',
  imports: [RouterLink],
  templateUrl: './learning-journey.html',
  styleUrl: './learning-journey.scss',
})
export class LearningJourney {
  private readonly lessons = inject(LessonService);
  protected readonly progress = inject(ProgressService);
  protected readonly achievements = inject(AchievementsService);

  protected readonly episodes = this.lessons.getAll();
  protected readonly confirmingReset = signal(false);

  /** A short fake commit hash per episode, for the git-log look. */
  protected hash(slug: string): string {
    let h = 0;
    for (const char of slug) {
      h = (h * 31 + char.charCodeAt(0)) >>> 0;
    }
    return h.toString(16).padStart(7, '0').slice(0, 7);
  }

  protected labName(kind: LabKind | undefined): string {
    return kind ? LAB_NAMES[kind] : '';
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected reset(): void {
    if (!this.confirmingReset()) {
      this.confirmingReset.set(true);
      return;
    }
    this.progress.reset();
    this.confirmingReset.set(false);
  }
}
