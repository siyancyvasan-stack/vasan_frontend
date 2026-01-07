
import { ChangeDetectionStrategy, Component, output, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../services/payroll.service';
import { CorporateCard } from '../corporate-cards.component';

@Component({
  selector: 'app-link-card-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/60 z-40" (click)="close.emit()"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-2xl animate-modal-fade-in">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Link New Corporate Card</h2>
        <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600">
          <i class="fa-solid fa-xmark fa-lg"></i>
        </button>
      </div>
      <div class="p-8 max-h-[70vh] overflow-y-auto">
        <form #cardForm="ngForm" (ngSubmit)="onSave()" class="space-y-8">
          <!-- Section 1: Card Details -->
          <fieldset>
            <legend class="text-lg font-semibold text-gray-700 mb-4">Card Details</legend>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="cardType" class="block text-sm font-medium text-gray-600 mb-1">Card Type</label>
                <select id="cardType" name="cardType" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        [ngModel]="cardData().cardType"
                        (ngModelChange)="updateField('cardType', $event)">
                  <option>Visa</option>
                  <option>Mastercard</option>
                  <option>Amex</option>
                </select>
              </div>
              <div>
                <label for="last4" class="block text-sm font-medium text-gray-600 mb-1">Last 4 Digits</label>
                <input type="text" id="last4" name="last4" required maxlength="4"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                       [ngModel]="cardData().last4"
                       (ngModelChange)="updateField('last4', $event)">
              </div>
              <div>
                <label for="issuingBank" class="block text-sm font-medium text-gray-600 mb-1">Issuing Bank</label>
                <input type="text" id="issuingBank" name="issuingBank" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                       [ngModel]="cardData().issuingBank"
                       (ngModelChange)="updateField('issuingBank', $event)">
              </div>
            </div>
          </fieldset>

          <!-- Section 2: Employee Mapping -->
          <fieldset>
            <legend class="text-lg font-semibold text-gray-700 mb-4">Employee Mapping</legend>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-1">
                <label for="employeeId" class="block text-sm font-medium text-gray-600 mb-1">Employee Name</label>
                <select id="employeeId" name="employeeId" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        [ngModel]="cardData().employeeId"
                        (ngModelChange)="onEmployeeSelected($event)">
                  <option value="" disabled>Select an employee</option>
                  @for(emp of employees(); track emp.id) {
                    <option [value]="emp.id">{{ emp.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label for="employeeEmail" class="block text-sm font-medium text-gray-600 mb-1">Employee ID</label>
                <input type="text" id="employeeEmail" name="employeeEmail" disabled
                       class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                       [ngModel]="cardData().employeeId">
              </div>
              <div>
                <label for="department" class="block text-sm font-medium text-gray-600 mb-1">Department</label>
                <input type="text" id="department" name="department" disabled
                       class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                       [ngModel]="cardData().department">
              </div>
            </div>
          </fieldset>
          
          <!-- Section 3: Card Rules -->
          <fieldset>
            <legend class="text-lg font-semibold text-gray-700 mb-4">Card Rules (Optional)</legend>
            <div class="space-y-4">
              <div>
                <label for="monthlyLimit" class="block text-sm font-medium text-gray-600 mb-1">Monthly Limit (USD)</label>
                <input type="number" id="monthlyLimit" name="monthlyLimit" placeholder="e.g., 5000"
                       class="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                       [ngModel]="cardData().monthlyLimit"
                       (ngModelChange)="updateField('monthlyLimit', +$event)">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Allowed Categories</label>
                <div class="flex flex-wrap gap-x-6 gap-y-2">
                  @for(cat of allCategories; track cat) {
                    <label class="flex items-center">
                      <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                             [checked]="cardData().allowedCategories.includes(cat)"
                             (change)="toggleCategory(cat)">
                      <span class="ml-2 text-sm text-gray-700">{{cat}}</span>
                    </label>
                  }
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="p-6 bg-gray-50/70 rounded-b-lg flex justify-end gap-3">
        <button type="button" (click)="close.emit()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" (click)="onSave()" [disabled]="!cardForm.valid" class="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md shadow-sm hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed">
          Link Card
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
})
export class LinkCardModalComponent {
  employees = input.required<Employee[]>();
  close = output<void>();
  save = output<Omit<CorporateCard, 'id' | 'status'>>();

  allCategories = ['Travel', 'Food', 'Software', 'Office Supplies', 'Other'];

  cardData = signal<Omit<CorporateCard, 'id' | 'status'>>({
    cardType: 'Visa',
    last4: '',
    issuingBank: '',
    employeeName: '',
    employeeId: '',
    department: '',
    monthlyLimit: undefined,
    allowedCategories: []
  });

  updateField<K extends keyof Omit<CorporateCard, 'id' | 'status'>>(field: K, value: Omit<CorporateCard, 'id' | 'status'>[K]) {
    this.cardData.update(data => ({ ...data, [field]: value }));
  }

  onEmployeeSelected(employeeId: string) {
    const selectedEmployee = this.employees().find(e => e.id === employeeId);
    if (selectedEmployee) {
      this.cardData.update(data => ({
        ...data,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        department: selectedEmployee.department
      }));
    }
  }

  toggleCategory(category: string) {
    this.cardData.update(data => {
      const newCategories = data.allowedCategories.includes(category)
        ? data.allowedCategories.filter(c => c !== category)
        : [...data.allowedCategories, category];
      return { ...data, allowedCategories: newCategories };
    });
  }

  onSave() {
    this.save.emit(this.cardData());
  }
}
