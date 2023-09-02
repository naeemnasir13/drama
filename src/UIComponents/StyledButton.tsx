import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import tw from '../theme/tailwind';
type StyledButtonProps = {
  title: string;
  loading?: boolean;
  type?: string;
} & TouchableOpacityProps;

const StyledButton = React.memo(
  ({title, loading, disabled, type, ...otherProps}: StyledButtonProps) => {
    return (
      <TouchableOpacity
        style={tw.style(
          ` flex-row my-4 px-15 py-2 h-10 justify-center rounded-4 items-center bg-blue`,
        )}
        {...otherProps}>
        {loading ? (
          <ActivityIndicator color="#fff" size={23} />
        ) : (
          <Text style={tw`text-white font-bold `}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);

export default StyledButton;
