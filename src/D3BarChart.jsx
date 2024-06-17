import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './D3BarChart.css';

const D3BarChart = ({ data, labels }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (data.length === 0 || labels.length === 0) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 60, right: 30, bottom: 40, left: 100 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const y = d3.scaleBand()
      .domain(labels)
      .range([0, height])
      .padding(0.1);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([0, width]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Append gridlines
    const gridlines = g.append('g')
      .attr('class', 'gridlines');

    gridlines.selectAll('.gridline-x')
      .data(x.ticks(10))
      .enter().append('line')
      .attr('class', 'gridline-x')
      .attr('x1', d => x(d))
      .attr('y1', 0)
      .attr('x2', d => x(d))
      .attr('y2', height);

    gridlines.selectAll('.gridline-y')
      .data(y.domain())
      .enter().append('line')
      .attr('class', 'gridline-y')
      .attr('x1', 0)
      .attr('y1', d => y(d) + y.bandwidth() / 2)
      .attr('x2', width)
      .attr('y2', d => y(d) + y.bandwidth() / 2);

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(20));

    // Predefined array of colors
    const colorScale = d3.scaleOrdinal()
      .domain(labels)
      .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d, i) => y(labels[i]))
      .attr('height', y.bandwidth())
      .attr('width', d => x(d))
      .attr('fill', (d, i) => colorScale(labels[i])); // Apply color based on label

    // Add population labels to the right of each bar
    g.selectAll('.bar-label')
      .data(data)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => x(d) + 5) // Adjust position to the right of the bar
      .attr('y', (d, i) => y(labels[i]) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .text(d => d);

  }, [data, labels]);

  return (
    <svg ref={chartRef} width={1200} height={600}></svg>
  );
};

export default D3BarChart;
