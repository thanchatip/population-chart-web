export const processDataByYear = (data) => {
    const processedData = {};
  
    data.forEach((item) => {
      const { country, year, population } = item;
      if (!processedData[year]) {
        processedData[year] = {};
      }
      if (!processedData[year][country]) {
        processedData[year][country] = 0;
      }
      processedData[year][country] += population;
    });
  
    return processedData;
  };
  
  export const formatChartData = (processedData, year) => {
    const dataForYear = processedData[year] || {};
    const labels = Object.keys(dataForYear);
    const values = Object.values(dataForYear);
  
    return { labels, values };
  };
  