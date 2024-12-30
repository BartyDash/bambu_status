import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
 } from 'chart.js/auto'
import { Line } from "react-chartjs-2"
import faker from 'faker'

function App() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const options = {
  responsive: true,
  maintainAspectRatio: false,
  // aspectRatio: 1,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
  tension: 0.2,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      type: 'linear',
    },
  },
  // animations: {
  //   tension: {
  //     duration: 1000,
  //     easing: 'linear',
  //     from: 1,
  //     to: 0,
  //     loop: true
  //   }
  // },
};

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const labels = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return date.toLocaleDateString();
}).reverse();

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -100, max: 100 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -100, max: 100 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

  return (
    <>
      <div className='p-[60px] h-96'>
        <Line className='' options={options} data={data} />
      </div>
    </>
  )
}

export default App
