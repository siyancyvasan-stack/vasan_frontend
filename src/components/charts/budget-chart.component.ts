import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-chart',
  standalone: true,
  templateUrl: './budget-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class BudgetChartComponent {
  data = [
    { category: 'Marketing', actual: 90, budget: 100 },
    { category: 'IT', actual: 65, budget: 80 },
    { category: 'Sales', actual: 80, budget: 75 },
    { category: 'Ops', actual: 50, budget: 60 },
  ];
}