import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { Celebration } from './shared/components/celebration/celebration';
import { CommandPalette } from './shared/components/command-palette/command-palette';
import { AchievementsService } from './core/services/achievements.service';
import { EasterEggService } from './core/services/easter-egg.service';

/**
 * Application shell: header, routed content, footer, plus the app-wide
 * overlays (command palette, toasts/confetti).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Celebration, CommandPalette],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Start app-wide listeners that no template references directly:
    // achievement unlock detection and the keyboard easter egg.
    inject(AchievementsService);
    inject(EasterEggService);
  }
}
