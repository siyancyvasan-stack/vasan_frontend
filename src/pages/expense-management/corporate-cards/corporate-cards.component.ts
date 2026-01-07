
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService, Employee } from '../../../services/payroll.service';
import { LinkCardModalComponent } from './components/link-card-modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

export interface CorporateCard {
  id: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  issuingBank: string;
  employeeName: string;
  employeeId: string;
  department?: string;
  monthlyLimit?: number;
  allowedCategories: string[];
  status: 'Active' | 'Frozen' | 'Deactivated';
}

@Component({
  selector: 'app-corporate-cards',
  standalone: true,
  templateUrl: './corporate-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, LinkCardModalComponent, NotificationComponent],
  host: {
    '(document:click)': 'onDocumentClick()'
  }
})
export class CorporateCardsComponent {
  private payrollService = inject(PayrollService);

  // --- Filter State ---
  cardFilter = signal('All');
  statusFilter = signal('All');
  
  // --- UI State ---
  showLinkCardModal = signal(false);
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);
  activeDropdown = signal<string | null>(null);

  // --- Data Signals ---
  employees = this.payrollService.getEmployees();
  cards = signal<CorporateCard[]>([
    { id: 'cc-1', cardType: 'Visa', last4: '1234', issuingBank: 'Chase Bank', employeeName: 'Jane Doe', employeeId: 'EMP005', department: 'Human Resources', monthlyLimit: 5000, allowedCategories: ['Travel', 'Food'], status: 'Active' },
    { id: 'cc-2', cardType: 'Mastercard', last4: '5678', issuingBank: 'Bank of America', employeeName: 'Employee User', employeeId: 'EMP001', department: 'Engineering', monthlyLimit: 10000, allowedCategories: ['Software', 'Travel'], status: 'Active' },
    { id: 'cc-3', cardType: 'Amex', last4: '9012', issuingBank: 'American Express', employeeName: 'Michael Chen', employeeId: 'EMP002', department: 'Management', monthlyLimit: 15000, allowedCategories: ['Travel', 'Food', 'Software'], status: 'Frozen' },
  ]);

  transactions = signal([
    { date: 'Aug 02, 2024', card: '...1234', merchant: 'Delta Airlines', amount: '$543.21', status: 'Unreconciled' },
    { date: 'Aug 01, 2024', card: '...5678', merchant: 'Slack', amount: '$25.00', status: 'Reconciled' },
    { date: 'July 31, 2024', card: '...1234', merchant: 'Hyatt Regency', amount: '$678.90', status: 'Unreconciled' },
    { date: 'July 30, 2024', card: '...5678', merchant: 'Zoom Video', amount: '$15.99', status: 'Reconciled' },
    { date: 'July 28, 2024', card: '...1234', merchant: 'Starbucks', amount: '$12.50', status: 'Reconciled' },
    { date: 'July 27, 2024', card: '...5678', merchant: 'AWS', amount: '$150.00', status: 'Unreconciled' },
  ]);
  
  // --- Computed Signals for Filtering ---
  filteredTransactions = computed(() => {
    const cardLast4 = this.cardFilter();
    const status = this.statusFilter();

    return this.transactions().filter(tx => {
      // The filter value is just the last 4 digits
      const matchesCard = cardLast4 === 'All' || tx.card.endsWith(cardLast4);
      const matchesStatus = status === 'All' || tx.status === status;
      return matchesCard && matchesStatus;
    });
  });

  // --- Event Handlers ---
  onLinkNewCard(): void {
    this.showLinkCardModal.set(true);
  }

  handleModalClose(): void {
    this.showLinkCardModal.set(false);
  }
  
  handleSaveCard(newCardData: Omit<CorporateCard, 'id' | 'status'>): void {
    const newCard: CorporateCard = {
      ...newCardData,
      id: `cc-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Active'
    };
    this.cards.update(currentCards => [newCard, ...currentCards]);
    this.handleModalClose();
    this.showNotification('New corporate card linked successfully!', 'success');
  }

  toggleDropdown(cardId: string, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdown.set(this.activeDropdown() === cardId ? null : cardId);
  }

  onDocumentClick(): void {
    this.activeDropdown.set(null);
  }

  // --- UI Helpers ---
  getStatusClass(status: string) {
    return status === 'Unreconciled' ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800';
  }

  getCardStatusClass(status: string): { dot: string; text: string; } {
    switch (status) {
      case 'Active': return { dot: 'bg-green-500', text: 'text-green-700' };
      case 'Frozen': return { dot: 'bg-yellow-500', text: 'text-yellow-700' };
      case 'Deactivated': return { dot: 'bg-red-500', text: 'text-red-700' };
      default: return { dot: 'bg-gray-500', text: 'text-gray-700' };
    }
  }

  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }
}
