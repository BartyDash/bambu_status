import React, { useEffect, useState } from "react";
import { database, ref, query, orderByChild, startAt } from "./firebaseConfig";

const ChartComponent = () => {
   const [chartData, setChartData] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         const tempHistoryRef = ref(database, "temp_history");
         const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // Milisekundy sprzed 7 dni

         const recentDataQuery = query(tempHistoryRef, orderByChild("date"), startAt(sevenDaysAgo));
         const snapshot = await recentDataQuery.once("value");

         if (snapshot.exists()) {
            const data = snapshot.val();
            const parsedData = Object.values(data).map(item => ({
               bedTemper: parseFloat(item.bedTemper),
               chamberTemper: parseFloat(item.chamberTemper),
               nozzleTemper: parseFloat(item.nozzleTemper),
               date: new Date(parseInt(item.date))
            }));
            setChartData(parsedData);
         }
      };

      fetchData();
   }, []);

   return (
      <div>
         <h1>Temperature Chart</h1>
         {/* Wykres Chart.js tutaj */}
      </div>
   );
};

export default ChartComponent;