import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilingHistoryService, Submission } from '../../../services/filing-history.service';
import { AddFilingModalComponent, NewFiling } from '../add-filing-modal/add-filing-modal.component';
import { UpcomingDeadlinesModalComponent } from './components/upcoming-deadlines-modal.component';
import { ReceiptDetailsModalComponent } from './components/receipt-details-modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-filing-history',
  standalone: true,
  templateUrl: './filing-history.component.html',
  styleUrls: ['./filing-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, 
    CommonModule, 
    AddFilingModalComponent, 
    UpcomingDeadlinesModalComponent,
    ReceiptDetailsModalComponent,
    NotificationComponent
  ]
})
export class FilingHistoryComponent {
  private filingHistoryService = inject(FilingHistoryService);

  // Modal states
  showAddFilingModal = signal(false);
  showDeadlinesModal = signal(false);
  showDetailsModal = signal(false);
  selectedSubmission = signal<Submission | null>(null);

  // Notification
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);
  
  // Filters
  searchQuery = signal('');
  taxTypeFilter = signal('All');
  periodFilter = signal('All');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(6);

  private allSubmissions = this.filingHistoryService.submissions;

  taxTypes = computed(() => ['All', 'Annual', 'GST', 'Property', 'TDS', 'VAT', 'Corporate', 'Advance']);
  // FIX: Add explicit string types to the sort callback parameters to resolve a type inference issue where they were being treated as 'unknown'.
  periods = computed(() => ['All', ...new Set(this.allSubmissions().map(s => s.dueDate.getFullYear().toString()))].sort((a: string, b: string) => b.localeCompare(a)));

  filteredSubmissions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const type = this.taxTypeFilter();
    const period = this.periodFilter();

    return this.allSubmissions().filter(s => {
      const matchesQuery = query === '' ||
        s.taxName.toLowerCase().includes(query) ||
        s.confirmation?.toLowerCase().includes(query);
      
      const matchesType = type === 'All' || s.taxName.startsWith(type);
      const matchesPeriod = period === 'All' || s.filingPeriod.includes(period) || s.dueDate.getFullYear().toString() === period;

      return matchesQuery && matchesType && matchesPeriod;
    });
  });

  totalPages = computed(() => Math.ceil(this.filteredSubmissions().length / this.itemsPerPage()));
  
  paginatedSubmissions = computed(() => {
    if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
      this.currentPage.set(1);
    }
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredSubmissions().slice(start, end);
  });
  
  pageNumbers = computed(() => {
    const total = this.totalPages();
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const currentPage = this.currentPage();
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (currentPage >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total];
  });

  changePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getStatusInfo(status: Submission['status']): { icon: string; textClass: string; } {
    switch (status) {
      case 'Accepted': return { icon: 'fa-solid fa-check-circle', textClass: 'text-green-600' };
      case 'Submitted': return { icon: 'fa-solid fa-paper-plane', textClass: 'text-blue-600' };
      case 'Processing': return { icon: 'fa-solid fa-spinner fa-spin', textClass: 'text-yellow-600' };
      case 'Rejected/Error': return { icon: 'fa-solid fa-times-circle', textClass: 'text-red-600' };
      case 'Due': return { icon: 'fa-solid fa-exclamation-circle', textClass: 'text-orange-600' };
      default: return { icon: '', textClass: 'text-gray-600' };
    }
  }

  isOverdue(dueDate: Date, status: Submission['status']): boolean {
    return status === 'Due' && new Date(dueDate) < new Date();
  }

  // Event Handlers
  onNewSubmission(): void {
    this.showAddFilingModal.set(true);
  }

  onViewUpcomingDeadlines(): void {
    this.showDeadlinesModal.set(true);
  }

  onViewDetails(submission: Submission): void {
    this.selectedSubmission.set(submission);
    this.showDetailsModal.set(true);
  }

  onDownloadReceipt(submission: Submission): void {
    const receiptContent = `
      Submission Details
      --------------------
      Tax Name: ${submission.taxName}
      Filing Period: ${submission.filingPeriod}
      Due Date: ${submission.dueDate.toLocaleDateString()}
      Status: ${submission.status}
      Amount: ${submission.amount ? `${submission.amount} ${submission.currency}` : 'N/A'}
      Confirmation: ${submission.confirmation || 'N/A'}
    `;
    const blob = new Blob([receiptContent.trim()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${submission.id}-${submission.taxName.replace(/\s/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    this.showNotification(`Downloading receipt for ${submission.taxName}...`, 'info');
  }

  handleModalSave(newFiling: NewFiling): void {
    this.filingHistoryService.addSubmission(newFiling);
    this.showAddFilingModal.set(false);
    this.showNotification('New filing added successfully!', 'success');
  }

  closeAllModals(): void {
    this.showAddFilingModal.set(false);
    this.showDeadlinesModal.set(false);
    this.showDetailsModal.set(false);
    this.selectedSubmission.set(null);
  }
  
  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }
}