
import { ChangeDetectionStrategy, Component, output, signal, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaxForm } from '../tax-forms.component';

@Component({
  selector: 'app-generate-form-modal',
  standalone: true,
  templateUrl: './generate-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
})
export class GenerateFormModalComponent implements OnInit {
  form = input<TaxForm | null>();
  close = output<void>();
  generate = output<void>();

  selectedFormName = signal('');
  taxYear = signal(new Date().getFullYear());
  entityName = signal('Lumina Inc.');
  isGenerating = signal(false);
  
  availableForms = ['Form W-2', 'Form W-4', 'Form 941', 'Form 1099-NEC', 'Form 1120', 'CA Form DE 9', 'NY Form NYS-45'];

  ngOnInit() {
    if (this.form()) {
      this.selectedFormName.set(this.form()!.name);
    } else {
      this.selectedFormName.set(this.availableForms[0]);
    }
  }

  onGenerate() {
    if (!this.selectedFormName() || !this.taxYear() || !this.entityName()) {
        return;
    }
    this.isGenerating.set(true);
    // Simulate API call
    setTimeout(() => {
        this.isGenerating.set(false);
        this.generate.emit();
    }, 2000);
  }
}