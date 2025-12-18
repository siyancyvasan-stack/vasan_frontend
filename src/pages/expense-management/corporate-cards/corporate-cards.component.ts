import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-corporate-cards',
  standalone: true,
  templateUrl: './corporate-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class CorporateCardsComponent {
  cards = [
    { name: 'Alice Johnson', last4: '...1234', type: 'Visa' },
    { name: 'Bob Smith', last4: '...5678', type: 'Mastercard' },
  ];

  transactions = [
    { date: 'Aug 02, 2024', card: '...1234', merchant: 'Delta Airlines', amount: '$543.21', status: 'Unreconciled' },
    { date: 'Aug 01, 2024', card: '...5678', merchant: 'Slack', amount: '$25.00', status: 'Reconciled' },
    { date: 'July 31, 2024', card: '...1234', merchant: 'Hyatt Regency', amount: '$678.90', status: 'Unreconciled' },
    { date: 'July 30, 2024', card: '...5678', merchant: 'Zoom Video', amount: '$15.99', status: 'Reconciled' },
  ];

  getStatusClass(status: string) {
    return status === 'Unreconciled' ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800';
  }
}