import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommandPaletteService } from '../../../core/services/command-palette.service';
import { EasterEggService } from '../../../core/services/easter-egg.service';
import { LessonService } from '../../../core/services/lesson.service';
import { ProgressService } from '../../../core/services/progress.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LAB_NAMES } from '../../../content/lessons/lab-names';

interface Command {
  id: string;
  group: string;
  icon: string;
  label: string;
  hint?: string;
  /** Extra words that match when searching. */
  keywords: string;
  run: () => void;
}

/**
 * VS Code–style command palette: fuzzy search over episodes, pages and
 * actions, fully keyboard driven. Built on the native <dialog> element, which
 * provides focus trapping, Esc-to-close and a backdrop for free.
 */
@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
})
export class CommandPalette {
  protected readonly palette = inject(CommandPaletteService);
  private readonly router = inject(Router);
  private readonly lessons = inject(LessonService);
  private readonly progress = inject(ProgressService);
  private readonly theme = inject(ThemeService);
  private readonly egg = inject(EasterEggService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly query = signal('');
  protected readonly active = signal(0);

  private readonly commands = computed<Command[]>(() => {
    const next = this.progress.nextUp();
    const list: Command[] = [];

    if (next) {
      list.push({
        id: 'continue',
        group: 'Continue',
        icon: '▶',
        label: `Continue: ${next.title}`,
        hint: `EP ${pad(next.number)}`,
        keywords: 'resume next continue',
        run: () => this.go(['/episodes', next.slug]),
      });
    }

    for (const ep of this.lessons.getAll()) {
      list.push({
        id: ep.slug,
        group: 'Episodes',
        icon: this.progress.isComplete(ep.slug) ? '✓' : '#',
        label: ep.title,
        hint: ep.finale ? 'FINALE' : `EP ${pad(ep.number)}`,
        keywords: `${ep.summary} ${ep.lab ? LAB_NAMES[ep.lab] : ''} episode ${ep.number}`,
        run: () => this.go(['/episodes', ep.slug]),
      });
    }

    list.push(
      {
        id: 'home',
        group: 'Go to',
        icon: '⌂',
        label: 'Home',
        keywords: 'start landing',
        run: () => this.go(['/']),
      },
      {
        id: 'journey',
        group: 'Go to',
        icon: '↯',
        label: 'Learning Journey',
        keywords: 'timeline progress episodes list',
        run: () => this.go(['/journey']),
      },
      {
        id: 'trophies',
        group: 'Go to',
        icon: '🏆',
        label: 'Achievements',
        keywords: 'trophies badges unlocks',
        run: () => this.go(['/journey'], 'achievements'),
      },
      {
        id: 'theme',
        group: 'Actions',
        icon: this.theme.current() === 'dark' ? '☀' : '☾',
        label: `Switch to ${this.theme.current() === 'dark' ? 'light' : 'dark'} theme`,
        keywords: 'theme dark light mode appearance colour color',
        run: () => this.theme.toggle(),
      },
      {
        id: 'source',
        group: 'Actions',
        icon: '↗',
        label: 'View source on GitHub',
        keywords: 'github code repo repository',
        run: () =>
          globalThis.open(
            'https://github.com/harsha-1-8/ai-engineer-playbook',
            '_blank',
            'noopener',
          ),
      },
    );
    return list;
  });

  protected readonly results = computed<Command[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (q === 'sudo') {
      return [
        {
          id: 'sudo',
          group: 'Secret',
          icon: '🔓',
          label: 'sudo make me a sandwich',
          keywords: '',
          run: () => this.egg.trigger(),
        },
      ];
    }
    if (!q) {
      return this.commands();
    }
    return this.commands()
      .map((cmd) => ({ cmd, score: score(q, cmd) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.cmd);
  });

  constructor() {
    // Mirror the service's open state onto the native dialog.
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.palette.isOpen() && !dialog.open) {
        this.query.set('');
        this.active.set(0);
        dialog.showModal();
        this.input().nativeElement.focus();
      } else if (!this.palette.isOpen() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.active.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.results().length;
    if (!count) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.setActive((this.active() + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.setActive((this.active() - 1 + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.run(this.results()[this.active()]);
    }
  }

  protected setActive(index: number): void {
    this.active.set(index);
    globalThis.document?.getElementById(`cmd-${index}`)?.scrollIntoView({ block: 'nearest' });
  }

  protected run(cmd: Command | undefined): void {
    if (!cmd) {
      return;
    }
    this.palette.close();
    cmd.run();
  }

  /** Closing via Esc fires the dialog's native "close" event. */
  protected onDialogClose(): void {
    this.palette.close();
  }

  /** A click on the backdrop lands on the <dialog> element itself. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.palette.close();
    }
  }

  /** Show a group heading above the first result of each group. */
  protected showGroup(index: number): boolean {
    const list = this.results();
    return index === 0 || list[index].group !== list[index - 1].group;
  }

  private go(commands: unknown[], fragment?: string): void {
    void this.router.navigate(commands, fragment ? { fragment } : undefined);
  }
}

/**
 * Tiny fuzzy scorer: a substring hit in the label scores highest (earlier is
 * better), then a substring in the keywords, then an in-order character match.
 */
function score(q: string, cmd: Command): number {
  const label = cmd.label.toLowerCase();
  const labelHit = label.indexOf(q);
  if (labelHit !== -1) {
    return 100 - labelHit;
  }
  const haystack = `${label} ${cmd.hint ?? ''} ${cmd.keywords}`.toLowerCase();
  if (haystack.includes(q)) {
    return 40;
  }
  let pos = 0;
  for (const char of q) {
    pos = label.indexOf(char, pos);
    if (pos === -1) {
      return 0;
    }
    pos++;
  }
  return 10;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
