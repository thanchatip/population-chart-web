import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const App = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState('1950');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data for year:', year);
        const response = await axios.get(`http://localhost:3001/api/population`);
        const filteredData = response.data.filter(item =>{ 
            if(item.year === year)
               return item
        }
        )
        setData(filteredData);
        console.log(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [year]); 

  const handleYearChange = (e) => {
    setYear(e.target.value); 
  };

  return (
    <div style={{ margin: '40px', width: '100%', height: 500 }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <label>Select Year:</label>
          <select value={year} onChange={handleYearChange}>
            <option value="1950">1950</option>
            <option value="1960">1960</option>
            <option value="1970">1970</option>
            <option value="1980">1980</option>
            <option value="1990">1990</option>
            <option value="2000">2000</option>
            <option value="2010">2010</option>
            <option value="2020">2020</option>
          </select>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" width={800} height={500} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" padding={{ left: 10, right: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="population" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default App;
