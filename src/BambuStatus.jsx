import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import bambu_lab_logo from './assets/bambu_lab_logo_gradient.svg';
import StatusTile from './StatusTile';

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

  const [porcentage, setPorcentage] = useState(0);

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
    <div className='text-xl w-full'>
      <div className='flex justify-center relative'>
        <img src={bambu_lab_logo} alt="" />
        <div className='absolute w-full h-full flex flex-col justify-end items-center'>
          <div className='grid grid-cols-2 gap-3'>
            <StatusTile statusTitle='nozzle' actualTemp={180} targetTemp={250} />
            <StatusTile statusTitle='bed' actualTemp={90} targetTemp={250} />
            <StatusTile statusTitle='chamber' actualTemp={70} />
            <StatusTile statusTitle='status' status={'PRINTING'} errorCode={0} />
            <div className="col-span-2 flex flex-col p-2 py-[9px] justify-center items-center bg-[#504F562B] backdrop-blur-sm rounded-2xl">
              <p className='min-w-0 text-ellipsis whitespace-nowrap max-w-[276px] overflow-hidden truncate'>Case_Loop6mm.stl</p>
            </div>
          </div>
          <div className='w-[340px] mt-[18px] mb-3.5'>
            <div className='w-full flex items-end justify-between'>
              <p className=''>36%</p>
              <p className='absolute left-1/2 transform -translate-x-1/2 font-semibold text-xs leading-[22px]'>35/150</p>
              <p>~0h19m</p>
            </div>
            <div className="w-full bg-[#D9D9D9] rounded-full h-7.5">
              <div className="bg-[#00AE41] h-7 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BambuStatus;