import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-dashboard',
  standalone: true,
  templateUrl: './expense-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ExpenseDashboardComponent {
  recentExpenses = [
    { date: 'Aug 01, 2024', employee: 'Charlie Brown', amount: '$75.50', status: 'Approved' },
    { date: 'July 30, 2024', employee: 'Alice Johnson', amount: '$250.00', status: 'Pending' },
    { date: 'July 29, 2024', employee: 'Bob Smith', amount: '$1,200.00', status: 'Reimbursed' },
    { date: 'July 28, 2024', employee: 'Diana Prince', amount: '$45.00', status: 'Rejected' },
    { date: 'July 27, 2024', employee: 'Ethan Hunt', amount: '$310.20', status: 'Reimbursed' },
  ];

  getStatusClass(status: string) {
    switch (status) {
      case 'Approved': return 'bg-sky-100 text-sky-800';
      case 'Pending': return 'bg-purple-100 text-purple-800';
      case 'Reimbursed': return 'bg-cyan-100 text-cyan-800';
      case 'Rejected': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}