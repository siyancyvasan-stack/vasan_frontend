
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-expense',
  standalone: true,
  templateUrl: './submit-expense.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class SubmitExpenseComponent {
  // Logic for expense submission will go here
}
