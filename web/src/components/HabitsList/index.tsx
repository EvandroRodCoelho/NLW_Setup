import * as Checkbox  from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
interface HabitListProps {
  date: Date;
  onCompletedChanged: (habts:number) => void;
}
interface HabitsInfo {
  possibleHabits: {
  id: string;
  title: string;
  created_at: string;
}[],
  completedHabits: string[];
}
export function HabitsList({date , onCompletedChanged}:HabitListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString(),
      }
    }).then(response => {
      setHabitsInfo(response.data);
    })
  },[]);
    async function handleToggleHabit(habitId:string) {
      api.patch(`/habits/${habitId}/toggle`);
      const isHabitAlReadyCompleted = habitsInfo!.completedHabits.includes(habitId);
      let completedHabits: string[] = [];
      if (isHabitAlReadyCompleted) {
        completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
      } else {
        completedHabits = [...habitsInfo!.completedHabits, habitId];
      }
      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits
      });
      onCompletedChanged(completedHabits.length);
    }
  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());
 return(
   <div className='mt-6 flex flex-col gap-3'>
     {habitsInfo?.possibleHabits.map(habit => {

       return (
        <Checkbox.Root
           className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
           onCheckedChange={()=> handleToggleHabit(habit.id)}
           disabled={isDateInPast}
           checked={habitsInfo?.completedHabits.includes(habit.id)}
           key={habit.id} >


        <div className='flex h-8 w-8 rounded-lg items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors  group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background'>
          <Checkbox.Indicator>
            <Check  size={24} className='text-white'/>
          </Checkbox.Indicator>
        </div>
        <span className='group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 text-xl font-semibold text-white leading-tight'>
          {habit.title}
        </span>
      </Checkbox.Root>
       );
     })}

  </div>
)
}
