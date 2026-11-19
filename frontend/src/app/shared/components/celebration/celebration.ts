import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { BurstSize, CelebrationService } from '../../../core/services/celebration.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  shape: 'rect' | 'circle';
  life: number;
}

const GRAVITY = 0.32;
const DRAG = 0.985;

/**
 * Overlay for toasts and confetti. A lightweight canvas particle system
 * (no dependencies), coloured from the active theme's CSS variables.
 * Confetti is skipped when the visitor prefers reduced motion.
 */
@Component({
  selector: 'app-celebration',
  templateUrl: './celebration.html',
  styleUrl: './celebration.scss',
})
export class Celebration implements OnDestroy {
  protected readonly celebration = inject(CelebrationService);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private particles: Particle[] = [];
  private frame = 0;

  constructor() {
    effect(() => {
      const burst = this.celebration.lastBurst();
      if (burst) {
        untracked(() => this.fire(burst.size));
      }
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }

  private fire(size: BurstSize): void {
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const canvas = this.canvas().nativeElement;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = this.palette();
    const count = size === 'big' ? 220 : 110;
    // Big bursts fire from both bottom corners; small ones from the centre top.
    const origins =
      size === 'big'
        ? [
            { x: 0, y: innerHeight, angle: -Math.PI / 3 },
            { x: innerWidth, y: innerHeight, angle: (-2 * Math.PI) / 3 },
          ]
        : [{ x: innerWidth / 2, y: innerHeight * 0.35, angle: -Math.PI / 2 }];

    for (let i = 0; i < count; i++) {
      const origin = origins[i % origins.length];
      const spread = size === 'big' ? 0.55 : Math.PI;
      const angle = origin.angle + (Math.random() - 0.5) * spread;
      const speed = (size === 'big' ? 14 : 9) + Math.random() * 7;
      this.particles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        color: colors[i % colors.length],
        shape: Math.random() > 0.35 ? 'rect' : 'circle',
        life: 1,
      });
    }

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const p of this.particles) {
      p.vx *= DRAG;
      p.vy = p.vy * DRAG + GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life -= 0.006;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    this.particles = this.particles.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    if (this.particles.length) {
      this.frame = requestAnimationFrame(() => this.tick());
    } else {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  /** Confetti colours follow the current theme. */
  private palette(): string[] {
    const style = getComputedStyle(document.documentElement);
    return ['--accent', '--violet', '--sky', '--amber', '--rose']
      .map((name) => style.getPropertyValue(name).trim())
      .filter(Boolean);
  }
}
