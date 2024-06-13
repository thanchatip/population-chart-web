import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const App = () => {
    const [data, setData] = useState([]);
    const [country, setCountry] = useState();
    const [year, setYear] = useState('1950');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const response = await axios.get('http://localhost:3001/api/population');
                console.log('Data fetched:', response.data);
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
    }, []);

    console.log('data store',data);
 
                                  
  

    return (
        <div style={{margin:'40px', width: '100%', height: 500 }}>
            {loading ? (
                <p>Loading...</p>
            ) : (
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
            )}
        </div>
    );
};

export default App;
