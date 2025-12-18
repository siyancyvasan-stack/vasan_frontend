import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollRun, PayrollService } from '../../../services/payroll.service';
import { CostTrendChartComponent } from './components/cost-trend-chart.component';
import { Router } from '@angular/router';
import { PayrollRunDetailsModalComponent } from './components/payroll-run-details-modal/payroll-run-details-modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-payroll-dashboard',
  standalone: true,
  templateUrl: './payroll-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, CostTrendChartComponent, PayrollRunDetailsModalComponent, NotificationComponent],
})
export class PayrollDashboardComponent {
  private payrollService = inject(PayrollService);
  private router = inject(Router);

  // Modal State
  showDetailsModal = signal(false);
  selectedRun = signal<PayrollRun | null>(null);

  // Notification State
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);

  // Data from service
  stats = this.payrollService.stats;
  payrollCostHistory = this.payrollService.getMonthlyCostHistory();

  daysUntilNextPayroll = computed(() => {
    const today = new Date();
    const nextPayrollDate = this.stats().nextPayrollDate;
    const timeDiff = nextPayrollDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  });
  
  // Search and Pagination
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = 5;

  private allRuns = this.payrollService.getRuns();

  filteredRuns = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.allRuns();
    return this.allRuns().filter(run => 
      run.id.toLowerCase().includes(query) ||
      run.date.toLocaleString().toLowerCase().includes(query)
    );
  });
  
  totalPages = computed(() => Math.ceil(this.filteredRuns().length / this.itemsPerPage));

  paginatedRuns = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredRuns().slice(start, end);
  });

  getStatusClass(status: string) {
    switch (status) {
      case 'Completed': return 'bg-cyan-100 text-cyan-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Failed': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  viewReport(run: PayrollRun): void {
    this.selectedRun.set(run);
    this.showDetailsModal.set(true);
  }

  handleCloseModal(): void {
    this.showDetailsModal.set(false);
    this.selectedRun.set(null);
    this.showNotification('Details view closed.', 'info');
  }
  
  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }

  viewAll(): void {
    // This could navigate to a more detailed history page
    console.log('Viewing all payroll runs');
    this.router.navigate(['/payroll/history']);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}