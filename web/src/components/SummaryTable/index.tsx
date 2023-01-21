import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { generateDatefromYearBenning } from '../../utils/generate-date-from-year-benning';
import { HabitDay } from '../HabitDay';

type SummaryType = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[]
const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatefromYearBenning();
const minimumSummaryDatesSize = 16 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;
export function SummaryComponent() {
  const [summary, setSummary] = useState<SummaryType>([]);
  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data);
    })
  },[])
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
        {summary.length > 0 && summaryDates.map(date => {

          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day');
          })
          return (
            <HabitDay amount={dayInSummary?.amount}
              date={date}
              defaultCompleted={dayInSummary?.completed}
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
