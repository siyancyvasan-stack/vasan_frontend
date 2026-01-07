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
  // Updated data to match screenshot
  deadline = new Date('2025-12-27T00:00:00');
  daysUntilDeadline = -10; // Hardcoded to match screenshot

  searchQuery = signal('');
  statusFilter = signal('All');

  allFilings: RecentFiling[] = [
    { form: 'Form 941', jurisdiction: 'Federal (IRS)', period: 'Q2 2024', submitted: '2026-01-11', status: 'Processing' },
    { form: 'Form 940', jurisdiction: 'Federal (IRS)', period: 'Q2 2024', submitted: '2026-01-04', status: 'Pending' },
    { form: 'GST Filing (India)', jurisdiction: 'Sri Lanka IRD', period: 'Q2 2024', submitted: '2026-01-03', status: 'Pending' },
    { form: 'Payroll Tax (US)', jurisdiction: 'Federal (IRS)', period: 'Q2 2024', submitted: '2026-01-05', status: 'Pending' },
    { form: 'VAT Return (UK)', jurisdiction: 'UK HMRC', period: 'Q2 2024', submitted: '2025-12-27', status: 'Pending' },
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
