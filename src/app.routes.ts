
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout.component').then(c => c.LayoutComponent),
    children: [
        {
            path: 'dashboard',
            loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
        },
        {
            path: 'general-ledger',
            loadComponent: () => import('./pages/general-ledger/general-ledger.component').then(c => c.GeneralLedgerComponent)
        },
        {
            path: 'tax-compliance',
            loadComponent: () => import('./pages/tax-compliance/tax-layout.component').then(m => m.TaxLayoutComponent),
            children: [
                {
                    path: 'dashboard',
                    loadComponent: () => import('./pages/tax-compliance/tax-dashboard/tax-dashboard.component').then(m => m.TaxDashboardComponent)
                },
                {
                    path: 'calendar',
                    loadComponent: () => import('./pages/tax-compliance/tax-calendar/tax-calendar.component').then(m => m.TaxCalendarComponent)
                },
                {
                    path: 'forms',
                    loadComponent: () => import('./pages/tax-compliance/tax-forms/tax-forms.component').then(m => m.TaxFormsComponent)
                },
                {
                    path: 'history',
                    loadComponent: () => import('./pages/tax-compliance/filing-history/filing-history.component').then(m => m.FilingHistoryComponent)
                },
                {
                    path: '',
                    redirectTo: 'dashboard',
                    pathMatch: 'full'
                }
            ]
        },
        {
            path: 'payroll',
            loadComponent: () => import('./pages/payroll/payroll-layout.component').then(m => m.PayrollLayoutComponent),
            children: [
                {
                    path: 'dashboard',
                    loadComponent: () => import('./pages/payroll/payroll-dashboard/payroll-dashboard.component').then(m => m.PayrollDashboardComponent)
                },
                {
                    path: 'employees',
                    loadComponent: () => import('./pages/payroll/employee-management/employee-management.component').then(m => m.EmployeeManagementComponent)
                },
                {
                    path: 'run-payroll',
                    loadComponent: () => import('./pages/payroll/run-payroll/run-payroll.component').then(m => m.RunPayrollComponent)
                },
                {
                    path: 'history',
                    loadComponent: () => import('./pages/payroll/payslip-history/payslip-history.component').then(m => m.PayslipHistoryComponent)
                },
                {
                    path: '',
                    redirectTo: 'dashboard',
                    pathMatch: 'full'
                }
            ]
        },
        {
            path: 'expense-management',
            loadComponent: () => import('./pages/expense-management/expense-layout.component').then(m => m.ExpenseLayoutComponent),
            children: [
                {
                    path: 'dashboard',
                    loadComponent: () => import('./pages/expense-management/expense-dashboard/expense-dashboard.component').then(m => m.ExpenseDashboardComponent)
                },
                {
                    path: 'submit',
                    loadComponent: () => import('./pages/expense-management/submit-expense/submit-expense.component').then(m => m.SubmitExpenseComponent)
                },
                {
                    path: 'my-expenses',
                    loadComponent: () => import('./pages/expense-management/my-expenses/my-expenses.component').then(m => m.MyExpensesComponent)
                },
                {
                    path: 'approvals',
                    loadComponent: () => import('./pages/expense-management/approval-queue/approval-queue.component').then(m => m.ApprovalQueueComponent)
                },
                {
                    path: 'cards',
                    loadComponent: () => import('./pages/expense-management/corporate-cards/corporate-cards.component').then(m => m.CorporateCardsComponent)
                },
                {
                    path: '',
                    redirectTo: 'dashboard',
                    pathMatch: 'full'
                }
            ]
        },
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
