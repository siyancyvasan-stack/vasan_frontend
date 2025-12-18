import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-run-payroll',
  standalone: true,
  templateUrl: './run-payroll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class RunPayrollComponent {
  currentStep = signal(1);
  steps = [
    { number: 1, title: 'Timesheets' },
    { number: 2, title: 'Review Payroll' },
    { number: 3, title: 'Confirmation' },
    { number: 4, title: 'Submit' },
  ];

  goToStep(step: number): void {
    if (step <= this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    if (this.currentStep() < this.steps.length) {
      this.currentStep.update(s => s + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }
}