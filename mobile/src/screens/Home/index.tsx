import { Text, View,ScrollView } from 'react-native';
import { HabitDay,daySize } from '../../components/HabitDay';
import { Header } from '../../components/Header';
import {generateDatefromYearBenning} from '../../utils/generate-Date-from-Year-Benning'
const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatefromYearBenning();
const minimumSummaryDateSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSize - datesFromYearStart.length;
export function Home() {
  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <Header />
      <View className='flex-row mt-6 px-8 pt-16'>
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
        <View className='flex-row flex-wrap'>
          {datesFromYearStart.map((date) => {
            return (
                <HabitDay key={date.toString()}/>
            );

          })}
          {amountOfDaysToFill > 0 && Array
          .from({ length: amountOfDaysToFill })
          .map((_, index) => (
            <View
              key={index}
              className="bg-zinc-900 rounded-lg border-2 m1 border-zinc-800 opacity-40"
              style={{
                width: daySize,
                height:daySize
              }}
            />
          ) )}
        </View>
      </ScrollView>
      </View>



  );
}