import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const ModernBarChart = ({ chartData }) => {
  const [options, setOptions] = useState({
    chart: {
      id: "expenses-chart",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { borderRadius: 10, horizontal: false, distributed: true },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.map((data) => data.name),
      labels: { style: { colors: "#9CA3AF" } },
    },
    yaxis: { labels: { style: { colors: "#9CA3AF" } } },
    tooltip: { theme: "dark" },
    fill: {
      colors: ["#34D399", "#3B82F6", "#FBBF24", "#F87171", "#A78BFA"],
    },
    grid: { borderColor: "#374151", strokeDashArray: 5 },
    legend: { show: false },
  });

  const [series, setSeries] = useState([
    { name: "Amount", data: chartData.map((data) => data.amount) },
  ]);

  // Update series and options when chartData changes
  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: chartData.map((data) => data.name),
      },
    }));

    setSeries([{ name: "Amount", data: chartData.map((data) => data.amount) }]);
  }, [chartData]); // Trigger re-render on chartData change

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default ModernBarChart;
