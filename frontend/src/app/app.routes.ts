import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LearningJourney } from './pages/learning-journey/learning-journey';
import { EpisodeDetail } from './pages/episode-detail/episode-detail';
import { LessonService } from './core/services/lesson.service';

const SITE = 'The AI Engineer Playbook';

/** Gives each episode page its own browser-tab title, e.g. "EP 03 · The Model Mismatch". */
const episodeTitle: ResolveFn<string> = (route) => {
  const episode = inject(LessonService).getBySlug(route.paramMap.get('slug') ?? '');
  return episode
    ? `EP ${String(episode.number).padStart(2, '0')} · ${episode.title} | ${SITE}`
    : `Episode not found | ${SITE}`;
};

export const routes: Routes = [
  { path: '', component: Home, title: SITE },
  { path: 'journey', component: LearningJourney, title: `Learning Journey | ${SITE}` },
  { path: 'episodes/:slug', component: EpisodeDetail, title: episodeTitle },
  { path: '**', redirectTo: '' },
];
