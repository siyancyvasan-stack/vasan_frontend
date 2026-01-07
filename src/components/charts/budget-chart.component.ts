
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BudgetData {
  category: string;
  actual: number;
  budget: number;
}

@Component({
  selector: 'app-budget-chart',
  standalone: true,
  templateUrl: './budget-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class BudgetChartComponent {
  data = input.required<BudgetData[]>();
}