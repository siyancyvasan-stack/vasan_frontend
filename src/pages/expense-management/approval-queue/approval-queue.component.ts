import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  templateUrl: './approval-queue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ApprovalQueueComponent {
  approvalQueue = [
    { date: 'Aug 01, 2024', employee: 'Charlie Brown', amount: '$75.50', merchant: 'Lyft' },
    { date: 'July 30, 2024', employee: 'Alice Johnson', amount: '$250.00', merchant: 'Client Dinner' },
    { date: 'July 29, 2024', employee: 'Bob Smith', amount: '$112.80', merchant: 'Adobe Creative Cloud' },
    { date: 'July 28, 2024', employee: 'Charlie Brown', amount: '$32.00', merchant: 'Office Lunch' },
  ];
}