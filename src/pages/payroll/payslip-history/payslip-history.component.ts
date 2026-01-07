
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Payslip {
  id: number;
  period: string;
  payDate: Date;
  employee: string;
  netPay: number;
  currency: string;
}

@Component({
  selector: 'app-payslip-history',
  standalone: true,
  templateUrl: './payslip-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class PayslipHistoryComponent {
  searchQuery = signal('');
  monthFilter = signal('2024-07');
  minMonth = '2024-01';
  maxMonth = '2026-12';

  private allPayslips = signal<Payslip[]>([
    { id: 1, period: 'July 2024', payDate: new Date('2024-07-31'), employee: 'Alice Johnson', netPay: 4820.15, currency: 'USD' },
    { id: 2, period: 'July 2024', payDate: new Date('2024-07-31'), employee: 'Bob Smith', netPay: 5530.80, currency: 'USD' },
    { id: 3, period: 'July 2024', payDate: new Date('2024-07-31'), employee: 'Sarah Johnson', netPay: 5200.00, currency: 'USD' },
    { id: 4, period: 'July 2024', payDate: new Date('2024-07-31'), employee: 'Michael Chen', netPay: 6100.00, currency: 'USD' },
    { id: 5, period: 'June 2024', payDate: new Date('2024-06-30'), employee: 'Alice Johnson', netPay: 4815.70, currency: 'USD' },
    { id: 6, period: 'June 2024', payDate: new Date('2024-06-30'), employee: 'Bob Smith', netPay: 5530.80, currency: 'USD' },
    { id: 7, period: 'June 2024', payDate: new Date('2024-06-30'), employee: 'Sarah Johnson', netPay: 5150.00, currency: 'USD' },
    { id: 8, period: 'May 2024', payDate: new Date('2024-05-31'), employee: 'Alice Johnson', netPay: 4850.25, currency: 'USD' },
    { id: 9, period: 'May 2024', payDate: new Date('2024-05-31'), employee: 'Bob Smith', netPay: 5500.00, currency: 'USD' },
    { id: 10, period: 'May 2024', payDate: new Date('2024-05-31'), employee: 'Michael Chen', netPay: 6050.50, currency: 'USD' },
    { id: 11, period: 'April 2024', payDate: new Date('2024-04-30'), employee: 'Alice Johnson', netPay: 4800.00, currency: 'USD' },
    { id: 12, period: 'April 2024', payDate: new Date('2024-04-30'), employee: 'Bob Smith', netPay: 5480.20, currency: 'USD' },
    // Data for 2025
    { id: 13, period: 'January 2025', payDate: new Date('2025-01-31'), employee: 'Alice Johnson', netPay: 4900.00, currency: 'USD' },
    { id: 14, period: 'January 2025', payDate: new Date('2025-01-31'), employee: 'Bob Smith', netPay: 5600.00, currency: 'USD' },
    { id: 15, period: 'June 2025', payDate: new Date('2025-06-30'), employee: 'Michael Chen', netPay: 6200.00, currency: 'USD' },
    // Data for 2026
    { id: 16, period: 'March 2026', payDate: new Date('2026-03-31'), employee: 'Sarah Johnson', netPay: 5300.00, currency: 'USD' },
    { id: 17, period: 'March 2026', payDate: new Date('2026-03-31'), employee: 'Alice Johnson', netPay: 5000.00, currency: 'USD' },
  ]);

  filteredPayslips = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const [year, month] = this.monthFilter().split('-').map(Number);

    return this.allPayslips().filter(slip => {
      const slipDate = slip.payDate;
      const matchesMonth = slipDate.getFullYear() === year && (slipDate.getMonth() + 1) === month;
      const matchesQuery = query === '' || slip.employee.toLowerCase().includes(query);
      return matchesMonth && matchesQuery;
    });
  });

  downloadPayslip(payslip: Payslip) {
    const content = `
      Payslip for ${payslip.employee}
      ---------------------------------
      Pay Period: ${payslip.period}
      Pay Date: ${payslip.payDate.toLocaleDateString()}
      Net Pay: ${payslip.netPay.toLocaleString('en-US', { style: 'currency', currency: payslip.currency })}
    `;
    const blob = new Blob([content.trim()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${payslip.employee.replace(/\s+/g, '_')}-${payslip.period.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}