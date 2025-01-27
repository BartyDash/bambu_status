import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, startAt, onValue } from 'firebase/database';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const firebaseConfig = {
  apiKey: "AIzaSyA03zo5ibk8qwO8d3Xt9N_VPbzruxlUH0g",
  authDomain: "bambu-status.firebaseapp.com",
  databaseURL: "https://bambu-status-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bambu-status",
  storageBucket: "bambu-status.firebasestorage.app",
  messagingSenderId: "471746361801",
  appId: "1:471746361801:web:c7d9d6d141800553f99018"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const INTERVAL = 5 * 60 * 1000; // 5 minut w milisekundach
const HOURS_TO_SHOW = 24;
const POINTS_ON_CHART = (HOURS_TO_SHOW * 60 * 60 * 1000) / INTERVAL; // Ilość punktów na wykresie

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TemperatureChart = () => {
  const [displayData, setDisplayData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const tempRef = ref(database, 'temp_history');
      const twentyFourHoursAgo = Date.now() - (HOURS_TO_SHOW * 60 * 60 * 1000);
      
      const dataQuery = query(
        tempRef,
        orderByChild('date'),
        startAt(twentyFourHoursAgo.toString())
      );

      const unsubscribe = onValue(dataQuery, (snapshot) => {
        if (snapshot.exists()) {
          // Pobierz dane z Firebase i przekonwertuj na tablicę
          const firebaseData = [];
          snapshot.forEach((childSnapshot) => {
            const val = childSnapshot.val();
            if (val.date && val.bedTemper && val.chamberTemper && val.nozzleTemper) {
              firebaseData.push({
                date: parseInt(val.date),
                bedTemper: parseFloat(val.bedTemper),
                chamberTemper: parseFloat(val.chamberTemper),
                nozzleTemper: parseFloat(val.nozzleTemper)
              });
            }
          });

          // Przygotuj dane do wyświetlenia
          const now = Date.now();
          const startTime = now - (HOURS_TO_SHOW * 60 * 60 * 1000);
          const chartData = [];
          
          // Generuj punkty w 5-minutowych odstępach
          for (let i = 0; i <= POINTS_ON_CHART; i++) {
            const currentTime = startTime + (i * INTERVAL);
            if (currentTime > now) break;

            // Znajdź najbliższy punkt danych z Firebase
            const nearestPoint = firebaseData
              .filter(point => point.date <= currentTime)
              .sort((a, b) => b.date - a.date)[0];

            if (nearestPoint) {
              chartData.push({
                timestamp: currentTime,
                formattedTime: formatDate(currentTime),
                bedTemper: nearestPoint.bedTemper,
                chamberTemper: nearestPoint.chamberTemper,
                nozzleTemper: nearestPoint.nozzleTemper,
                isReal: nearestPoint.date === currentTime
              });
            }
          }

          setDisplayData(chartData);
          setError(null);
        } else {
          setError("Brak danych w bazie");
        }
      });

      return () => unsubscribe();
    } catch (err) {
      setError("Błąd inicjalizacji: " + err.message);
    }
  }, []);

  // Aktualizuj dane co 5 minut
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDisplayData(prevData => {
        // Usuń stare punkty i dodaj nowy
        const newData = prevData
          .filter(point => point.timestamp > now - (HOURS_TO_SHOW * 60 * 60 * 1000))
          .concat({
            timestamp: now,
            formattedTime: formatDate(now),
            bedTemper: prevData[prevData.length - 1]?.bedTemper,
            chamberTemper: prevData[prevData.length - 1]?.chamberTemper,
            nozzleTemper: prevData[prevData.length - 1]?.nozzleTemper,
            isReal: false
          });
        return newData;
      });
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-zinc-800 p-1 border border-gray-200 rounded shadow">
          <p className="text-gray-600">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: {item.value.toFixed(1)}°C
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (displayData.length === 0) {
    return <div className="p-4">Ładowanie danych...</div>;
  }

  return (
    <div className="w-screen h-full flex justify-end items-end">
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={displayData}
          // margin={{
          //   top: 20,
          //   right: 30,
          //   left: 20,
          //   bottom: 70
          // }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /> */}
          <XAxis
            dataKey="formattedTime"
            // angle={-45}
            textAnchor="middle"
            height={15}
            tick={{ fontSize: 12 }}
            interval={Math.ceil(displayData.length / 6)} // Około 12 etykiet na osi X
          />
          <YAxis
          width={35}
          tick={{ fontSize: 12 }}
          axisLine={false}
            // label={{ 
            //   value: 'Temperatura (°C)',
            //   angle: -90,
            //   position: 'middle',
            // }}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="colorBed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D9D9D9" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#D9D9D9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNozzle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00AE41" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#00AE41" stopOpacity={0}/>
            </linearGradient>
            {/* <linearGradient id="colorChamber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFBE31" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#FFBE31" stopOpacity={0}/>
            </linearGradient> */}
          </defs>
          {/* <Legend verticalAlign="bottom" height={36} align='left'/> */}
          <Area
            name="Nozzle temp."
            type="monotone"
            dataKey="nozzleTemper"
            stroke="#00AE41"
            dot={false}
            strokeWidth={1}
            fillOpacity={1}
            fill='url(#colorNozzle)'
            isAnimationActive={false}
          />
          <Area
            name="Bed temp."
            type="monotone"
            dataKey="bedTemper"
            stroke="#D9D9D9"
            dot={false}
            strokeWidth={1}
            fillOpacity={1}
            fill='url(#colorBed)'
            isAnimationActive={false}
          />
          <Area
            name="Chamber temp."
            type="monotone"
            dataKey="chamberTemper"
            stroke="#FFBE31"
            dot={false}
            strokeWidth={1}
            fillOpacity={1}
            fill='url(#colorChamber)'
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;