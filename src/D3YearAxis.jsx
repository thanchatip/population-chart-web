import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './D3YearAxis.css';

const D3YearAxis = ({ year, setYear, yearOptions }) => {
  const axisRef = useRef();

  useEffect(() => {
    // Clear previous axis
    d3.select(axisRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 30 },
      width = 1000 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;

    const svg = d3
      .select(axisRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(yearOptions))
      .range([0, width])
      .clamp(true);

    const xAxis = d3.axisBottom(x).tickFormat(d3.format("d")).ticks(yearOptions.length / 5);

    svg.append('g')
      .attr('transform', `translate(0,${height / 2})`)
      .call(xAxis);

    // Add brush
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("end", brushended);

    svg.append("g")
      .attr("class", "brush")
      .call(brush);

    function brushended({ selection }) {
      if (!selection) return;
      const [x0, x1] = selection;
      const newYear = Math.round(x.invert((x0 + x1) / 2));
      setYear(newYear);
      d3.select(this).call(brush.move, null);
    }
  }, [yearOptions, setYear]);

  return <div ref={axisRef} className="d3-year-axis"></div>;
};

export default D3YearAxis;
