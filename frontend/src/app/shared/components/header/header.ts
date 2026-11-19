import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressService } from '../../../core/services/progress.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CommandPaletteService } from '../../../core/services/command-palette.service';
import { BootIntroService } from '../../../core/services/boot-intro.service';

/**
 * Sticky application header: primary navigation, the command-palette trigger,
 * the light/dark toggle, and a live progress ring that pops on each completion. Kept in the header so the toggle is one tap away on
 * every page, on desktop and mobile alike.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly progress = inject(ProgressService);
  protected readonly theme = inject(ThemeService);
  protected readonly palette = inject(CommandPaletteService);
  private readonly bootIntro = inject(BootIntroService);

  /** Briefly true after an episode is completed, to animate the ring. */
  protected readonly ringPop = signal(false);
  private lastCount = this.progress.completedCount();

  protected readonly isDark = computed(() => this.theme.current() === 'dark');
  protected readonly toggleLabel = computed(() =>
    this.isDark() ? 'Switch to light theme' : 'Switch to dark theme',
  );

  constructor() {
    effect(() => {
      const count = this.progress.completedCount();
      untracked(() => {
        if (count > this.lastCount) {
          this.ringPop.set(true);
          setTimeout(() => this.ringPop.set(false), 700);
        }
        this.lastCount = count;
      });
    });
  }

  /**
   * The logo replays the Home intro (the plain "home" link doesn't).
   * Modified clicks (new tab/window) are left alone.
   */
  protected onBrandClick(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    this.bootIntro.requestReplay();
  }
}
