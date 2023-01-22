import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { api } from "../../lib/axios";
import { generateProgressPercentage } from "../../utils/generate-progress-percentage";
import { BackButton } from '../../components/BackButton';
import { ProgressBar } from '../../components/ProgressBar';
import { CheckBox } from '../../components/CheckBox';
import { Loading } from '../../components/Loading';
import { HabitEmpty } from "../../components/HabitEmpty";
interface Props {
  date: string;
}
interface dayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[]
}
export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<dayInfoProps | null>(null);
  const [completedHabits , setCompletedHabits] = useState<string[]>([])
  const route = useRoute();
  const {date } = route.params as Props;
  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date);
  const dayAndMouth = parsedDate.format('DD/MM');
  const dayOfWeek = parsedDate.format('dddd');

  useEffect(() => {
    fetchHabits();
  }, []);
  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get('/day', { params: { date } });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {
      console.table(error);
      Alert.alert('Ops', 'Não foi possível carregar as informações do hábito');

    } finally {
      setLoading(false);
    }
  }
  const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0
  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`)
    try {
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));

      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('OPS', 'Não foi possível atualizar o status do hábito;')
    }
  }
  if (loading) {
    return <Loading  />
  }
  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:100}}
      >
        <BackButton  />
        <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
            {dayOfWeek}
        </Text>

        <Text className='text-white font-extrabold text-3xl'>
          {dayAndMouth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx('mt-6', {
          ['opacity-50']:isDateInPast
        })}>

          {dayInfo?.possibleHabits.length ?
            dayInfo?.possibleHabits.map(habit => (

              <CheckBox
                checked={completedHabits.includes(habit.id)}
                key={habit.id}
                text={habit.title}
                disabled={isDateInPast}
                onPress={()=>handleToggleHabit(habit.id)}
              />))
              : <HabitEmpty />
          }
        </View>
        {
          isDateInPast && (
            <Text className='text-white mt-10'>
              Você não pode editar hábitos passados.
            </Text>
          )
        }
      </ScrollView>
    </View>
  );
}