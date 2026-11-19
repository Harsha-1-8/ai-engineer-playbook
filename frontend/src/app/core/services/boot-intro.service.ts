import { Injectable, signal } from '@angular/core';

/**
 * Lets other parts of the app ask the Home boot intro to play again
 * (e.g. clicking the logo). A pending flag rather than an event, so the
 * request survives navigating to Home before the intro component exists.
 */
@Injectable({ providedIn: 'root' })
export class BootIntroService {
  readonly replayPending = signal(false);

  requestReplay(): void {
    this.replayPending.set(true);
  }
}
