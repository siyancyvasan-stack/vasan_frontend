import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, viewChild, input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

interface ChartData {
  month: string;
  cost: number;
}

@Component({
  selector: 'app-cost-trend-chart',
  standalone: true,
  template: `<div #chart class="w-full h-64 relative"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostTrendChartComponent implements AfterViewInit, OnChanges {
  chartContainer = viewChild<ElementRef<HTMLDivElement>>('chart');
  data = input.required<ChartData[]>();

  ngAfterViewInit(): void {
    this.createChartWithDelay();
  }
  
  ngOnChanges(): void {
    if (this.chartContainer()) {
       this.createChartWithDelay();
    }
  }
  
  private createChartWithDelay(): void {
     // Defer chart creation to ensure the container is rendered and sized correctly.
     requestAnimationFrame(() => {
      if (this.chartContainer() && this.data() && this.data().length > 0) {
        this.createChart();
      }
    });
  }

  private createChart(): void {
    const data = this.data();
    const el = this.chartContainer()!.nativeElement;
    d3.select(el).select('svg').remove(); // Clear previous chart
    d3.select(el).select('.tooltip').remove(); // Clear previous tooltip

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = el.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('transform', 'translate(-50%, -120%)');
      
    // Define gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "cost-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#22d3ee").attr("stop-opacity", 0.4);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#a855f7").attr("stop-opacity", 0.05);
    
    // X axis
    const x = d3.scalePoint<string>()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.5);
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .call(g => g.select(".domain").remove());

    // Y axis
    const yMax = d3.max(data, d => d.cost) || 0;
    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${(d as number / 1000)}k`).tickSize(-width))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "#e5e7eb").attr("stroke-dasharray", "2,2"));
      
    // Area
    svg.append("path")
      .datum(data)
      .attr("fill", "url(#cost-gradient)")
      .attr("d", d3.area<ChartData>()
        .x(d => x(d.month)!)
        .y0(height)
        .y1(d => y(d.cost))
        .curve(d3.curveMonotoneX)
      );

    // Line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#67e8f9')
      .attr('stroke-width', 2.5)
      .attr('d', d3.line<ChartData>()
        .x(d => x(d.month)!)
        .y(d => y(d.cost))
        .curve(d3.curveMonotoneX)
      );
      
    // Dots with Tooltips
    svg.selectAll("dots")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", d => x(d.month)!)
        .attr("cy", d => y(d.cost))
        .attr("r", 5)
        .attr("fill", "#06b6d4")
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
          d3.select(event.currentTarget).transition().duration(200).attr('r', 8);
          tooltip.transition().duration(200).style('opacity', .9);
          tooltip.html(`${d.month}: <strong>${d3.format("$,.2f")(d.cost)}</strong>`)
            .style('left', `${x(d.month)! + margin.left}px`)
            .style('top', `${y(d.cost) + margin.top}px`);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget).transition().duration(200).attr('r', 5);
          tooltip.transition().duration(500).style('opacity', 0);
        });
  }
}