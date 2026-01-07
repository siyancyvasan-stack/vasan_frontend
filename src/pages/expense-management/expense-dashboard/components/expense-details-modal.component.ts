
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentClaim } from '../expense-dashboard.component';

@Component({
  selector: 'app-expense-details-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 z-40" (click)="close.emit()"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-lg animate-modal-fade-in">
      <div class="p-5 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Expense Claim Details</h2>
        <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
          <i class="fa-solid fa-xmark fa-lg"></i>
        </button>
      </div>
      @if(expense(); as exp) {
        <div class="p-6 space-y-4">
          <div class="flex justify-between items-center bg-gray-50 p-3 rounded-md">
              <span class="text-sm font-medium text-gray-600">Merchant</span>
              <span class="text-sm font-semibold text-gray-800">{{ exp.merchant }}</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
              <div class="text-sm">
                  <p class="text-gray-500">Date</p>
                  <p class="font-semibold text-gray-800">{{ exp.date }}</p>
              </div>
              <div class="text-sm">
                  <p class="text-gray-500">Category</p>
                  <p class="font-semibold text-gray-800">{{ exp.category }}</p>
              </div>
              <div class="text-sm">
                  <p class="text-gray-500">Amount</p>
                  <p class="font-semibold text-gray-800 font-mono">{{ exp.amount | currency:'INR' }}</p>
              </div>
              <div class="text-sm">
                  <p class="text-gray-500">Status</p>
                  <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" [class]="statusClass">
                    {{ exp.status }}
                  </span>
              </div>
          </div>
        </div>
      }
      <div class="p-4 bg-gray-50/70 rounded-b-lg flex justify-end">
        <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          Close
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ExpenseDetailsModalComponent {
  expense = input.required<RecentClaim>();
  close = output<void>();

  get statusClass(): string {
    const status = this.expense()?.status;
    switch (status) {
      case 'Approved': return 'bg-cyan-100 text-cyan-800';
      case 'Pending': return 'bg-purple-100 text-purple-800';
      case 'Rejected': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
