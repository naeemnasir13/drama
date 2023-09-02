import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
  Image,
  ImageBackground,
  View,
} from 'react-native';
import tw from '../theme/tailwind';
type MovieCardProps = {
  url: string;
  action: any;
  tracked: boolean;
  plusAction: any;
} & TouchableOpacityProps;
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../theme/tailwind.config';

const MovieCard = React.memo(({url, action, ...otherProps}: MovieCardProps) => {
  return (
    <TouchableOpacity onPress={action}>
      <ImageBackground
        source={{uri: url}}
        resizeMode="cover"
        imageStyle={tw`rounded-3`}
        {...otherProps}
        style={tw`w-35 h-62 flex-row my-2 `}>
        <TouchableOpacity
          style={tw`absolute right-3 bottom-3 rounded-full w-9  h-9 bg-header`}
          onPress={otherProps.plusAction}>
          <MaterialCommunityIcons
            name={otherProps.tracked ? 'check' : 'plus'}
            color={'#fff'}
            size={22}
            style={tw`my-auto mx-auto`}
          />
        </TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
});

export default MovieCard;
