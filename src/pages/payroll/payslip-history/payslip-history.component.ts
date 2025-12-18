import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payslip-history',
  standalone: true,
  templateUrl: './payslip-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class PayslipHistoryComponent {
  payslips = [
    { period: 'July 2024', payDate: 'July 31, 2024', employee: 'Alice Johnson', netPay: '$4,820.15' },
    { period: 'July 2024', payDate: 'July 31, 2024', employee: 'Bob Smith', netPay: '$5,530.80' },
    { period: 'June 2024', payDate: 'June 30, 2024', employee: 'Alice Johnson', netPay: '$4,815.70' },
    { period: 'June 2024', payDate: 'June 30, 2024', employee: 'Bob Smith', netPay: '$5,530.80' },
    { period: 'May 2024', payDate: 'May 31, 2024', employee: 'Alice Johnson', netPay: '$4,850.25' },
  ];
}