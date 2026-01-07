
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseService, ExpenseClaim } from '../../../services/expense.service';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-expense',
  standalone: true,
  templateUrl: './submit-expense.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule, NotificationComponent]
})
export class SubmitExpenseComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private router = inject(Router);
  
  isEditMode = signal(false);
  
  expenseClaim = signal<Omit<ExpenseClaim, 'id' | 'status' | 'employeeName'> & { id?: number; status?: 'Pending' | 'Approved' | 'Rejected'; employeeName?: string; }>({
    date: '',
    merchant: '',
    category: '',
    description: '',
    amount: null,
    currency: 'INR',
    tags: [],
    paymentMethod: 'Reimbursement'
  });

  receiptFile = signal<File | null>(null);
  receiptPreview = signal<string | null>(null);
  notification = signal<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  
  isScanning = signal(false);
  ocrResults = signal<{ merchant: string; amount: number; date: string } | null>(null);
  isDragging = signal(false);
  
  ngOnInit(): void {
    const expenseToEdit = this.expenseService.expenseToEdit();
    if (expenseToEdit) {
      this.isEditMode.set(true);
      this.expenseClaim.set(expenseToEdit);
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- File Handling ---
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.showNotification('Invalid file type. Please upload an image.', 'warning');
      return;
    }

    this.receiptFile.set(file);
    this.ocrResults.set(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      this.receiptPreview.set(e.target?.result as string);
      this.runMockOcr();
    };
    reader.readAsDataURL(file);
  }
  
  removeReceipt() {
    this.receiptFile.set(null);
    this.receiptPreview.set(null);
    this.ocrResults.set(null);
  }

  // --- OCR Simulation ---
  private runMockOcr() {
    this.isScanning.set(true);
    setTimeout(() => {
      const mockData = {
        merchant: 'Uber',
        amount: 850.75,
        date: this.formatDateForInput(new Date('2024-12-12'))
      };
      this.ocrResults.set(mockData);
      
      this.expenseClaim.update(claim => ({
        ...claim,
        merchant: mockData.merchant,
        amount: mockData.amount,
        date: mockData.date,
        category: 'Travel'
      }));

      this.isScanning.set(false);
    }, 2500);
  }

  // --- Tag Management ---
  addTag(tagInput: HTMLInputElement) {
    const tag = tagInput.value.trim();
    if (tag && !this.expenseClaim().tags.includes(tag)) {
      this.expenseClaim.update(claim => ({
        ...claim,
        tags: [...claim.tags, tag]
      }));
    }
    tagInput.value = '';
  }

  removeTag(tagToRemove: string) {
    this.expenseClaim.update(claim => ({
      ...claim,
      tags: claim.tags.filter(t => t !== tagToRemove)
    }));
  }

  // --- Form Field Updates ---
  updateClaimField(field: keyof Omit<ExpenseClaim, 'id' | 'status' | 'employeeName'>, value: any) {
    // Special handling for amount to convert it to a number
    if (field === 'amount') {
      value = value ? +value : null;
    }
    this.expenseClaim.update(claim => ({
      ...claim,
      [field]: value
    }));
  }

  // --- Form Actions ---
  submitForApproval() {
    const claimData = this.expenseClaim();
    if(!claimData.amount || !claimData.merchant || !claimData.date) {
        this.showNotification('Please fill all required fields.', 'warning');
        return;
    }
    
    if (this.isEditMode() && claimData.id) {
        this.expenseService.updateExpense(claimData as ExpenseClaim);
        this.showNotification('Expense updated successfully!', 'success');
    } else {
        this.expenseService.submitExpense(claimData);
        this.showNotification('Expense submitted for approval!', 'success');
    }

    this.resetForm();
    this.router.navigate(['/expense-management/my-expenses']);
  }

  saveAsDraft() {
    this.showNotification('Expense saved as draft.', 'info');
    this.resetForm();
    this.router.navigate(['/expense-management/my-expenses']);
  }
  
  cancel() {
    this.resetForm();
    this.showNotification('Action cancelled.', 'info');
    this.router.navigate(['/expense-management/dashboard']);
  }

  private resetForm() {
     this.expenseClaim.set({
        date: '',
        merchant: '',
        category: '',
        description: '',
        amount: null,
        currency: 'INR',
        tags: [],
        paymentMethod: 'Reimbursement'
      });
      this.removeReceipt();
      this.isEditMode.set(false);
      this.expenseService.setExpenseToEdit(null); // Clear state in service
  }

  private showNotification(message: string, type: 'success' | 'info' | 'warning'): void {
    this.notification.set({ message, type });
  }
}