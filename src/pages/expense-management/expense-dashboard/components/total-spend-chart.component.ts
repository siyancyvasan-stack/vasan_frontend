import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild, input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-total-spend-chart',
  standalone: true,
  template: `<div #chart class="w-full h-16"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalSpendChartComponent implements AfterViewInit, OnChanges {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');
  data = input.required<number[]>();

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

    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = el.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yMax = d3.max(data) || 0;
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);
      
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "spend-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#22d3ee").attr("stop-opacity", 0.3);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#22d3ee").attr("stop-opacity", 0);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#spend-gradient)")
      .attr("d", d3.area<number>()
        .x((d, i) => x(i))
        .y0(height)
        .y1(d => y(d))
        .curve(d3.curveCatmullRom)
      );

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#06b6d4') // cyan-500
      .attr('stroke-width', 2.5)
      .attr('d', d3.line<number>()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveCatmullRom)
      );
  }
}