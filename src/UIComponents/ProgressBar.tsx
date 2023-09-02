import {View, Text} from 'react-native';
import tw from '../theme/tailwind';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';

type ProgressBarProps = {
  numerator: number;
  denominator: number;
};

const ProgressBar = React.memo((props: ProgressBarProps) => {
  var progressPercentage = props.numerator / props.denominator;
  return (
    <View style={tw`flex-row items-center`}>
      <View style={tw`bg-lightgrey h-2.5 flex-1 rounded-2`}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#7E84F7', '#FF72FF']} // Define your gradient colors
          style={[tw`h-full rounded`, {width: `${progressPercentage * 100}%`}]}
        />
      </View>
      <Text style={tw`text-lightgrey flex mx-2 `}>
        {props.numerator}/{props.denominator}
      </Text>
    </View>
  );
});

export default ProgressBar;
