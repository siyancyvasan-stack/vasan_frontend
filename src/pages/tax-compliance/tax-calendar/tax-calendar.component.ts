
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SmartAlertsComponent, Alert } from './components/smart-alerts.component';
import { ConnectPortalModalComponent } from './components/connect-portal-modal.component';

interface TaxEvent {
  title: string;
  jurisdiction: 'Federal' | 'State - CA' | 'State - NY' | 'International';
  type: 'Income Tax' | 'Sales Tax' | 'Payroll Tax';
  status: 'Overdue' | 'Upcoming' | 'Completed';
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: TaxEvent[];
}

@Component({
  selector: 'app-tax-calendar',
  standalone: true,
  templateUrl: './tax-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SmartAlertsComponent, ConnectPortalModalComponent],
})
export class TaxCalendarComponent {
  currentDate = signal(new Date());
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Filter signals
  jurisdictionFilter = signal('All');
  taxTypeFilter = signal('All');
  statusFilter = signal('All');

  // Integrations signal
  autoRemindersEnabled = signal(true);
  showConnectPortalModal = signal(false);

  private getYesterday(): Date {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today;
  }

  private allEvents = signal<Map<string, TaxEvent[]>>(new Map([
    [this.getDateKey(this.getYesterday()), [{ title: 'VAT Return (UK)', jurisdiction: 'International', type: 'Sales Tax', status: 'Overdue' }]],
    [this.getDateKey(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 10)), [{ title: 'NY Form NYS-45 Due', jurisdiction: 'State - NY', type: 'Payroll Tax', status: 'Upcoming' }]],
    [this.getDateKey(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 15)), [{ title: 'Federal Form 941 Due', jurisdiction: 'Federal', type: 'Payroll Tax', status: 'Upcoming' }, { title: 'CA Form DE 9 Due', jurisdiction: 'State - CA', type: 'Payroll Tax', status: 'Upcoming' }]],
    [this.getDateKey(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 25)), [{ title: 'Sales Tax Filing', jurisdiction: 'State - CA', type: 'Sales Tax', status: 'Upcoming' }]],
    [this.getDateKey(new Date(this.currentDate().getFullYear(), this.currentDate().getMonth() - 1, 28)), [{ title: 'VAT Return (UK)', jurisdiction: 'International', type: 'Sales Tax', status: 'Completed' }]],
  ]));

  private filteredEvents = computed(() => {
    const newMap = new Map<string, TaxEvent[]>();
    const jFilter = this.jurisdictionFilter();
    const tFilter = this.taxTypeFilter();
    const sFilter = this.statusFilter();

    this.allEvents().forEach((events, dateKey) => {
      const filtered = events.filter(e => 
        (jFilter === 'All' || e.jurisdiction === jFilter) &&
        (tFilter === 'All' || e.type === tFilter) &&
        (sFilter === 'All' || e.status === sFilter)
      );
      if (filtered.length > 0) {
        newMap.set(dateKey, filtered);
      }
    });
    return newMap;
  });

  calendarDays = computed(() => this.generateCalendar());

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private generateCalendar(): CalendarDay[] {
    const today = new Date();
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];
    const eventsMap = this.filteredEvents();

    // Days from previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = new Date(year, month, i - firstDayOfWeek + 1);
      days.push({ date, isCurrentMonth: false, isToday: false, events: [] });
    }

    // Days of current month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = this.getDateKey(date) === this.getDateKey(today);
      const events = eventsMap.get(this.getDateKey(date)) || [];
      days.push({ date, isCurrentMonth: true, isToday, events });
    }

    // Days from next month
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, isToday: false, events: [] });
    }
    
    return days;
  }

  previousMonth(): void {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }

  nextMonth(): void {
    this.currentDate.update(d => {
      const newDate = new Date(d);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }

  goToToday(): void {
    this.currentDate.set(new Date());
  }

  getJurisdictionColor(jurisdiction: TaxEvent['jurisdiction']): string {
    switch (jurisdiction) {
      case 'Federal': return 'bg-purple-500';
      case 'State - CA': return 'bg-pink-500';
      case 'State - NY': return 'bg-sky-500';
      case 'International': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  }

  handleEventClick(event: TaxEvent, date: Date): void {
    console.log(`Calendar event clicked: "${event.title}" for jurisdiction ${event.jurisdiction}, due on ${date.toLocaleDateString()}`);
  }

  handleAlertClick(alert: Alert): void {
    console.log(`Smart Alert clicked: "${alert.title}". Filtering calendar to show relevant events.`);
    
    // Reset filters to ensure a clean slate before applying new ones
    this.jurisdictionFilter.set('All');
    this.taxTypeFilter.set('All');
    this.statusFilter.set('All');

    switch(alert.title) {
        case 'Upcoming Filings':
            this.statusFilter.set('Upcoming');
            break;
        case 'Overdue VAT Return':
            this.statusFilter.set('Overdue');
            this.taxTypeFilter.set('Sales Tax');
            this.jurisdictionFilter.set('International');
            break;
        case 'Payroll Tax (US)':
            this.statusFilter.set('Upcoming');
            this.taxTypeFilter.set('Payroll Tax');
            this.jurisdictionFilter.set('Federal');
            break;
    }
  }

  handleConnectPortal(): void {
    this.showConnectPortalModal.set(true);
  }

  toggleAutoReminders(): void {
    this.autoRemindersEnabled.update(enabled => !enabled);
    console.log(`Auto-reminders for Government Portals are now ${this.autoRemindersEnabled() ? 'ENABLED' : 'DISABLED'}.`);
  }

  handlePortalModalClose(): void {
    this.showConnectPortalModal.set(false);
  }
  
  handlePortalConnectSuccess(): void {
    this.showConnectPortalModal.set(false);
    // In a real app, a notification would be shown here.
    console.log('Portal connected successfully!');
  }
}
