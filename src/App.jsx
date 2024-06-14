import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Bar } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import 'chart.js/auto';
import './style.css'; 

const api_url = 'https://population-service.vercel.app';

const App = () => {
  const [data, setData] = useState();
  const [year, setYear] = useState(1950);
  const [loading, setLoading] = useState(true);
  const [yearOptions, setYearOptions] = useState();
  const [labels, setLabels] = useState();
  const [populations, setPopulations] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data for year:', year);
        const [populationResponse, yearOptionsResponse] = await Promise.all([
          axios.get(`${api_url}/api/population?year=${year}`),
          axios.get(`${api_url}/api/year-filters`),
        ]);

        const filteredData = populationResponse.data;
        setData(filteredData);
        setYearOptions(await yearOptionsResponse.data.map(Number));

        // Sort filteredData by population in descending order
        filteredData.sort((a, b) => b.population - a.population);

        const labelsAxis = await filteredData.map((item) => item.country);
        const populationsAxis = await filteredData.map((item) => item.population);

        setLabels(labelsAxis);
        setPopulations(populationsAxis);

        console.log(filteredData);
      } catch (error) {
        console.error('Error fetching the data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };  

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Population',
        data: populations,
        backgroundColor: '#f87cd3',
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Display bars vertically
    responsive: true,
    scales: {
      x: {
          position: 'top',
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },      
    },
  };


  return (
    <div className="container">
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
        <div className="title">Population growth per country, 1950 to 2021</div>
          <label className="select-label">Select Year:</label>
          <Select className="select-box" value={year} onChange={handleYearChange}>
            {yearOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <div className="chart-container">
            <Bar data={chartData} options={options} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
