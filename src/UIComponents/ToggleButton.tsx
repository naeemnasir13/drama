import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '../theme/tailwind';

const ToggleButton = (
  text: string,
  selected: boolean,
  index: number,
  action: ((event: GestureResponderEvent) => void) | undefined,
) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={tw`flex-1 justify-center items-center ${
        selected ? ` bg-lightgrey` : `bg-header`
      }
      ${index == 1 ? `rounded-l-2` : index == 10 ? `rounded-r-2` : ``}
      `}>
      <Text style={tw`text-xs text-center text-white my-2 font-semibold`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ToggleButton;
