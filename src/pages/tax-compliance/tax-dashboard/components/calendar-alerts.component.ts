import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Deadline {
  date: string;
  title: string;
  urgency: 'urgent' | 'upcoming' | 'completed';
}

@Component({
  selector: 'app-compliance-calendar-alerts',
  standalone: true,
  template: `
    <div class="space-y-3">
      @for(deadline of deadlines; track deadline.title) {
        <div class="flex items-center p-3 rounded-lg" [class]="getUrgencyBgClass(deadline.urgency)">
          <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" [class]="getUrgencyIconBgClass(deadline.urgency)">
            <i class="fa-solid" [class]="getUrgencyIcon(deadline.urgency)" [class]="getUrgencyIconColor(deadline.urgency)"></i>
          </div>
          <div class="ml-4 flex-grow">
            <p class="font-semibold text-gray-800">{{ deadline.title }}</p>
          </div>
          <div class="text-sm font-medium text-gray-600">{{ deadline.date }}</div>
        </div>
      }
       <a href="#" class="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors">
        View Full Calendar <i class="fa-solid fa-arrow-right ml-2"></i>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ComplianceCalendarAlertsComponent {
  deadlines: Deadline[] = [
    { date: 'Oct 15', title: 'VAT Return (UK) - Due Soon', urgency: 'urgent' },
    { date: 'Oct 31', title: 'Payroll Tax (US) - Upcoming', urgency: 'upcoming' },
    { date: 'Nov 05', title: 'GST Filing (India)', urgency: 'upcoming' },
    { date: 'Sep 30', title: 'Corp Tax (DE) - Filed', urgency: 'completed' },
  ];

  getUrgencyBgClass(urgency: string): string {
    switch (urgency) {
      case 'urgent': return 'bg-pink-50';
      case 'upcoming': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  }

  getUrgencyIconBgClass(urgency: string): string {
    switch (urgency) {
      case 'urgent': return 'bg-pink-100';
      case 'upcoming': return 'bg-purple-100';
      default: return 'bg-gray-200';
    }
  }

  getUrgencyIconColor(urgency: string): string {
    switch (urgency) {
      case 'urgent': return 'text-pink-600';
      case 'upcoming': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  }

  getUrgencyIcon(urgency: string): string {
    switch (urgency) {
      case 'urgent': return 'fa-exclamation';
      case 'upcoming': return 'fa-calendar-day';
      default: return 'fa-check';
    }
  }
}