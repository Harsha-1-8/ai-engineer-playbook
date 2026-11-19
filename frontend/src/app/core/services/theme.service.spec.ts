import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('toggles between dark and light and applies it to <html>', () => {
    const service = TestBed.inject(ThemeService);
    const next = service.current() === 'dark' ? 'light' : 'dark';

    service.toggle();
    TestBed.tick();

    expect(service.current()).toBe(next);
    expect(document.documentElement.dataset['theme']).toBe(next);
  });

  it('remembers an explicit choice', () => {
    TestBed.inject(ThemeService).set('light');
    expect(localStorage.getItem('aep.theme')).toBe('light');
  });
});
