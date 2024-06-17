import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import 'chart.js/auto';
import './style.css'; 
import D3BarChart from './D3BarChart';
import YearSlider from './YearSlider';
import ContinentLegend from './ContinentLegend';

const api_url = 'https://population-service.vercel.app';

const App = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(1950);
  const [loading, setLoading] = useState(true);
  const [yearOptions, setYearOptions] = useState([]);
  const [labels, setLabels] = useState([]);
  const [populations, setPopulations] = useState([]);
  const animationRef = useRef();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const yearOptionsResponse = await axios.get(`${api_url}/api/year-filters`);
        const yearOpts = yearOptionsResponse.data.map(Number);
        setYearOptions(yearOpts);
        setYear(yearOpts[0]);
      } catch (error) {
        console.error('Error fetching year options', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (year === undefined) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const populationResponse = await axios.get(`${api_url}/api/population?year=${year}`);
        const filteredData = populationResponse.data;
        setData(filteredData);

        filteredData.sort((a, b) => b.population - a.population);

        const labelsAxis = filteredData.map((item) => item.country);
        const populationsAxis = filteredData.map((item) => item.population);

        setLabels(labelsAxis);
        setPopulations(populationsAxis);
      } catch (error) {
        console.error('Error fetching population data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  useEffect(() => {
    if (yearOptions.length === 0) return;

    const startAnimation = () => {
      let index = yearOptions.indexOf(year);
      animationRef.current = setInterval(() => {
        index = (index + 1) % yearOptions.length;
        setYear(yearOptions[index]);
      }, 1000);
    };

    startAnimation();
    return () => clearInterval(animationRef.current);
  }, [yearOptions, year]);

  return (
    <div className="container">
     <div className="title">Population growth per country, 1950 to 2021</div>
     <div className="subtitle">Click on the legend below to filter by continent 👇</div>
     <ContinentLegend />  
        <div className="chart-content">                
          <D3BarChart data={populations} labels={labels} />
          <YearSlider year={year} setYear={setYear} yearOptions={yearOptions} />
        </div>
   
    </div>
  );
};

export default App;
