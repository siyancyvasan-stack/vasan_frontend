
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService, ExpenseClaim } from '../../../services/expense.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-expenses',
  standalone: true,
  templateUrl: './my-expenses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class MyExpensesComponent {
  private expenseService = inject(ExpenseService);
  private authService = inject(AuthService);

  // --- State Signals for Filtering ---
  searchQuery = signal('');
  statusFilter = signal('All');
  yearFilter = signal('All');

  myExpenses = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];
    
    return this.expenseService.getExpenses().filter(
        claim => claim.employeeName === currentUser.name
    );
  });

  // --- Computed Signals ---
  availableYears = computed(() => {
    const years = this.myExpenses().map(exp => new Date(exp.date).getFullYear());
    const uniqueSortedYears = Array.from(new Set(years)).sort((a: number, b: number) => b - a);
    return ['All', ...uniqueSortedYears.map(String)];
  });

  filteredExpenses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const year = this.yearFilter();

    return this.myExpenses().filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear().toString();

      const matchesQuery = query === '' || expense.merchant.toLowerCase().includes(query);
      const matchesStatus = status === 'All' || expense.status === status;
      const matchesYear = year === 'All' || expenseYear === year;

      return matchesQuery && matchesStatus && matchesYear;
    });
  });

  // --- UI Methods ---
  getStatusClass(status: string) {
    switch (status) {
      case 'Approved': return 'bg-sky-100 text-sky-800';
      case 'Pending': return 'bg-purple-100 text-purple-800';
      case 'Reimbursed': return 'bg-cyan-100 text-cyan-800';
      case 'Rejected': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // --- Action Methods ---
  onDownload(expense: ExpenseClaim) {
    const content = `
      Expense Receipt
      -----------------
      ID: ${expense.id}
      Date: ${expense.date}
      Merchant: ${expense.merchant}
      Category: ${expense.category}
      Amount: ${expense.amount} ${expense.currency}
      Status: ${expense.status}
    `;
    const blob = new Blob([content.trim()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-${expense.id}-${expense.merchant.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}