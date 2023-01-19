import { generateDatefromYearBenning } from '../../utils/generate-date-from-year-benning';
import { HabitDay } from '../HabitDay';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatefromYearBenning();
const minimumSummaryDatesSize = 16 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;
export function SummaryComponent() {

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3 ">
        {weekDays.map((weekDay, i) => {
          return (
            <div
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex itens-center justify-center">
              {weekDay}
            </div>
          );
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-2">
        {summaryDates.map(date => {
          return (
            <HabitDay amount={5}
              completed={Math.round(Math.random() * 5)}
              key={date.toString()} />
          );
        })}
        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_,i) => {
          return (
            <div
              key={i}
              className="bg-zinc-900 w-10 h-10 text-white rounded m-2 text-left flex items-center justify-center opacity-40 cursor-not-allowed"/>
          );
        })}
      </div>
    </div>
  );
}
