
import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild, input, effect } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

export interface ExpenseData {
  category: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  templateUrl: './expense-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ExpenseChartComponent implements AfterViewInit {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');
  data = input.required<ExpenseData[]>();

  constructor() {
    effect(() => {
      if (this.chartContainer() && this.data()) {
        this.createChart();
      }
    });
  }

  ngAfterViewInit(): void {
    // Defer chart creation to the next browser repaint cycle. This ensures that
    // the container element has been rendered and its dimensions are calculated,
    // which is crucial for D3's scaling functions.
    requestAnimationFrame(() => {
      if (this.chartContainer()) {
        this.createChart();
      }
    });
  }

  private createChart(): void {
    const chartData = this.data();
    if (!chartData || chartData.length === 0) return;

    const el = this.chartContainer()!.nativeElement;
    const width = 200;
    const height = 200;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;
    
    d3.select(el).select('svg').remove();

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<any>().value(d => d.value).sort(null);
    const data_ready = pie(chartData);

    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .cornerRadius(5);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');
  }
}