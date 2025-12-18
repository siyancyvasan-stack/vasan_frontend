
import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-form-modal',
  standalone: true,
  templateUrl: './preview-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PreviewFormModalComponent {
  formName = input.required<string>();
  close = output<void>();
}