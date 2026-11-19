import { Injectable } from '@angular/core';
import { episodes } from '../../content/lessons/episodes';
import { quizzes } from '../../content/lessons/quizzes';
import { Episode, QuizQuestion } from '../../content/lessons/episode.model';

/**
 * Read-only access to the local, typed lesson content.
 *
 * Pages consume this stable API rather than importing the data directly, so
 * the data source can be swapped (e.g. for HTTP) in a single place.
 */
@Injectable({ providedIn: 'root' })
export class LessonService {
  /** All episodes in series order. */
  getAll(): Episode[] {
    return episodes;
  }

  /** Look up a single episode by its routing slug. */
  getBySlug(slug: string): Episode | undefined {
    return episodes.find((episode) => episode.slug === slug);
  }

  /** The episode `offset` positions away from `slug` (e.g. -1 / +1). */
  getAdjacent(slug: string, offset: number): Episode | undefined {
    const index = episodes.findIndex((episode) => episode.slug === slug);
    return index === -1 ? undefined : episodes[index + offset];
  }

  /** The knowledge-check questions for an episode (empty if none). */
  getQuiz(slug: string): QuizQuestion[] {
    return quizzes[slug] ?? [];
  }
}
