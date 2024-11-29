import { View } from 'react-native'
import "@/global.css";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenWrapperProps = {
    children: React.ReactNode;
}
const ScreenWrapper = ({children}: ScreenWrapperProps) => {
    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top+5 : 30;
  return (
    <View className='flex-1'>
      {children}
    </View>
  )
}

export default ScreenWrapper