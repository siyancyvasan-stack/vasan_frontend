
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-payroll-layout',
  standalone: true,
  template: `
    <div class="p-6 sm:p-8">
      <!-- Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Payroll Dashboard</h1>
          <p class="text-gray-500 mt-1">Overview of your organization's payroll status</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="startPayrollRun()" class="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg shadow-sm hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2">
            <i class="fa-solid fa-play"></i> Start Payroll Run
          </button>
        </div>
      </header>
      
      <!-- Navigation -->
      <nav class="flex border-b border-gray-200 mb-6">
        <a routerLink="dashboard" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold" [routerLinkActiveOptions]="{exact: true}"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Payroll Dashboard
        </a>
        <a routerLink="employees" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Employee Management
        </a>
        <a routerLink="run-payroll" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Run Payroll
        </a>
        <a routerLink="history" routerLinkActive="border-cyan-500 text-cyan-600 font-semibold"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-300 transition-all">
           Payslip History
        </a>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class PayrollLayoutComponent {
  private router = inject(Router);

  startPayrollRun(): void {
    this.router.navigate(['/payroll/run-payroll']);
  }
}
