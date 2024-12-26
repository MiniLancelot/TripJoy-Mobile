// pages/step4.tsx
import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormStore } from '@/utils/useFormStore';

export default function Step4() {
  const router = useRouter();
  const { vehicle, setFormData } = useFormStore();

  return (
    <View>
      <TextInput
        placeholder="Vehicle"
        value={vehicle}
        onChangeText={(text) => setFormData('vehicle', text)}
      />
      <Button title="Hoàn thành" onPress={() => router.push('/(create-ai-plan)/CreateAiPlan')} />
    </View>
  );
}
