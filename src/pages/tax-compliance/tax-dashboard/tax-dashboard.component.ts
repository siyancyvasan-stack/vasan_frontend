import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KpiCardTaxComponent } from './components/kpi-card.component';
import { TaxLiabilityChartComponent } from './components/liability-chart.component';
import { ComplianceCalendarAlertsComponent } from './components/calendar-alerts.component';

interface RecentFiling {
  form: string;
  jurisdiction: string;
  period: string;
  submitted: string;
  status: 'Submitted' | 'Processing' | 'Pending';
}

@Component({
  selector: 'app-tax-dashboard',
  standalone: true,
  templateUrl: './tax-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CommonModule,
    KpiCardTaxComponent,
    TaxLiabilityChartComponent,
    ComplianceCalendarAlertsComponent
  ]
})
export class TaxDashboardComponent {
  deadline = new Date('2024-08-31');
  daysUntilDeadline = Math.ceil((this.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  searchQuery = signal('');
  statusFilter = signal('All');

  allFilings: RecentFiling[] = [
    { form: 'Form 941', jurisdiction: 'Federal (IRS)', period: 'Q2 2024', submitted: 'July 15, 2024', status: 'Submitted' },
    { form: 'CA Form DE 9', jurisdiction: 'California (EDD)', period: 'Q2 2024', submitted: 'July 12, 2024', status: 'Submitted' },
    { form: 'NY Form NYS-45', jurisdiction: 'New York (DTF)', period: 'Q2 2024', submitted: 'July 10, 2024', status: 'Processing' },
    { form: 'Corp Tax', jurisdiction: 'Germany', period: '2023', submitted: 'July 5, 2024', status: 'Processing' },
    { form: 'Sales Tax', jurisdiction: 'California', period: 'Sep \'23', submitted: 'June 28, 2024', status: 'Pending' },
    { form: 'Form 1120', jurisdiction: 'Federal (IRS)', period: 'Annual 2023', submitted: 'April 15, 2024', status: 'Submitted' },
  ];

  filteredFilings = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    return this.allFilings.filter(filing => {
      const matchesQuery = filing.form.toLowerCase().includes(query) ||
                           filing.jurisdiction.toLowerCase().includes(query);
      const matchesStatus = status === 'All' || filing.status === status;
      return matchesQuery && matchesStatus;
    });
  });

  getStatusClass(status: string) {
    switch (status) {
      case 'Submitted': return 'bg-cyan-100 text-cyan-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  handleAlertClick(alertTitle: string): void {
    console.log(`Alert clicked: "${alertTitle}". Taking appropriate action.`);
  }
}