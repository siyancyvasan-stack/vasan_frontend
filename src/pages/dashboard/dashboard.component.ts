
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import { CashFlowChartComponent } from '../../components/charts/cash-flow-chart.component';
import { BudgetChartComponent } from '../../components/charts/budget-chart.component';
import { ExpenseChartComponent } from '../../components/charts/expense-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KpiCardComponent,
    CashFlowChartComponent,
    BudgetChartComponent,
    ExpenseChartComponent,
  ],
})
export class DashboardComponent {}
