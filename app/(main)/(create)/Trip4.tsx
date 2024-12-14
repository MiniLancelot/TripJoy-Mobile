import { View, Text, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/(auth)/AuthContext'
import { FlashList } from '@shopify/flash-list'
import { getAllPlan } from '@/services/plan/plan'
import { Image } from 'expo-image'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NestableScrollContainer } from 'react-native-draggable-flatlist'
import Trip2 from './Trip2'

const Trip4 = () => {

  const { session } = useAuth();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPlan(session.userToken.accessToken);
        // console.log(result.data)
        setData(result.data.plans.data);
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };
    fetchData();
  },[]);

  
  return (
    <GestureHandlerRootView>
      <ScrollView>
      <NestableScrollContainer>
    <View style={[{flex:1, backgroundColor:'white'}]}>
      <FlashList
      data={data}
      keyExtractor={(item) => item.id}
      estimatedItemSize={500}

      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <Text>{item.startDate}</Text>
          <Text>{item.endDate}</Text>
          <Text>{item.estimatedBudget}</Text>
          <Text>{item.provinceStartId}</Text>
          <Text>{item.provinceEndId}</Text>
          <Text>{item.method}</Text>
          <Text>{item.vehicle}</Text>
          <Image source={{ uri: item.avatar }} style={{ width: 200, height: 200 }} />
        </View>
      )}
      />
      <View style={{marginHorizontal: 30}}>
      <Trip2/>  
      </View>
      
    </View>
    </NestableScrollContainer>
         </ScrollView>
    </GestureHandlerRootView>
  )
}

export default Trip4