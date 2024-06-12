import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState('Afghanistan');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await axios.get(
          `http://localhost:3001/api/population?country=${country}&page=${page}`
        );
        console.log('Data fetched:', response.data);
        const { data, totalPages } = response.data;
        const formattedData = data.map((item) => ({
          year: item.year,
          population: item.population,
        }));
        setData(formattedData);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [country, page]);

  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: 'Population',
        data: data.map((item) => item.population),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Population Growth in ${country}`,
      },
    },
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div style={{ width: '100%', height: 500 }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Line data={chartData} options={options} />
          <div>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
