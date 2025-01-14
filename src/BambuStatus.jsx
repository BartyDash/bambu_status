import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import bambu_lab_logo from './assets/bambu_lab_logo.svg';

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

const BambuStatus = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const statsRef = ref(database, '/');
      
      const unsubscribe = onValue(statsRef, (snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          setData(value.bambu_stats);
          setError(null);
        } else {
          setError("Brak danych w bazie");
        }
      }, (error) => {
        console.error("Błąd podczas odczytu:", error);
        setError(error.message);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Błąd podczas inicjalizacji:", err);
      setError("Błąd inicjalizacji: " + err.message);
    }
  }, []);


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Ładowanie danych...</div>;
  }

  return (
    <div className='font-orbitron font-semibold text-xl'>
      <img src={bambu_lab_logo} alt="Bambu Lab logo" />
      <p>Docelowa temperatura stołu: {data.bedTargetTemper}°C</p>
      <p>Temperatura stołu: {data.bedTemper}°C</p>
      <p>Temperatura komory: {data.chamberTemper}°C</p>
      <p>Kod błędu: {data.failReason}</p>
      <p>Stan GCODE: {data.gcodeState}</p>
      <p>Postęp: {data.mcPercent}%</p>
      <p>Kod błędu drukowania: {data.mcPrintErrorCode}</p>
      <p>Pozostały czas: {data.mcRemainingTime} min</p>
      <p>Docelowa temperatura dyszy: {data.nozzleTargetTemper}°C</p>
      <p>Temperatura dyszy: {data.nozzleTemper}°C</p>
      <p>Błąd drukowania: {data.printError}</p>
      <p>Nazwa zadania: {data.subtask_name}</p>
    </div>
  );
};

export default BambuStatus;