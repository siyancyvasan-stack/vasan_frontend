
import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-cash-flow-chart',
  standalone: true,
  template: `<div #chart class="w-full h-64"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowChartComponent implements AfterViewInit {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');

  private data = [
    { day: 'Mon', inflow: 5000, outflow: 3000 },
    { day: 'Tue', inflow: 6000, outflow: 2500 },
    { day: 'Wed', inflow: 5500, outflow: 4500 },
    { day: 'Thu', inflow: 7500, outflow: 3000 },
    { day: 'Fri', inflow: 8000, outflow: 5000 },
    { day: 'Sat', inflow: 7000, outflow: 4500 },
    { day: 'Sun', inflow: 7200, outflow: 5500 },
  ];

  ngAfterViewInit(): void {
    // Defer chart creation to the next browser repaint cycle. This ensures that
    // the container element has been rendered and its dimensions are calculated,
    // which is crucial for D3's scaling functions, especially in complex layouts.
    requestAnimationFrame(() => {
      if (this.chartContainer()) {
        this.createChart();
      }
    });
  }

  private createChart(): void {
    const el = this.chartContainer()!.nativeElement;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = el.clientHeight - margin.top - margin.bottom;

    d3.select(el).select('svg').remove();

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(this.data.map(d => d.day))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 8000])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .call(g => g.select(".domain").remove());

    svg.append('g')
      .call(d3.axisLeft(y).ticks(8).tickFormat(d3.format("~s")).tickSize(-width))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.1));

    const inflowArea = d3.area<any>()
      .x(d => x(d.day)!)
      .y0(height)
      .y1(d => y(d.inflow))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.data)
      .attr('fill', '#67e8f9')
      .attr('opacity', 0.4)
      .attr('d', inflowArea);

    const inflowLine = d3.line<any>()
      .x(d => x(d.day)!)
      .y(d => y(d.inflow))
      .curve(d3.curveMonotoneX);
      
    svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', 2.5)
      .attr('d', inflowLine);

    const outflowArea = d3.area<any>()
      .x(d => x(d.day)!)
      .y0(height)
      .y1(d => y(d.outflow))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.data)
      .attr('fill', '#ddd6fe')
      .attr('opacity', 0.5)
      .attr('d', outflowArea);

    const outflowLine = d3.line<any>()
      .x(d => x(d.day)!)
      .y(d => y(d.outflow))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#9333ea')
      .attr('stroke-width', 2.5)
      .attr('d', outflowLine);

    svg.selectAll(".inflow-dot")
      .data(this.data)
      .enter().append("circle")
      .attr("class", "inflow-dot")
      .attr("cx", d => x(d.day)!)
      .attr("cy", d => y(d.inflow))
      .attr("r", 4)
      .attr("fill", "#06b6d4");

    svg.selectAll(".outflow-dot")
      .data(this.data)
      .enter().append("circle")
      .attr("class", "outflow-dot")
      .attr("cx", d => x(d.day)!)
      .attr("cy", d => y(d.outflow))
      .attr("r", 4)
      .attr("fill", '#9333ea');
  }
}
