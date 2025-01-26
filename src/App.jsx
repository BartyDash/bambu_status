import TemperatureChart from './TemperatureChart'
import BambuStats from './BambuStatus';
import bambu_text from './assets/bambu_text.svg';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

function App() {
  return (
    <div className='bg-zinc-800 text-white h-screen flex flex-col items-center font-orbitron font-semibold'>
      <h1 className='flex items-center justify-center text-[28px] tracking-widest'><img className='mr-3.5 mb-[3px]' src={bambu_text} alt="bambu" /><p>status</p></h1>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <BambuStats />
      </div>
      
      {/* <TemperatureChart /> */}
    </div>
  )
}

export default App
