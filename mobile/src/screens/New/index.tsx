import { useState } from 'react';
import { View, ScrollView,Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BackButton } from '../../components/BackButton';
import { CheckBox } from '../../components/CheckBox';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { api } from '../../lib/axios';

const availableWeekDays = ['Domingo', 'Segunda-feira',
  'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-Feira', 'Sábado'];

export function New() {
  const [WeekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  function handleWeekDay(weekDayindex:number) {
    if (WeekDays.includes(weekDayindex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayindex));
    } else {
      setWeekDays(prevState => [...prevState, weekDayindex]);
    }
  }
  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || WeekDays.length === 0) {
       return Alert.alert('Novo hábito', 'Informe o nome do hábito e escolha a periodicidade');
      }
      await api.post('/habits', { title, WeekDays });

      setTitle('');
      setWeekDays([]);
      Alert.alert('Novo hábito', 'Hábito criado com sucesso')
    } catch (error) {
      console.log(error);
      Alert.alert('Ops', 'Não foi possível criar o novo hábito')
    }
  }
 return(
  <View className='flex-1 bg-background px-8 pt-16'>
     <ScrollView
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{paddingBottom:100}}
     >
      <BackButton  />
       <Text className='mt-6 text-white font-extrabold text-3xl'>
         Criar hábito
       </Text>
       <Text className='mt-6 text-white font-semibold text-base'>
         Qual seu comprometimento?
       </Text>


       <TextInput
         className='h-12 mt-3 pl-4 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600'
         placeholder='Exercícios, dormir bem, etc...'
         placeholderTextColor={colors.zinc[400]}
         onChangeText={setTitle}
         value={title}
       />

       <Text className='text-white font-sm mt-4 mb-3 text-base'>
         Qual a recorrência?
       </Text>
       {availableWeekDays.map((week, index) => (
         <CheckBox
           key={week}
           text={week}
           checked={WeekDays.includes(index)}
            onPress={()=> handleWeekDay(index)}
         />
       ))}


       <TouchableOpacity
         activeOpacity={0.7}
         className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'
          onPress={handleCreateNewHabit}
       >
         <Feather name='check'
           size={20}
           color={colors.white}
           />

         <Text
          className='text-semibold text-base text-white ml-2'>
            Confirmar
         </Text>
       </TouchableOpacity>
    </ScrollView>
  </View>
)
}