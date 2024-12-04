import { View, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/(auth)/AuthContext'
import { FlashList } from '@shopify/flash-list'
import { getAllPlan } from '@/services/plan/plan'
import { Image } from 'expo-image'

const Trip4 = () => {

  const { session } = useAuth();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllPlan(session.userToken.accessToken);
        setData(result.data.plans.data);
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };
    fetchData();
  },[]);

  
  return (
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
    </View>
  )
}

export default Trip4