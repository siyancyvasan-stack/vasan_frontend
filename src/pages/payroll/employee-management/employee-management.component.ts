
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService, Employee } from '../../../services/payroll.service';
import { AddEditEmployeeModalComponent } from './components/add-edit-employee-modal/add-edit-employee-modal.component';
import { EmployeeDetailsModalComponent } from './components/employee-details-modal/employee-details-modal.component';
import { DeactivateConfirmModalComponent } from './components/deactivate-confirm-modal/deactivate-confirm-modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  templateUrl: './employee-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    FormsModule, 
    AddEditEmployeeModalComponent,
    EmployeeDetailsModalComponent,
    DeactivateConfirmModalComponent,
    NotificationComponent
  ],
  host: {
    '(document:click)': 'onDocumentClick()'
  }
})
export class EmployeeManagementComponent {
  private payrollService = inject(PayrollService);
  
  // Data from service
  private allEmployees = this.payrollService.getEmployees();

  // State signals
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(6);
  activeDropdown = signal<string | null>(null);
  
  // Modal states
  showAddEditModal = signal(false);
  showDetailsModal = signal(false);
  showDeactivateModal = signal(false);
  selectedEmployee = signal<Employee | null>(null);

  // Notification state
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);

  // Computed signals for derived state
  filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.allEmployees().filter(employee => 
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  totalPages = computed(() => Math.ceil(this.filteredEmployees().length / this.itemsPerPage()));

  paginatedEmployees = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredEmployees().slice(start, end);
  });
  
  paginationSummary = computed(() => {
    const total = this.filteredEmployees().length;
    if (total === 0) {
      return 'No results';
    }
    const start = (this.currentPage() - 1) * this.itemsPerPage() + 1;
    const end = Math.min(this.currentPage() * this.itemsPerPage(), total);
    return `Showing ${start} to ${end} of ${total} results`;
  });

  // UI Logic
  getStatusClass(status: string) {
    switch (status) {
      case 'Active': return 'bg-sky-100 text-sky-800';
      case 'On Leave': return 'bg-purple-100 text-purple-800';
      case 'Terminated': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  toggleDropdown(employeeId: string, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdown.set(this.activeDropdown() === employeeId ? null : employeeId);
  }
  
  onDocumentClick(): void {
    this.activeDropdown.set(null);
  }

  // --- Modal and Action Handlers ---

  onAddEmployee() {
    this.selectedEmployee.set(null);
    this.showAddEditModal.set(true);
  }
  
  onViewDetails(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showDetailsModal.set(true);
    this.activeDropdown.set(null);
  }

  onEditProfile(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showAddEditModal.set(true);
    this.activeDropdown.set(null);
  }
  
  onDeactivate(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showDeactivateModal.set(true);
    this.activeDropdown.set(null);
  }
  
  handleSaveEmployee(employeeData: Employee | Omit<Employee, 'id'>) {
    if ('id' in employeeData) {
      this.payrollService.updateEmployee(employeeData as Employee);
      this.showNotification('Employee profile updated successfully!', 'success');
    } else {
      this.payrollService.addEmployee(employeeData);
      this.showNotification('New employee added successfully!', 'success');
    }
    this.handleModalClose();
  }
  
  handleDeactivateConfirm() {
    const employee = this.selectedEmployee();
    if (employee) {
      this.payrollService.updateEmployee({ ...employee, status: 'Terminated' });
      this.showNotification(`${employee.name} has been deactivated.`, 'info');
    }
    this.handleModalClose();
  }

  handleModalClose() {
    this.showAddEditModal.set(false);
    this.showDetailsModal.set(false);
    this.showDeactivateModal.set(false);
    this.selectedEmployee.set(null);
  }
  
  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }

  // Pagination controls
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage() {
     if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
