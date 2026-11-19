import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountUp } from '../../shared/directives/count-up';
import { BootIntro } from './boot-intro/boot-intro';
import { LessonService } from '../../core/services/lesson.service';
import { ProgressService } from '../../core/services/progress.service';
import { LAB_NAMES } from '../../content/lessons/lab-names';
import { LabKind } from '../../content/lessons/episode.model';

/** Landing page: hook, origin story, the full series, and how it works. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, CountUp, BootIntro],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly lessons = inject(LessonService);
  protected readonly progress = inject(ProgressService);

  protected readonly episodes = this.lessons.getAll();

  protected readonly stats: { value: number; prefix?: string; label: string }[] = [
    { value: this.episodes.length, label: 'episodes' },
    { value: this.episodes.filter((e) => e.lab).length, label: 'hands-on labs' },
    {
      value: this.episodes.reduce((n, e) => n + this.lessons.getQuiz(e.slug).length, 0),
      label: 'quiz questions',
    },
    {
      value: this.episodes.reduce((n, e) => n + (e.durationMinutes ?? 0), 0),
      prefix: '~',
      label: 'minutes, end to end',
    },
  ];

  /** Primary CTA: start at the beginning, or pick up where the learner left off. */
  protected readonly cta = computed(() => {
    const next = this.progress.nextUp();
    if (!next) {
      return { label: 'replay the finale', slug: this.episodes[this.episodes.length - 1].slug };
    }
    return this.progress.completedCount() === 0
      ? { label: 'start episode 01', slug: next.slug }
      : { label: `continue · EP ${this.pad(next.number)}`, slug: next.slug };
  });

  protected labName(kind: LabKind | undefined): string {
    return kind ? LAB_NAMES[kind] : '';
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
