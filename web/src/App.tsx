// import { Habit } from "./components/Habit";
import { Header } from './components/Header';
import { SummaryComponent } from './components/SummaryTable';
import './styles/global.css'

export function App() {

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className="w-full max-w-5xl  flex flex-col gap-16">
        <Header />
        <SummaryComponent />
      </div>
    </div>
  );
}


