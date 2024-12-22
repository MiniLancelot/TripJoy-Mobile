import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@/app/(auth)/AuthContext';
import { useTabStore } from "@/utils/store";

const UpdatePlan = () => {
    const { session } = useAuth();
      const sharedId = useTabStore((state) => state.sharedId);
  return (
    <View>
      <Text>{sharedId}</Text>
    </View>
  )
}

export default UpdatePlan