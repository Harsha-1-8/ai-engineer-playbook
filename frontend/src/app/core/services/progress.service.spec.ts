import { TestBed } from '@angular/core/testing';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressService);
  });

  it('only counts first-try from the first solve', () => {
    service.completeLab('episode-3', false);
    service.completeLab('episode-3', true); // replay with known answers
    expect(service.progressFor('episode-3').labFirstTry).toBe(false);
  });

  it('records each event once', () => {
    service.recordEvent('palette');
    service.recordEvent('palette');
    expect([...service.events()]).toEqual(['palette']);
  });

  it('starts with nothing complete', () => {
    expect(service.completedCount()).toBe(0);
    expect(service.nextUp()?.slug).toBe('episode-1');
  });

  it('needs both the lab and the quiz to complete an episode', () => {
    service.completeLab('episode-1');
    expect(service.isComplete('episode-1')).toBe(false);

    service.recordQuiz('episode-1', 2);
    expect(service.isComplete('episode-1')).toBe(true);
    expect(service.nextUp()?.slug).toBe('episode-2');
  });

  it('completes the finale with just its lab (it has no quiz)', () => {
    service.completeLab('episode-8');
    expect(service.isComplete('episode-8')).toBe(true);
  });

  it('keeps the best quiz score', () => {
    service.recordQuiz('episode-2', 3);
    service.recordQuiz('episode-2', 1);
    expect(service.progressFor('episode-2').quizScore).toBe(3);
  });

  it('resets all progress', () => {
    service.completeLab('episode-8');
    service.reset();
    expect(service.completedCount()).toBe(0);
  });

  it('migrates v1 progress from storage', () => {
    localStorage.clear();
    localStorage.setItem(
      'aep.progress.v1',
      JSON.stringify({ 'episode-8': { lab: true, quizScore: null } }),
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const migrated = TestBed.inject(ProgressService);
    expect(migrated.isComplete('episode-8')).toBe(true);
  });
});
