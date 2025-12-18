import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface NewFiling {
  filingName: string;
  country: string;
  filingPeriod: string;
  amount: number | null;
  currency: string;
  dueDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Submitted';
}

@Component({
  selector: 'app-add-filing-modal',
  standalone: true,
  templateUrl: './add-filing-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule]
})
export class AddFilingModalComponent {
  close = output<void>();
  save = output<NewFiling>();

  newFiling = signal<NewFiling>({
    filingName: '',
    country: '',
    filingPeriod: '',
    amount: null,
    currency: 'USD',
    dueDate: '',
    riskLevel: 'Low',
    status: 'Pending'
  });

  updateField<K extends keyof NewFiling>(field: K, value: NewFiling[K]) {
    this.newFiling.update(filing => ({ ...filing, [field]: value }));
  }

  updateAmount(value: string | number | null) {
    if (value === '' || value === null) {
      this.newFiling.update(filing => ({ ...filing, amount: null }));
    } else {
      this.newFiling.update(filing => ({ ...filing, amount: Number(value) }));
    }
  }

  onSave() {
    this.save.emit(this.newFiling());
  }
}