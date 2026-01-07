import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface PieData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-expense-pie-chart',
  standalone: true,
  templateUrl: './expense-pie-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ExpensePieChartComponent implements AfterViewInit, OnChanges {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');
  data = input.required<PieData[]>();

  ngAfterViewInit(): void {
    this.createChartWithDelay();
  }
  
  ngOnChanges(): void {
    if (this.chartContainer()) {
       this.createChartWithDelay();
    }
  }

  private createChartWithDelay(): void {
     requestAnimationFrame(() => {
      if (this.chartContainer() && this.data() && this.data().length > 0) {
        this.createChart();
      }
    });
  }

  private createChart(): void {
    const data = this.data();
    const el = this.chartContainer()!.nativeElement;
    d3.select(el).select('svg').remove();

    const width = 220;
    const height = 220;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;
    
    const svg = d3.select(el)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<PieData>().value(d => d.value).sort(null);
    const data_ready = pie(data);

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
      .style('stroke-width', '4px')
      .style('transition', 'opacity 0.2s')
      .on('mouseover', function() { d3.select(this).style('opacity', 0.8); })
      .on('mouseout', function() { d3.select(this).style('opacity', 1); });
  }
}