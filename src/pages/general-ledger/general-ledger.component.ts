import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface JournalEntry {
  id: string;
  date: Date;
  account: string;
  accountCode: string;
  description: string;
  debit: number | null;
  credit: number | null;
}

@Component({
  selector: 'app-general-ledger',
  standalone: true,
  templateUrl: './general-ledger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class GeneralLedgerComponent {
  // Filters
  searchQuery = signal('');
  accountFilter = signal('All');
  startDate = signal('');
  endDate = signal('');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(10);

  private allEntries = signal<JournalEntry[]>([
    { id: 'JE-001', date: new Date('2024-07-01'), account: 'Cash', accountCode: '10100', description: 'Initial cash investment from owner', debit: 50000, credit: null },
    { id: 'JE-001', date: new Date('2024-07-01'), account: 'Owner\'s Equity', accountCode: '30100', description: 'Initial cash investment from owner', debit: null, credit: 50000 },
    { id: 'JE-002', date: new Date('2024-07-02'), account: 'Office Supplies', accountCode: '60500', description: 'Purchase of office supplies', debit: 500, credit: null },
    { id: 'JE-002', date: new Date('2024-07-02'), account: 'Cash', accountCode: '10100', description: 'Purchase of office supplies', debit: null, credit: 500 },
    { id: 'JE-003', date: new Date('2024-07-05'), account: 'Rent Expense', accountCode: '60100', description: 'Paid July rent', debit: 1500, credit: null },
    { id: 'JE-003', date: new Date('2024-07-05'), account: 'Cash', accountCode: '10100', description: 'Paid July rent', debit: null, credit: 1500 },
    { id: 'JE-004', date: new Date('2024-07-10'), account: 'Accounts Receivable', accountCode: '10200', description: 'Services provided to Client A', debit: 3000, credit: null },
    { id: 'JE-004', date: new Date('2024-07-10'), account: 'Service Revenue', accountCode: '40100', description: 'Services provided to Client A', debit: null, credit: 3000 },
    { id: 'JE-005', date: new Date('2024-07-15'), account: 'Cash', accountCode: '10100', description: 'Received payment from Client A', debit: 3000, credit: null },
    { id: 'JE-005', date: new Date('2024-07-15'), account: 'Accounts Receivable', accountCode: '10200', description: 'Received payment from Client A', debit: null, credit: 3000 },
    { id: 'JE-006', date: new Date('2024-07-20'), account: 'Salaries Expense', accountCode: '60200', description: 'Paid employee salaries', debit: 5000, credit: null },
    { id: 'JE-006', date: new Date('2024-07-20'), account: 'Cash', accountCode: '10100', description: 'Paid employee salaries', debit: null, credit: 5000 },
    { id: 'JE-007', date: new Date('2024-07-25'), account: 'Utilities Expense', accountCode: '60300', description: 'Paid electricity bill', debit: 250, credit: null },
    { id: 'JE-007', date: new Date('2024-07-25'), account: 'Cash', accountCode: '10100', description: 'Paid electricity bill', debit: null, credit: 250 },
  ]);
  
  accountNames = computed(() => ['All', ...Array.from(new Set(this.allEntries().map(e => e.account)))]);

  filteredEntries = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const account = this.accountFilter();
    const start = this.startDate() ? new Date(this.startDate()) : null;
    const end = this.endDate() ? new Date(this.endDate()) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return this.allEntries().filter(entry => {
      const matchesQuery = query === '' ||
        entry.id.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query);
      
      const matchesAccount = account === 'All' || entry.account === account;

      const entryDate = new Date(entry.date);
      const matchesDate = (!start || entryDate >= start) && (!end || entryDate <= end);

      return matchesQuery && matchesAccount && matchesDate;
    });
  });

  totalPages = computed(() => Math.ceil(this.filteredEntries().length / this.itemsPerPage()));
  
  paginatedEntries = computed(() => {
    if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
      this.currentPage.set(1);
    }
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredEntries().slice(start, end);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    if (total <= 1) return [];
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  totalDebits = computed(() => this.paginatedEntries().reduce((acc, entry) => acc + (entry.debit || 0), 0));
  totalCredits = computed(() => this.paginatedEntries().reduce((acc, entry) => acc + (entry.credit || 0), 0));
  
  transactionGroups = computed(() => {
    const groups = new Map<string, JournalEntry[]>();
    this.paginatedEntries().forEach(entry => {
        if (!groups.has(entry.id)) {
            groups.set(entry.id, []);
        }
        groups.get(entry.id)!.push(entry);
    });
    return Array.from(groups.values());
  });

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
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

  onNewJournalEntry() {
    console.log("Creating new journal entry...");
  }
}