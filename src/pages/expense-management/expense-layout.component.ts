
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-expense-layout',
  standalone: true,
  template: `
    <div class="p-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Expense Management & Reimbursement</h1>
      </header>
      
      <nav class="flex border-b border-gray-200 mb-6">
        <a routerLink="dashboard" routerLinkActive="border-cyan-500 text-cyan-600" [routerLinkActiveOptions]="{exact: true}"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-200">
           Expense Dashboard
        </a>
        <a routerLink="submit" routerLinkActive="border-cyan-500 text-cyan-600"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-200">
           Submit Expense
        </a>
        <a routerLink="my-expenses" routerLinkActive="border-cyan-500 text-cyan-600"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-200">
           My Expenses
        </a>
        <a routerLink="approvals" routerLinkActive="border-cyan-500 text-cyan-600"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-200">
           Approval Queue
        </a>
         <a routerLink="cards" routerLinkActive="border-cyan-500 text-cyan-600"
           class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-cyan-700 hover:border-cyan-200">
           Corporate Cards
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
export class ExpenseLayoutComponent {}
