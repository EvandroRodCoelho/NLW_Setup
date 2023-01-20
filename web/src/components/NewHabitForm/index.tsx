import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState } from "react";

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]
export function NewHabitForm() {
  const [title, setTitle] = useState('');
  const [weekDays , setWekDays] = useState<number[]>([]);
  function createNewHabit(event:FormEvent) {
    event.preventDefault();

  }

  function handleToggleWeekDay(weekDay:number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay);
      setWekDays(weekDaysWithRemovedOne);
    } else {
      const weekDaysAddOne = [...weekDays, weekDay];
      setWekDays(weekDaysAddOne);
    }
  }
  return (
    <form onSubmit={createNewHabit} className='w-full flex flex-col mt-6 '>
      <label htmlFor='title' className='font-semibold leading-tight'>
        Qual seu Comprometimento?</label>
      <input id='title'
        placeholder='ex: Exercícios, dormir bem , etc... '
        autoFocus
        className='p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400'
        onChange={event => setTitle(event.target.value)}
      />
      <label htmlFor='' className='font-semibold leading-tight mt-4'>
        Qual a Recorrência?
      </label>

      <div className='mt-6 flex flex-col gap-2'>

        {availableWeekDays.map((weekDay, index) => (
          <Checkbox.Root
            key={weekDay}
            className='flex items-center gap-3 group'
            onCheckedChange={()=> handleToggleWeekDay(index) }
          >
            <div className='flex h-8 w-8 rounded-lg items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
              <Checkbox.Indicator>
                <Check  size={24} className='text-white'/>
              </Checkbox.Indicator>
            </div>
            <span className=' text-white leading-tight'>
              {weekDay}
            </span>
         </Checkbox.Root>
        ))}

      </div>

      <button type='submit' className='mt-6 rounded-lg p-4 gap-3 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500'>
        <Check size={20} weight='bold' />
        Confirmar
      </button>
    </form>
);
}
