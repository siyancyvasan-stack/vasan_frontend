import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

type PayrollState = 'initial' | 'calculating' | 'calculated' | 'sending' | 'pendingApproval' | 'approving' | 'approved' | 'rejected';

interface ComputationSummary {
  grossSalary: number;
  allowances: number;
  statutoryDeductions: number;
  otherDeductions: number;
  netPay: number;
}

interface RunDetails {
  payDate: Date;
  employees: number;
  totalCost: number;
}

interface FormOptions {
  payPeriods: string[];
  countries: { name: string; currency: string }[];
  currencies: string[];
  structures: string[];
}

@Component({
  selector: 'app-run-payroll',
  standalone: true,
  templateUrl: './run-payroll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NotificationComponent]
})
export class RunPayrollComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);
  private queryParamsSubscription?: Subscription;

  // --- State Signals ---
  payrollState = signal<PayrollState>('initial');

  // --- Form Signals ---
  payPeriod = signal('');
  country = signal('USA');
  currency = signal('USD');
  salaryStructure = signal('All');
  
  // --- Data Signals ---
  computationSummary = signal<ComputationSummary | null>(null);
  runDetails = signal<RunDetails | null>(null);
  formOptions = signal<FormOptions>({ payPeriods: [], countries: [], currencies: [], structures: [] });
  notification = signal<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  ngOnInit(): void {
    let isInitialLoad = true;
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (isInitialLoad || params['reset']) {
        this.resetPayrollRun();
        isInitialLoad = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }

  resetPayrollRun(): void {
    this.payrollState.set('initial');
    this.computationSummary.set(null);
    this.runDetails.set(null);
    this.payPeriod.set('');
    this.country.set('USA');
    this.currency.set('USD');
    this.salaryStructure.set('All');
    
    this.formOptions.set({
      payPeriods: this.generatePayPeriods(),
      countries: [
        { name: 'USA', currency: 'USD' },
        { name: 'India', currency: 'INR' },
        { name: 'Sri Lanka', currency: 'LKR' },
        { name: 'Dubai (UAE)', currency: 'AED' },
        { name: 'United Kingdom', currency: 'GBP' }
      ],
      currencies: ['USD', 'INR', 'LKR', 'AED', 'GBP'],
      structures: ['All Structures', 'Tech Standard', 'Management', 'Sales Commission']
    });
  }

  private generatePayPeriods(): string[] {
    const periods: string[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let year = currentYear; year <= 2026; year++) {
      months.forEach(month => {
        periods.push(`${month} ${year}`);
      });
    }
    return periods;
  }
  
  onCountryChange(countryName: string): void {
    const selectedCountry = this.formOptions().countries.find(c => c.name === countryName);
    if (selectedCountry) {
        this.currency.set(selectedCountry.currency);
    }
  }

  calculatePayroll(): void {
    if (!this.payPeriod() || !this.country()) return;

    this.payrollState.set('calculating');
    setTimeout(() => {
      const baseGross = 312450.00;
      const exchangeRates: { [key: string]: number } = { USD: 1, INR: 83, LKR: 300, AED: 3.67, GBP: 0.79 };
      const rate = exchangeRates[this.currency()] || 1;

      const summary: ComputationSummary = {
        grossSalary: baseGross * rate,
        allowances: 48750.00 * rate,
        statutoryDeductions: 62450.00 * rate,
        otherDeductions: 12350.00 * rate,
        netPay: (baseGross + 48750.00 - 62450.00 - 12350.00) * rate
      };
      this.computationSummary.set(summary);

      this.runDetails.set({
        payDate: new Date('2024-12-31'),
        employees: 158,
        totalCost: (summary.grossSalary + summary.allowances)
      });

      this.payrollState.set('calculated');
      this.showNotification('Payroll calculation complete.', 'success');
    }, 2000);
  }

  sendForApproval(): void {
    this.payrollState.set('sending');
    this.showNotification('Sending for approval...', 'info');

    setTimeout(() => {
      this.payrollState.set('pendingApproval');
      this.showNotification('Payroll sent to Financial Manager.', 'success');
    }, 1500);
  }

  approvePayroll(): void {
    this.payrollState.set('approving');
    setTimeout(() => {
      this.payrollState.set('approved');
      this.showNotification('Payroll run has been approved!', 'success');
    }, 1500);
  }

  rejectPayroll(): void {
    this.payrollState.set('rejected');
    this.showNotification('Payroll run has been rejected.', 'warning');
  }

  downloadPayslips(): void {
    const details = this.runDetails();
    if (!details) return;

    let payslipContent = `
      Payslip Summary for Payroll Run
      ---------------------------------
      Pay Date: ${details.payDate.toLocaleDateString()}
      Total Employees: ${details.employees}
      Total Cost: ${this.currency()} ${details.totalCost.toFixed(2)}
      
      --- Individual Payslips (Sample) ---
    `;

    for(let i = 1; i <= 3; i++) {
        payslipContent += `
        \nEmployee ID: EMP00${i}
        Net Pay: ${this.currency()} ${(details.totalCost / details.employees * 0.7).toFixed(2)}
        -----------------`;
    }

    const blob = new Blob([payslipContent.trim()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslips-${this.payPeriod().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    this.showNotification('Payslips download started.', 'info');
  }

  private showNotification(message: string, type: 'success' | 'info' | 'warning'): void {
    this.notification.set({ message, type });
  }
}
