import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './YearSlider.css';

const YearSlider = ({ year, setYear, yearOptions }) => {
  const sliderRef = useRef();

  useEffect(() => {
    if (yearOptions.length === 0) return;

    const svg = d3.select(sliderRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 50 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([d3.min(yearOptions), d3.max(yearOptions)])
      .range([0, width])
      .clamp(true);

    const slider = svg.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    slider.append('line')
      .attr('class', 'track')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1]);

    slider.append('line')
      .attr('class', 'track-inset')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1]);

    slider.append('line')
      .attr('class', 'track-overlay')
      .attr('x1', x.range()[0])
      .attr('x2', x.range()[1])
      .call(d3.drag()
        .on('start.interrupt', () => slider.interrupt())
        .on('start drag', (event) => {
          const newYear = Math.round(x.invert(event.x));
          setYear(newYear);
        }));

    slider.insert('g', '.track-overlay')
      .attr('class', 'ticks')
      .attr('transform', `translate(0,18)`)
      .selectAll('text')
      .data(x.ticks(10))
      .enter()
      .append('text')
      .attr('x', x)
      .attr('text-anchor', 'middle')
      .text((d) => d);

    const handle = slider.insert('circle', '.track-overlay')
      .attr('class', 'handle')
      .attr('r', 9);

    handle.attr('cx', x(year));
  }, [year, yearOptions, setYear]);

  return (
    <svg ref={sliderRef} width={1000} height={50} />
  );
};

export default YearSlider;
