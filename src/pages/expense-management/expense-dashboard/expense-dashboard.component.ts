
import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSpendChartComponent } from './components/total-spend-chart.component.ts';
import { ExpenseBarChartComponent } from './components/expense-bar-chart.component.ts';
import { ExpensePieChartComponent } from './components/expense-pie-chart.component.ts';
import { Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { PolicyViolationsModalComponent } from './components/policy-violations-modal.component';
import { ExpenseDetailsModalComponent } from './components/expense-details-modal.component';

// Make interface exportable for the modal
export interface RecentClaim {
  id: number; // Add ID for tracking
  date: string;
  merchant: string;
  category: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-expense-dashboard',
  standalone: true,
  templateUrl: './expense-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TotalSpendChartComponent, ExpenseBarChartComponent, ExpensePieChartComponent, PolicyViolationsModalComponent, ExpenseDetailsModalComponent]
})
export class ExpenseDashboardComponent {
  private router = inject(Router);
  private expenseService = inject(ExpenseService);

  // Modal State
  showViolationsModal = signal(false);
  showDetailsModal = signal(false);
  selectedClaim = signal<RecentClaim | null>(null);
  
  // KPI Data
  pendingExpenses = signal({ count: 7, amount: 56800 });
  totalMonthlySpend = signal(145000);
  policyViolations = signal(2);

  // Recent Claims Data
  recentClaims = computed(() => {
    return this.expenseService.getExpenses()
      .slice(0, 5) // Get latest 5
      .map(claim => ({
        id: claim.id,
        date: new Date(claim.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        merchant: claim.merchant,
        category: claim.category,
        amount: claim.amount ?? 0,
        status: claim.status
      }));
  });
  
  // Chart Data
  totalSpendChartData = signal([12, 19, 3, 5, 2, 3, 9, 15, 12, 18, 22, 20]);
  expenseBarChartData = signal([
    { label: 'Jan', value: 65 }, { label: 'Feb', value: 59 }, { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 }, { label: 'May', value: 56 }, { label: 'Jun', value: 55 }
  ]);
  expensePieChartData = signal([
    { label: 'Travel', value: 45, color: '#38bdf8' }, // sky blue
    { label: 'Food', value: 25, color: '#ec4899' }, // pink
    { label: 'Software', value: 20, color: '#a855f7' }, // purple
    { label: 'Other', value: 10, color: '#22d3ee' } // cyan
  ]);

  getStatusClass(status: RecentClaim['status']) {
    switch (status) {
      case 'Approved': return 'bg-cyan-100 text-cyan-800';
      case 'Pending': return 'bg-purple-100 text-purple-800';
      case 'Rejected': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  // --- Action Handlers ---
  onNewExpense() {
    this.expenseService.setExpenseToEdit(null); // Clear any previous edit state
    this.router.navigate(['/expense-management/submit']);
  }
  
  onViewViolations() {
    this.showViolationsModal.set(true);
  }

  onViewClaim(claim: RecentClaim) {
    this.selectedClaim.set(claim);
    this.showDetailsModal.set(true);
  }

  onEditClaim(claim: RecentClaim) {
    const fullClaim = this.expenseService.getExpenseById(claim.id);
    if (fullClaim) {
      this.expenseService.setExpenseToEdit(fullClaim);
      this.router.navigate(['/expense-management/submit']);
    } else {
      // This should no longer be hit for claims displayed on the dashboard
      console.error(`Cannot edit claim. Full data for claim ID ${claim.id} not found.`);
    }
  }

  closeModals() {
    this.showViolationsModal.set(false);
    this.showDetailsModal.set(false);
    this.selectedClaim.set(null);
  }
}