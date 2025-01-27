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
  window.onload = () => {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };
  
  return (
    <div className='bg-zinc-800 text-white h-screen flex flex-col items-center font-orbitron font-bold'>
      <div className='w-full h-full flex flex-col items-center'>
        <h1 className='flex justify-center m-5 text-[28px] tracking-widest'><img className='mr-3.5 mb-[3px]' src={bambu_text} alt="bambu" /><p>status</p></h1>
        <BambuStats />
      </div>
      
      <TemperatureChart />
    </div>
  )
}

export default App
