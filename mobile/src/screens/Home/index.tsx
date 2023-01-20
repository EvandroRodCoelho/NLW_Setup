import { useNavigation } from '@react-navigation/native';
import { Text, View,ScrollView , Alert } from 'react-native';
import { HabitDay,daySize } from '../../components/HabitDay';
import { Header } from '../../components/Header';
import {generateDatefromYearBenning} from '../../utils/generate-Date-from-Year-Benning'
import { api } from '../../lib/axios';
import { useState, useEffect } from 'react';
import { Loading } from '../../components/Loading';
import dayjs from 'dayjs';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatefromYearBenning();
const minimumSummaryDateSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSize - datesFromYearStart.length;

type SummaryProps = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>
export function Home() {

  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get('/summary');
      console.log(response.data);
      setSummary(response.data);
    } catch (error) {
      Alert.alert('ops', 'Não foi possível carregar o sumario de hábitos.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  },[])
  if (loading) {
    return (
      <Loading  />
    );
  }
  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <Header />
      <View className='flex-row mt-6  mb-2  '>
        {weekDays.map((weekDay, index) => {
          return (
            <Text key={`${weekDay}-${index}`}
              className='text-zinc-400 text-xl font-bold text-center mx-1'
              style={{width: daySize}}
            >
              {weekDay}
            </Text>
          );
        } )}

      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:100}}
      >
        { summary  &&
          <View className='flex-row flex-wrap'>

            {datesFromYearStart.map((date) => {
              const dayWithHabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day');
              })

              return (
                <HabitDay
                  onPress={() => navigate('habit', { date: date.toISOString() })}
                  key={date.toString()}
                  date={date}
                  amountOfCompleted={dayWithHabits?.completed}
                  amountOfHabits={dayWithHabits?.amount}
                />
              );

            })}
            {amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{
                    width: daySize,
                    height: daySize
                  }}
                />
              ))}

          </View>
        }
      </ScrollView>
      </View>



  );
}