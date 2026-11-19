import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

const DURATION_MS = 1100;

/**
 * Counts a number up from zero the first time the element scrolls into view.
 *
 * The final value is rendered immediately (so it's correct for screen readers,
 * no-JS and reduced motion); the animation only runs when it can be seen.
 *
 * Usage: <dd [appCountUp]="50" countPrefix="~"></dd>
 */
@Directive({ selector: '[appCountUp]' })
export class CountUp implements OnDestroy {
  readonly appCountUp = input.required<number>();
  readonly countPrefix = input('');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private frame = 0;

  constructor() {
    afterNextRender(() => {
      this.render(this.appCountUp());
      const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced || typeof IntersectionObserver === 'undefined') {
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.observer?.disconnect();
            this.animate();
          }
        },
        { threshold: 0.6 },
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  private animate(): void {
    const target = this.appCountUp();
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      this.render(Math.round(target * eased));
      if (t < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  private render(value: number): void {
    this.el.nativeElement.textContent = `${this.countPrefix()}${value}`;
  }
}
