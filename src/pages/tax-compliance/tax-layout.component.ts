import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AddFilingModalComponent, NewFiling } from './add-filing-modal/add-filing-modal.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { FilingHistoryService } from '../../services/filing-history.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tax-layout',
  standalone: true,
  template: `
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Tax Compliance Overview</h1>
          <p class="text-gray-500 mt-1">Manage all your jurisdiction filings, deadlines, and reports.</p>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button (click)="onNewFiling()" class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg shadow-sm hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2">
            <i class="fa-solid fa-plus"></i> New Filing
          </button>
          <button (click)="onShowAlerts()" class="p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            <i class="fa-regular fa-bell text-gray-600"></i>
          </button>
          <div class="p-1.5 rounded-full bg-white border border-gray-200">
            <img class="h-7 w-7 rounded-full" src="https://picsum.photos/100" alt="User avatar">
          </div>
        </div>
      </header>
      
      <!-- Navigation -->
      <nav class="flex border-b border-gray-200 mb-6">
        <a routerLink="dashboard" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold" [routerLinkActiveOptions]="{exact: true}"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Dashboard
        </a>
        <a routerLink="calendar" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Calendar
        </a>
        <a routerLink="forms" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Tax Forms Library
        </a>
        <a routerLink="history" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Filing History
        </a>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
      
      @if(showAddFilingModal()) {
        <app-add-filing-modal (close)="handleModalClose()" (save)="handleModalSave($event)"></app-add-filing-modal>
      }

      @if(notification()) {
        <app-notification 
          [message]="notification()!.message" 
          [type]="notification()!.type"
          (close)="notification.set(null)">
        </app-notification>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AddFilingModalComponent, NotificationComponent]
})
export class TaxLayoutComponent {
  private filingHistoryService = inject(FilingHistoryService);

  showAddFilingModal = signal(false);
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);

  onNewFiling(): void {
    this.showAddFilingModal.set(true);
  }

  onShowAlerts(): void {
    console.log('Alerts bell icon clicked. A notification panel should appear.');
  }

  handleModalClose(): void {
    if (this.showAddFilingModal()) {
      this.showAddFilingModal.set(false);
      this.showNotification('Action cancelled', 'info');
    }
  }

  handleModalSave(newFiling: NewFiling): void {
    this.filingHistoryService.addSubmission(newFiling);
    this.showAddFilingModal.set(false);
    this.showNotification('Filing saved successfully!', 'success');
  }

  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }
}