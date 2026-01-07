import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild, input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

interface BarData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-expense-bar-chart',
  standalone: true,
  template: `<div #chart class="w-full h-64"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseBarChartComponent implements AfterViewInit, OnChanges {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');
  data = input.required<BarData[]>();

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

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = el.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.4);

    const yMax = d3.max(data, d => d.value) || 0;
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")).tickSize(-width))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.1));

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.label)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#a855f7') // purple-600
      .attr('rx', 4)
      .attr('ry', 4);
  }
}