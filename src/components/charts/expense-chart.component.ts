import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  templateUrl: './expense-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ExpenseChartComponent implements AfterViewInit {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');

  data = [
    { category: 'Operations', value: 45, color: '#8B5CF6' },
    { category: 'IT Infrastructure', value: 25, color: '#38BDF8' },
    { category: 'Marketing', value: 20, color: '#22D3EE' },
    { category: 'Human Resources', value: 10, color: '#F472B6' },
  ];

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
    const data_ready = pie(this.data);

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