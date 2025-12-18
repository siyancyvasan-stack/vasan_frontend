import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-expenses',
  standalone: true,
  templateUrl: './my-expenses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class MyExpensesComponent {
  myExpenses = [
    { date: 'July 30, 2024', merchant: 'United Airlines', category: 'Travel', amount: '$452.10', status: 'Pending' },
    { date: 'July 29, 2024', merchant: 'The Capital Grille', category: 'Meals & Entertainment', amount: '$189.50', status: 'Approved' },
    { date: 'July 25, 2024', merchant: 'Staples', category: 'Office Supplies', amount: '$65.20', status: 'Reimbursed' },
    { date: 'July 22, 2024', merchant: 'AWS Services', category: 'Software & Subscriptions', amount: '$1,200.00', status: 'Reimbursed' },
    { date: 'July 21, 2024', merchant: 'Hotel Marriott', category: 'Travel', amount: '$350.00', status: 'Rejected' },
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