import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../../services/payroll.service';

@Component({
  selector: 'app-employee-details-modal',
  standalone: true,
  templateUrl: './employee-details-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class EmployeeDetailsModalComponent {
  employee = input.required<Employee>();
  close = output<void>();

  getStatusClass(status: string) {
    switch (status) {
      case 'Active': return 'bg-sky-100 text-sky-800';
      case 'On Leave': return 'bg-purple-100 text-purple-800';
      case 'Terminated': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}