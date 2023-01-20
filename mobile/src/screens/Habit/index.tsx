import { ScrollView, View, Text } from "react-native";
import { useRoute} from '@react-navigation/native'
import { BackButton } from "../../components/BackButton";
import dayjs from 'dayjs';
import { ProgressBar } from "../../components/ProgressBar";
import { CheckBox } from "../../components/CheckBox";
interface Props {
  date: string;
}
export function Habit() {
  const route = useRoute();
  const {date } = route.params as Props;
  const parsedDate = dayjs(date);
  const dayAndMouth = parsedDate.format('DD/MM')
  const dayOfWeek = parsedDate.format('dddd');
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

        <ProgressBar progress={70} />

        <View className='mt-6'>
          <CheckBox  text='Beber 2L de água'/>
          <CheckBox checked  text='Caminhar'/>
        </View>
      </ScrollView>
    </View>
  );
}