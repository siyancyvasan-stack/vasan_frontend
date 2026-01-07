
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService, ExpenseClaim } from '../../../services/expense.service';
import { ApprovalDetailsModalComponent } from './components/approval-details-modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  templateUrl: './approval-queue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ApprovalDetailsModalComponent, NotificationComponent]
})
export class ApprovalQueueComponent {
  private expenseService = inject(ExpenseService);

  // Modal state
  showDetailsModal = signal(false);
  selectedClaim = signal<ExpenseClaim | null>(null);
  
  // Notification state
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);

  approvalQueue = computed(() => {
    return this.expenseService.getExpenses().filter(e => e.status === 'Pending');
  });
  
  viewDetails(claim: ExpenseClaim): void {
    this.selectedClaim.set(claim);
    this.showDetailsModal.set(true);
  }

  approve(id: number): void {
    this.expenseService.approveExpense(id);
    this.showNotification(`Expense claim #${id} approved.`, 'success');
    if (this.showDetailsModal()) {
      this.closeModal();
    }
  }

  reject(id: number): void {
    this.expenseService.rejectExpense(id);
    this.showNotification(`Expense claim #${id} rejected.`, 'info');
    if (this.showDetailsModal()) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    this.selectedClaim.set(null);
  }
  
  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }
}