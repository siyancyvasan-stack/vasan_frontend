import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../../services/payroll.service';

@Component({
  selector: 'app-add-edit-employee-modal',
  standalone: true,
  templateUrl: './add-edit-employee-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
})
export class AddEditEmployeeModalComponent implements OnInit {
  employee = input<Employee | null>();
  close = output<void>();
  save = output<Employee | Omit<Employee, 'id'>>();

  isEditMode = computed(() => !!this.employee());
  
  employeeData = signal<Omit<Employee, 'id'> & { id?: string }>({
    name: '',
    email: '',
    jobTitle: '',
    department: '',
    status: 'Active',
    salaryStructure: ''
  });

  ngOnInit() {
    if (this.isEditMode()) {
      this.employeeData.set(this.employee()!);
    }
  }
  
  updateField<K extends keyof Employee>(field: K, value: Employee[K]) {
    this.employeeData.update(data => ({ ...data, [field]: value }));
  }

  onSave() {
    this.save.emit(this.employeeData());
  }
}