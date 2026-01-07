import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenerateFormModalComponent } from './components/generate-form-modal.component';
import { PreviewFormModalComponent } from './components/preview-form-modal.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

export interface TaxForm {
  name: string;
  title: string;
  category: 'Payroll' | 'Income Tax' | 'Contractor';
  jurisdiction: 'Federal' | 'State';
}

@Component({
  selector: 'app-tax-forms',
  standalone: true,
  templateUrl: './tax-forms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, 
    CommonModule, 
    GenerateFormModalComponent, 
    PreviewFormModalComponent, 
    NotificationComponent
  ]
})
export class TaxFormsComponent {
  searchQuery = signal('');
  jurisdictionFilter = signal('All');
  categoryFilter = signal('All');

  // Modal states
  showGenerateModal = signal(false);
  showPreviewModal = signal(false);
  selectedForm = signal<TaxForm | null>(null);
  
  // Notification state
  notification = signal<{ message: string; type: 'success' | 'info' } | null>(null);

  allForms = signal<TaxForm[]>([
    { name: 'Form W-2', title: 'Wage and Tax Statement', category: 'Payroll', jurisdiction: 'Federal' },
    { name: 'Form W-4', title: 'Employee\'s Withholding Certificate', category: 'Payroll', jurisdiction: 'Federal' },
    { name: 'Form 941', title: 'Employer\'s QUARTERLY Federal Tax Return', category: 'Payroll', jurisdiction: 'Federal' },
    { name: 'Form 1099-NEC', title: 'Nonemployee Compensation', category: 'Contractor', jurisdiction: 'Federal' },
    { name: 'Form 1120', title: 'U.S. Corporation Income Tax Return', category: 'Income Tax', jurisdiction: 'Federal' },
    { name: 'CA Form DE 9', title: 'Contribution Return and Report of Wages', category: 'Payroll', jurisdiction: 'State' },
    { name: 'NY Form NYS-45', title: 'Quarterly Combined Withholding', category: 'Payroll', jurisdiction: 'State' },
  ]);

  filteredForms = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const jurisdiction = this.jurisdictionFilter();
    const category = this.categoryFilter();

    return this.allForms().filter(form => {
      const matchesQuery = form.name.toLowerCase().includes(query) || form.title.toLowerCase().includes(query);
      const matchesJurisdiction = jurisdiction === 'All' || form.jurisdiction === jurisdiction;
      const matchesCategory = category === 'All' || form.category === category;
      return matchesQuery && matchesJurisdiction && matchesCategory;
    });
  });

  getCategoryClass(category: TaxForm['category']): string {
    switch (category) {
      case 'Payroll': return 'bg-purple-100 text-purple-800';
      case 'Income Tax': return 'bg-pink-100 text-pink-800';
      case 'Contractor': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  handleGenerateNewForm(): void {
    this.selectedForm.set(null);
    this.showGenerateModal.set(true);
  }

  handleGenerateForm(form: TaxForm): void {
    this.selectedForm.set(form);
    this.showGenerateModal.set(true);
  }

  handlePreviewForm(form: TaxForm): void {
    this.selectedForm.set(form);
    this.showPreviewModal.set(true);
  }

  handleDownloadForm(formName: string): void {
    // Simulate downloading a PDF. This is a base64 representation of a simple PDF.
    const pdfBase64 = "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZSAvUGFnZXMvQ291bnQgMS9LaWRzIFszIDAgUl0gPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZSAvUGFnZS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzIDw8L0ZvbnQgPDwvRjEgNCAwIFI+Pj4+L01lZGlhQm94IFswIDAgNjEyIDc5Ml0vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9UeXBlIC9Gb250L1N1YnR5cGUgL1R5cGUxL0Jhc2VGb250IC9IZWx2ZXRpY2E+PgplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggNzE+PgdzdHJlYW0KQkQKICAvRjEgMTYgVGYKICAxMDAgNzAwIFRkCiAgKFRoaXMgaXMgYSBkdW1teSBQREYgZm9yICcgKyBmb3JtTmFtZSArICcpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjMgMDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAwIG4gCjAwMDAwMDAyNDggMDAwMDAwIG4gCjAwMDAwMDAzMjAgMDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKNDM0CiUlRU9GCg==";
    
    try {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      this.showNotification(`Download for ${formName} has started.`, 'info');
    } catch (e) {
      console.error('Error decoding base64 string or creating PDF:', e);
      this.showNotification(`Could not initiate download for ${formName}.`, 'info'); // Use 'info' for errors as well
    }
  }

  handleModalClose(): void {
    this.showGenerateModal.set(false);
    this.showPreviewModal.set(false);
  }
  
  handleFormGenerated(): void {
    this.showGenerateModal.set(false);
    this.showNotification('Form generated successfully!', 'success');
  }

  private showNotification(message: string, type: 'success' | 'info'): void {
    this.notification.set({ message, type });
  }
}
