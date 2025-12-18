import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tax-liability-chart',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-4">
      <div #chart class="w-[200px] h-[200px]"></div>
      <div class="flex flex-wrap justify-center gap-x-4 gap-y-2">
        @for(item of data; track item.category) {
          <div class="flex items-center">
            <span class="w-3 h-3 rounded-full mr-2" [style.background-color]="item.color"></span>
            <span class="text-sm text-gray-600">{{ item.category }} ({{item.value}}%)</span>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class TaxLiabilityChartComponent implements AfterViewInit {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');

  data = [
    { category: 'Payroll Tax', value: 60, color: '#8B5CF6' }, // purple
    { category: 'Related Taxes', value: 25, color: '#38BDF8' }, // sky
    { category: 'Other', value: 15, color: '#F472B6' }, // pink
  ];

  ngAfterViewInit(): void {
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
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .cornerRadius(8);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .style('stroke-width', '4px');
  }
}