
import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component.ts';
import { CashFlowChartComponent } from '../../components/charts/cash-flow-chart.component.ts';
import { BudgetChartComponent, BudgetData } from '../../components/charts/budget-chart.component.ts';
import { ExpenseChartComponent, ExpenseData } from '../../components/charts/expense-chart.component.ts';
import { CommonModule } from '@angular/common';

// --- Data Interfaces ---
interface Kpi {
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

interface KpiData {
  cashOnHand: Kpi;
  accountsReceivable: Kpi;
  accountsPayable: Kpi;
  netProfit: Kpi;
}

interface PeriodData {
  kpis: KpiData;
  budgetData: BudgetData[];
  expenseData: ExpenseData[];
}


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
    CommonModule
  ],
})
export class DashboardComponent {
  // --- Header Period Selector State ---
  isPeriodDropdownOpen = signal(false);
  selectedPeriod = signal('FY 2024 • Period 03');
  periodOptions = [
    'FY 2024 • Period 03',
    'FY 2024 • Period 02',
    'FY 2024 • Period 01',
    'FY 2023 • Overall'
  ];

  // --- Cash Flow Chart State ---
  isTimeframeDropdownOpen = signal(false);
  selectedTimeframe = signal('This Week');
  timeframeOptions = ['This Week', 'This Month', 'This Quarter'];

  private weekData = [
    { label: 'Mon', inflow: 5000, outflow: 3000 },
    { label: 'Tue', inflow: 6000, outflow: 2500 },
    { label: 'Wed', inflow: 5500, outflow: 4500 },
    { label: 'Thu', inflow: 7500, outflow: 3000 },
    { label: 'Fri', inflow: 8000, outflow: 5000 },
    { label: 'Sat', inflow: 7000, outflow: 4500 },
    { label: 'Sun', inflow: 7200, outflow: 5500 },
  ];

  private monthData = [
    { label: 'Week 1', inflow: 25000, outflow: 18000 },
    { label: 'Week 2', inflow: 30000, outflow: 22000 },
    { label: 'Week 3', inflow: 28000, outflow: 25000 },
    { label: 'Week 4', inflow: 35000, outflow: 20000 },
  ];

  private quarterData = [
    { label: 'Month 1', inflow: 120000, outflow: 90000 },
    { label: 'Month 2', inflow: 135000, outflow: 110000 },
    { label: 'Month 3', inflow: 150000, outflow: 105000 },
  ];

  cashFlowChartData = computed(() => {
    switch (this.selectedTimeframe()) {
      case 'This Month':
        return this.monthData;
      case 'This Quarter':
        return this.quarterData;
      default:
        return this.weekData;
    }
  });
  
  // --- Period-based Data ---
  private allData: Map<string, PeriodData> = new Map([
    ['FY 2024 • Period 03', {
      kpis: {
        cashOnHand: { value: '$1,250,400', change: '+12.5%', changeType: 'positive' },
        accountsReceivable: { value: '$450,200', change: '0.0%', changeType: 'neutral', subtitle: '32 invoices pending' },
        accountsPayable: { value: '$128,500', change: '-5.2%', changeType: 'negative', subtitle: 'Due within 7 days' },
        netProfit: { value: '$840,000', change: '+8.4%', changeType: 'positive' },
      },
      budgetData: [
        { category: 'Marketing', actual: 90, budget: 100 }, { category: 'IT', actual: 65, budget: 80 },
        { category: 'Sales', actual: 80, budget: 75 }, { category: 'Ops', actual: 50, budget: 60 },
      ],
      expenseData: [
        { category: 'Operations', value: 45, color: '#8B5CF6' }, { category: 'IT Infra', value: 25, color: '#38BDF8' },
        { category: 'Marketing', value: 20, color: '#22D3EE' }, { category: 'HR', value: 10, color: '#F472B6' },
      ]
    }],
    ['FY 2024 • Period 02', {
      kpis: {
        cashOnHand: { value: '$1,180,200', change: '+10.1%', changeType: 'positive' },
        accountsReceivable: { value: '$465,000', change: '+2.1%', changeType: 'positive', subtitle: '28 invoices pending' },
        accountsPayable: { value: '$135,000', change: '-4.8%', changeType: 'negative', subtitle: 'Due within 14 days' },
        netProfit: { value: '$795,000', change: '+7.9%', changeType: 'positive' },
      },
      budgetData: [
        { category: 'Marketing', actual: 85, budget: 100 }, { category: 'IT', actual: 70, budget: 80 },
        { category: 'Sales', actual: 75, budget: 75 }, { category: 'Ops', actual: 55, budget: 60 },
      ],
      expenseData: [
        { category: 'Operations', value: 40, color: '#8B5CF6' }, { category: 'IT Infra', value: 30, color: '#38BDF8' },
        { category: 'Marketing', value: 18, color: '#22D3EE' }, { category: 'HR', value: 12, color: '#F472B6' },
      ]
    }],
    ['FY 2024 • Period 01', {
      kpis: {
        cashOnHand: { value: '$1,050,000', change: '+8.3%', changeType: 'positive' },
        accountsReceivable: { value: '$420,100', change: '-1.5%', changeType: 'negative', subtitle: '35 invoices pending' },
        accountsPayable: { value: '$142,300', change: '-3.1%', changeType: 'negative', subtitle: 'Due within 10 days' },
        netProfit: { value: '$720,000', change: '+6.2%', changeType: 'positive' },
      },
      budgetData: [
        { category: 'Marketing', actual: 80, budget: 90 }, { category: 'IT', actual: 60, budget: 70 },
        { category: 'Sales', actual: 70, budget: 70 }, { category: 'Ops', actual: 45, budget: 55 },
      ],
      expenseData: [
        { category: 'Operations', value: 50, color: '#8B5CF6' }, { category: 'IT Infra', value: 20, color: '#38BDF8' },
        { category: 'Marketing', value: 15, color: '#22D3EE' }, { category: 'HR', value: 15, color: '#F472B6' },
      ]
    }],
    ['FY 2023 • Overall', {
      kpis: {
        cashOnHand: { value: '$980,000', change: '+25.2%', changeType: 'positive' },
        accountsReceivable: { value: '$3,800,500', change: '+15.8%', changeType: 'positive', subtitle: 'Annual Total' },
        accountsPayable: { value: '$1,100,000', change: '-2.0%', changeType: 'negative', subtitle: 'Annual Total' },
        netProfit: { value: '$4,150,000', change: '+18.9%', changeType: 'positive' },
      },
      budgetData: [
        { category: 'Marketing', actual: 95, budget: 100 }, { category: 'IT', actual: 85, budget: 90 },
        { category: 'Sales', actual: 98, budget: 100 }, { category: 'Ops', actual: 80, budget: 85 },
      ],
      expenseData: [
        { category: 'Operations', value: 35, color: '#8B5CF6' }, { category: 'IT Infra', value: 28, color: '#38BDF8' },
        { category: 'Marketing', value: 22, color: '#22D3EE' }, { category: 'HR', value: 15, color: '#F472B6' },
      ]
    }],
  ]);

  currentPeriodData = computed(() => {
    return this.allData.get(this.selectedPeriod()) ?? this.allData.get('FY 2024 • Period 03')!;
  });

  togglePeriodDropdown() {
    this.isPeriodDropdownOpen.update(v => !v);
  }

  selectPeriod(period: string) {
    this.selectedPeriod.set(period);
    this.isPeriodDropdownOpen.set(false);
  }

  toggleTimeframeDropdown() {
    this.isTimeframeDropdownOpen.update(v => !v);
  }

  selectTimeframe(timeframe: string) {
    this.selectedTimeframe.set(timeframe);
    this.isTimeframeDropdownOpen.set(false);
  }
}