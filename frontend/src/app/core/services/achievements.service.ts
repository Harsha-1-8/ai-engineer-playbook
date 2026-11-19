import { Injectable, computed, effect, inject, untracked } from '@angular/core';
import { ACHIEVEMENTS, Achievement, AchievementContext } from '../../content/achievements';
import { CelebrationService } from './celebration.service';
import { LessonService } from './lesson.service';
import { ProgressService } from './progress.service';

export interface AchievementView extends Achievement {
  unlockedAt: string | null;
}

/**
 * Derives achievement state from progress and announces new unlocks.
 *
 * Achievements are pure functions of an `AchievementContext` computed from
 * ProgressService, so there is no separate bookkeeping to drift out of sync.
 * Unlock timestamps are persisted through ProgressService.
 */
@Injectable({ providedIn: 'root' })
export class AchievementsService {
  private readonly progress = inject(ProgressService);
  private readonly lessons = inject(LessonService);
  private readonly celebration = inject(CelebrationService);

  private readonly context = computed<AchievementContext>(() => {
    const episodes = this.progress.episodes();
    const withQuiz = this.lessons.getAll().filter((e) => this.lessons.getQuiz(e.slug).length);
    return {
      completed: this.progress.completedCount(),
      total: this.progress.totalCount,
      labsSolved: Object.values(episodes).filter((e) => e.lab).length,
      flawlessLabs: Object.values(episodes).filter((e) => e.lab && e.labFirstTry).length,
      perfectQuizzes: withQuiz.filter(
        (e) => episodes[e.slug]?.quizScore === this.lessons.getQuiz(e.slug).length,
      ).length,
      quizzes: withQuiz.length,
      events: this.progress.events(),
    };
  });

  readonly all = computed<AchievementView[]>(() => {
    const unlocked = this.progress.unlocked();
    return ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: unlocked[a.id] ?? null }));
  });

  readonly unlockedCount = computed(() => this.all().filter((a) => a.unlockedAt).length);
  readonly total = ACHIEVEMENTS.length;

  constructor() {
    effect(() => {
      const ctx = this.context();
      untracked(() => {
        const unlocked = this.progress.unlocked();
        for (const achievement of ACHIEVEMENTS) {
          if (!unlocked[achievement.id] && achievement.check(ctx)) {
            this.progress.unlock(achievement.id);
            this.celebration.toast({
              icon: achievement.icon,
              title: 'achievement unlocked',
              detail: achievement.title,
              tone: 'gold',
            });
          }
        }
      });
    });
  }
}
