import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AddFilingModalComponent, NewFiling } from './add-filing-modal/add-filing-modal.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import { FilingHistoryService } from '../../services/filing-history.service';
import { CommonModule } from '@angular/common';
import { SmartNotificationsComponent, SmartNotification } from './components/smart-notifications/smart-notifications.component';

@Component({
  selector: 'app-tax-layout',
  standalone: true,
  templateUrl: './tax-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AddFilingModalComponent, NotificationComponent, SmartNotificationsComponent]
})
export class TaxLayoutComponent {
  private filingHistoryService = inject(FilingHistoryService);

  showAddFilingModal = signal(false);
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);

  // New state for smart notifications
  showNotifications = signal(false);
  smartNotifications = signal<SmartNotification[]>([
    { title: 'Filing Form 940 is Overdue!', subtitle: 'Found automatically by Lumina AI' },
    { title: 'Filing GST Filing (India) is Overdue!', subtitle: 'Found automatically by Lumina AI' },
    { title: 'Filing Payroll Tax (US) is Overdue!', subtitle: 'Found automatically by Lumina AI' },
    { title: 'Filing VAT Return (UK) is Overdue!', subtitle: 'Found automatically by Lumina AI' },
  ]);

  onNewFiling(): void {
    this.showAddFilingModal.set(true);
  }

  onShowAlerts(): void {
    this.showNotifications.update(value => !value);
  }

  // New methods for smart notifications
  onDismissAllNotifications(): void {
    this.smartNotifications.set([]);
    this.showNotifications.set(false);
  }

  closeNotifications(): void {
    this.showNotifications.set(false);
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