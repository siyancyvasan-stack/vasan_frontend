
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseClaim } from '../../../../services/expense.service';

@Component({
  selector: 'app-approval-details-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 z-40" (click)="close.emit()"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-lg animate-modal-fade-in">
      <div class="p-5 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Expense Approval Details</h2>
        <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
          <i class="fa-solid fa-xmark fa-lg"></i>
        </button>
      </div>
      @if(claim(); as c) {
        <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div class="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p class="text-sm text-gray-500">Employee</p>
              <p class="font-medium text-gray-800">{{ c.employeeName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Submission Date</p>
              <p class="font-medium text-gray-800">{{ c.date | date:'mediumDate' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Merchant</p>
              <p class="font-medium text-gray-800">{{ c.merchant }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Category</p>
              <p class="font-medium text-gray-800">{{ c.category }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-sm text-gray-500">Description</p>
              <p class="font-medium text-gray-800">{{ c.description }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Amount</p>
              <p class="font-bold text-lg text-gray-800 font-mono">{{ c.amount | currency:c.currency }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Payment Method</p>
              <p class="font-medium text-gray-800">{{ c.paymentMethod }}</p>
            </div>
            @if (c.tags.length > 0) {
              <div class="col-span-2">
                <p class="text-sm text-gray-500">Tags</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  @for(tag of c.tags; track tag) {
                    <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                      {{ tag }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
        <div class="p-4 bg-gray-50/70 rounded-b-lg flex justify-end gap-3">
            <button type="button" (click)="reject.emit(c.id)" class="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700">
                Reject
            </button>
            <button type="button" (click)="approve.emit(c.id)" class="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md shadow-sm hover:bg-cyan-700">
                Approve
            </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ApprovalDetailsModalComponent {
  claim = input.required<ExpenseClaim>();
  close = output<void>();
  approve = output<number>();
  reject = output<number>();
}
