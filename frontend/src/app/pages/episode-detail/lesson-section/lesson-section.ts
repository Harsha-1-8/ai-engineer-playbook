import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonSection } from '../../../content/lessons/episode.model';
import { LessonService } from '../../../core/services/lesson.service';
import { ProgressService } from '../../../core/services/progress.service';

/** An authored lesson section plus its display step number (e.g. "03"). */
export interface NumberedSection extends LessonSection {
  step: string;
}

/**
 * Renders one authored lesson section. Each `LessonBlock` type maps to its
 * own template branch, so adding a block type means adding one `@case`.
 */
@Component({
  selector: 'app-lesson-section',
  imports: [RouterLink],
  templateUrl: './lesson-section.html',
  styleUrl: './lesson-section.scss',
})
export class LessonSectionView {
  readonly section = input.required<NumberedSection>();

  private readonly lessons = inject(LessonService);
  protected readonly progress = inject(ProgressService);

  /** Recap items store only a slug; number and title come from the episode list. */
  protected episodeFor(slug: string): { number: number; title: string } {
    const episode = this.lessons.getBySlug(slug);
    return { number: episode?.number ?? 0, title: episode?.title ?? slug };
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
