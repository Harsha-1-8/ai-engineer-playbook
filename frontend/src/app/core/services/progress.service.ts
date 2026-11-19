import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { LessonService } from './lesson.service';

/** Progress for a single episode. */
export interface EpisodeProgress {
  /** The interactive lab was solved. */
  lab: boolean;
  /** The lab's first solve had no failed attempts. */
  labFirstTry: boolean;
  /** Best quiz score, or null if the quiz has not been taken. */
  quizScore: number | null;
}

interface ProgressState {
  episodes: Record<string, EpisodeProgress>;
  /** One-off events that feed achievements, e.g. "palette" or "theme-light". */
  events: string[];
  /** Achievement id → ISO timestamp of when it was unlocked. */
  achievements: Record<string, string>;
}

const STORAGE_KEY = 'aep.progress.v2';
const LEGACY_KEY = 'aep.progress.v1';
const EMPTY: EpisodeProgress = { lab: false, labFirstTry: false, quizScore: null };
const EMPTY_STATE: ProgressState = { episodes: {}, events: [], achievements: {} };

/**
 * Tracks the learner's progress with signals and keeps it in localStorage,
 * so it survives reloads without any backend.
 *
 * An episode counts as complete when its lab is solved and its quiz (if it
 * has one) has been taken.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly lessons = inject(LessonService);
  private readonly state = signal<ProgressState>(readStorage());

  /** Slugs of all completed episodes. */
  readonly completedSlugs = computed(() =>
    this.lessons
      .getAll()
      .filter((episode) => this.isCompleteIn(this.state(), episode.slug))
      .map((episode) => episode.slug),
  );

  readonly completedCount = computed(() => this.completedSlugs().length);
  readonly totalCount = this.lessons.getAll().length;
  readonly percent = computed(() => Math.round((this.completedCount() / this.totalCount) * 100));

  /** The first episode not yet completed, for "continue where you left off". */
  readonly nextUp = computed(() => {
    const done = new Set(this.completedSlugs());
    return this.lessons.getAll().find((episode) => !done.has(episode.slug));
  });

  readonly episodes = computed(() => this.state().episodes);
  readonly events = computed(() => new Set(this.state().events));
  readonly unlocked = computed(() => this.state().achievements);

  constructor() {
    effect(() => writeStorage(this.state()));
  }

  /** Progress for one episode (reactive when read inside a template/computed). */
  progressFor(slug: string): EpisodeProgress {
    return this.state().episodes[slug] ?? EMPTY;
  }

  isComplete(slug: string): boolean {
    return this.isCompleteIn(this.state(), slug);
  }

  completeLab(slug: string, firstTry = false): void {
    const before = this.progressFor(slug);
    // Only the first solve can count as first-try; replays know the answers.
    this.patch(slug, { lab: true, labFirstTry: before.lab ? before.labFirstTry : firstTry });
    const hour = new Date().getHours();
    if (hour < 5) {
      this.recordEvent('night-owl');
    }
  }

  recordQuiz(slug: string, score: number): void {
    const best = Math.max(score, this.progressFor(slug).quizScore ?? 0);
    this.patch(slug, { quizScore: best });
  }

  recordEvent(name: string): void {
    if (this.state().events.includes(name)) {
      return;
    }
    this.state.update((s) => ({ ...s, events: [...s.events, name] }));
  }

  unlock(achievementId: string): void {
    if (this.state().achievements[achievementId]) {
      return;
    }
    this.state.update((s) => ({
      ...s,
      achievements: { ...s.achievements, [achievementId]: new Date().toISOString() },
    }));
  }

  /** Wipes everything, including achievements. */
  reset(): void {
    this.state.set(EMPTY_STATE);
  }

  private isCompleteIn(state: ProgressState, slug: string): boolean {
    const progress = state.episodes[slug] ?? EMPTY;
    const needsQuiz = this.lessons.getQuiz(slug).length > 0;
    return progress.lab && (!needsQuiz || progress.quizScore !== null);
  }

  private patch(slug: string, change: Partial<EpisodeProgress>): void {
    this.state.update((s) => ({
      ...s,
      episodes: { ...s.episodes, [slug]: { ...(s.episodes[slug] ?? EMPTY), ...change } },
    }));
  }
}

function readStorage(): ProgressState {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw) {
      return { ...EMPTY_STATE, ...(JSON.parse(raw) as Partial<ProgressState>) };
    }
    // Migrate v1, which stored only the per-episode map.
    const legacy = globalThis.localStorage?.getItem(LEGACY_KEY);
    if (legacy) {
      const episodes = JSON.parse(legacy) as Record<string, Partial<EpisodeProgress>>;
      const migrated: Record<string, EpisodeProgress> = {};
      for (const [slug, progress] of Object.entries(episodes)) {
        migrated[slug] = { ...EMPTY, ...progress };
      }
      return { ...EMPTY_STATE, episodes: migrated };
    }
  } catch {
    // Corrupt or unavailable storage: start fresh.
  }
  return EMPTY_STATE;
}

function writeStorage(state: ProgressState): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, quota); progress then lives in memory only.
  }
}
