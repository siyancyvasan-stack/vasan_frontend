import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  count?: number;
  title: string;
  subtitle: string;
  urgency: 'overdue' | 'upcoming';
}

@Component({
  selector: 'app-smart-alerts',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Smart Alerts</h3>
      <div class="space-y-4">
        @for(alert of alerts; track alert.title; let i = $index) {
          <div (click)="onAlertClick(alert)" 
               [class]="'flex items-center p-3 rounded-lg transition-colors group cursor-pointer ' + (i === 0 ? 'bg-gray-50/75 hover:bg-gray-100' : 'hover:bg-gray-50')">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" [class]="getUrgencyBgClass(alert.urgency)">
              @if(alert.count) {
                <span class="text-lg font-bold" [class]="getUrgencyTextClass(alert.urgency)">{{ alert.count }}</span>
              } @else {
                <i class="fa-solid fa-file-lines" [class]="getUrgencyTextClass(alert.urgency)"></i>
              }
            </div>
            <div class="ml-4 flex-grow">
              <p class="font-semibold text-gray-800">{{ alert.title }}</p>
              <p class="text-sm text-gray-500">{{ alert.subtitle }}</p>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-400 group-hover:text-gray-600 transition-colors"></i>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class SmartAlertsComponent {
  alertClicked = output<Alert>();

  alerts: Alert[] = [
    { count: 3, title: 'Upcoming Filings', subtitle: 'due in the next few days', urgency: 'upcoming' },
    { count: 1, title: 'Overdue VAT Return', subtitle: '(UK) - was due yesterday', urgency: 'overdue' },
    { title: 'Payroll Tax (US)', subtitle: 'due next week', urgency: 'upcoming' },
  ];

  getUrgencyBgClass(urgency: Alert['urgency']): string {
    return urgency === 'overdue' ? 'bg-pink-100' : 'bg-purple-100';
  }

  getUrgencyTextClass(urgency: Alert['urgency']): string {
    return urgency === 'overdue' ? 'text-pink-600' : 'text-purple-600';
  }

  onAlertClick(alert: Alert): void {
    this.alertClicked.emit(alert);
  }
}