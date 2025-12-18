import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Submission } from '../../../../services/filing-history.service';

@Component({
  selector: 'app-receipt-details-modal',
  standalone: true,
  templateUrl: './receipt-details-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ReceiptDetailsModalComponent {
  submission = input.required<Submission>();
  close = output<void>();
}