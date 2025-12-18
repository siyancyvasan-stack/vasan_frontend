import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../../services/payroll.service';

@Component({
  selector: 'app-deactivate-confirm-modal',
  standalone: true,
  templateUrl: './deactivate-confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DeactivateConfirmModalComponent {
  employee = input.required<Employee>();
  close = output<void>();
  confirm = output<void>();
}