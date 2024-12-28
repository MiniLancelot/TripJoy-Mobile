// pages/summary.tsx
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormStore } from '@/utils/useFormStore';

export default function CreateAiPlan() {
  const router = useRouter();
  const { provinceStart, provinceEnd, startDate, endDate, estimatedBudget, vehicle, resetForm } = useFormStore();

  return (
    <View>
      <Text>Province Start: {provinceStart.provinceName}</Text>
      <Text>Province End: {provinceEnd.provinceName}</Text>
      <Text>Start Date: {startDate}</Text>
      <Text>End Date: {endDate}</Text>
      <Text>Estimated Budget: {estimatedBudget}</Text>
      <Text>Vehicle: {vehicle}</Text>
      <Button
        title="Start Over"
        onPress={() => {
          resetForm();
          router.push('/step1');
        }}
      />
    </View>
  );
}
