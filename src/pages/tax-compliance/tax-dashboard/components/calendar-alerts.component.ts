import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Deadline {
  date: string;
  title: string;
  selected?: boolean;
}

@Component({
  selector: 'app-compliance-calendar-alerts',
  standalone: true,
  template: `
    <div class="space-y-3">
      @for(deadline of deadlines; track deadline.title) {
        <div 
          class="flex items-center p-3 rounded-lg transition-colors cursor-pointer"
          [class.bg-gray-800]="deadline.selected"
          [class.text-white]="deadline.selected"
          [class.bg-purple-50]="!deadline.selected"
          [class.hover:bg-purple-100]="!deadline.selected">
          <div 
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            [class.bg-gray-600]="deadline.selected"
            [class.bg-purple-200]="!deadline.selected">
          </div>
          <div class="ml-4 flex-grow">
            <p class="font-semibold" [class.text-white]="deadline.selected" [class.text-gray-800]="!deadline.selected">{{ deadline.title }}</p>
          </div>
          <div class="text-sm font-medium" [class.text-gray-300]="deadline.selected" [class.text-gray-600]="!deadline.selected">{{ deadline.date }}</div>
        </div>
      }
       <a routerLink="/tax-compliance/calendar" class="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors mt-2">
        View Full Calendar <i class="fa-solid fa-arrow-right ml-2"></i>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class ComplianceCalendarAlertsComponent {
  deadlines: Deadline[] = [
    { date: '2025-12-27', title: 'VAT Return (UK)' },
    { date: '2026-01-03', title: 'GST Filing (India)' },
    { date: '2026-01-04', title: 'Form 940', selected: true },
    { date: '2026-01-05', title: 'Payroll Tax (US)' },
  ];
}
