import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import confetti from 'canvas-confetti';

@Component({
  selector: 'bh-confetti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bh.confetti.component.html',
  styleUrl: './bh.confetti.component.scss'
})
export class BhConfettiComponent implements OnInit {
  @ViewChild('elem', { static: true }) divElement!: ElementRef;
  oldVisibility: boolean | null = null;
  clientX: any = 0;
  clientY: any = 0;

  ngOnInit(): void {
    const rect = this.divElement.nativeElement.getBoundingClientRect();
    this.clientX = rect.left;
    this.clientY = rect.top;
    this.getConfettin(rect.left, rect.top);
  }

  getConfettin(x, y): void {
    this.placeConfetti(x, y);
    // this.placeConfetti(x + 200, y);
    // this.placeConfetti(x + 400, y);
  }

  // Place confetti at specific location
  placeConfetti(x: number, y: number, angle = 90, particleCount = 100): void {
    const { innerWidth: width, innerHeight: height } = window;
    const origin = { x: x / width, y: y / height };
    confetti({ origin, angle, particleCount, spread: 360 });
  }

  // Start confetti animation
  startConfettiAnimation(): void {
    const duration = 30 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }
}
