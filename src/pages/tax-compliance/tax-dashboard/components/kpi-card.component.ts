
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card-tax',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm h-full border-t-4" [class]="borderColor()">
      <p class="text-sm font-medium text-gray-500 mb-2">{{ title() }}</p>
      
      @switch (type()) {
        @case ('deadline') {
          <div class="flex justify-between items-center">
            <div>
              <p class="text-3xl font-bold text-gray-800">{{ value() }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ subtitle() }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold" [class]="textColor()">{{ countdown() }}</p>
              <p class="text-xs text-gray-500">days left</p>
            </div>
          </div>
        }
        @case ('liability') {
          <div>
            <p class="text-3xl font-bold text-gray-800">{{ value() }}</p>
            <div class="flex items-center justify-between mt-1">
              <p class="text-xs text-gray-500">{{ subtitle() }}</p>
              <div class="flex items-center gap-1" [class.text-pink-600]="trend() === 'up'" [class.text-cyan-600]="trend() === 'down'">
                <i class="fa-solid" [class.fa-arrow-trend-up]="trend() === 'up'" [class.fa-arrow-trend-down]="trend() === 'down'"></i>
                <span class="text-xs font-bold">{{ ytdTotal() }}</span>
              </div>
            </div>
          </div>
        }
        @case ('progress') {
          <div>
            <p class="text-3xl font-bold text-gray-800">{{ value() }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ subtitle() }}</p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div class="h-2 rounded-full" [class]="bgColor()" [style.width.%]="progress()"></div>
            </div>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class KpiCardTaxComponent {
  type = input.required<'deadline' | 'liability' | 'progress'>();
  title = input.required<string>();
  value = input.required<string>();
  subtitle = input.required<string>();
  accentColor = input.required<'sky' | 'purple' | 'cyan'>();

  // Optional inputs based on type
  countdown = input<number>();
  trend = input<'up' | 'down'>();
  ytdTotal = input<string>();
  progress = input<number>();

  bgColor = () => {
    switch(this.accentColor()) {
      case 'sky': return 'bg-sky-500';
      case 'purple': return 'bg-purple-500';
      case 'cyan': return 'bg-cyan-500';
    }
  }

  borderColor = () => {
    switch(this.accentColor()) {
      case 'sky': return 'border-sky-500';
      case 'purple': return 'border-purple-500';
      case 'cyan': return 'border-cyan-500';
    }
  }

  textColor = () => {
    switch(this.accentColor()) {
      case 'sky': return 'text-sky-500';
      case 'purple': return 'text-purple-500';
      case 'cyan': return 'text-cyan-500';
    }
  }
}
