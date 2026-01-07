
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Violation {
  employee: string;
  date: string;
  merchant: string;
  description: string;
}

@Component({
  selector: 'app-policy-violations-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 z-40" (click)="close.emit()"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-2xl animate-modal-fade-in">
      <div class="p-5 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Policy Violations</h2>
        <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
          <i class="fa-solid fa-xmark fa-lg"></i>
        </button>
      </div>
      <div class="p-6 max-h-[60vh] overflow-y-auto">
        <ul class="space-y-4">
          @for(violation of violations; track violation.merchant) {
            <li class="flex items-start p-4 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg">
              <i class="fa-solid fa-triangle-exclamation text-pink-500 mt-1"></i>
              <div class="ml-3">
                <p class="font-semibold text-gray-800">{{ violation.employee }} - {{ violation.merchant }} ({{ violation.date }})</p>
                <p class="text-sm text-gray-600">{{ violation.description }}</p>
              </div>
            </li>
          }
        </ul>
      </div>
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
export class PolicyViolationsModalComponent {
  close = output<void>();

  violations: Violation[] = [
    { employee: 'Bob Smith', date: '11 Dec 2024', merchant: 'Hotel Taj', description: 'Expense exceeds the daily limit for meals.' },
    { employee: 'Alice Johnson', date: '10 Dec 2024', merchant: 'Starbucks', description: 'Receipt was submitted 35 days after the expense date, which is past the 30-day submission policy.' },
  ];
}
