import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollRun, PayrollService, Payslip } from '../../../../../services/payroll.service';

@Component({
  selector: 'app-payroll-run-details-modal',
  standalone: true,
  templateUrl: './payroll-run-details-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PayrollRunDetailsModalComponent {
  run = input.required<PayrollRun>();
  close = output<void>();

  private payrollService = inject(PayrollService);

  // View management
  currentView = signal<'details' | 'payslips' | 'payslipDetail'>('details');
  payslips = signal<Payslip[]>([]);
  selectedPayslip = signal<Payslip | null>(null);

  onViewPayslips(): void {
    const runPayslips = this.payrollService.getPayslipsForRun(this.run().id);
    this.payslips.set(runPayslips);
    this.currentView.set('payslips');
  }

  onDownloadReport(): void {
    const runDetails = this.run();
    const reportContent = `
      Payroll Run Report
      --------------------
      Run ID: ${runDetails.id}
      Date: ${new Date(runDetails.date).toLocaleDateString()}
      Status: ${runDetails.status}
      Employee Count: ${runDetails.employeeCount}
      Total Cost: $${runDetails.totalCost.toFixed(2)}
    `;

    const blob = new Blob([reportContent.trim()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-report-${runDetails.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    console.log(`Downloading report for Run ID: ${runDetails.id}`);
  }

  // New methods for view navigation
  viewPayslipDetail(payslip: Payslip): void {
    this.selectedPayslip.set(payslip);
    this.currentView.set('payslipDetail');
  }
  
  backToPayslipList(): void {
    this.selectedPayslip.set(null);
    this.currentView.set('payslips');
  }

  backToDetails(): void {
    this.payslips.set([]);
    this.currentView.set('details');
  }

  printPayslip(): void {
    console.log('Printing payslip...');
    window.print();
  }

  getStatusClass(status: string): { bg: string; text: string; } {
    switch (status) {
      case 'Completed': return { bg: 'bg-cyan-100', text: 'text-cyan-800' };
      case 'Processing': return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'Failed': return { bg: 'bg-pink-100', text: 'text-pink-800' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  }
}