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
type ShowCoverSectionProps = {
  detailsData: any;
  selectedType: any;
};
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../theme/tailwind.config';
import {path_to_tmdbUri} from '../services/apiService';

const ShowCoverSection = React.memo(
  ({detailsData, selectedType, ...otherProps}: ShowCoverSectionProps) => {
    return (
      <View>
        <View style={tw`h-60 `}>
          <ImageBackground
            source={{uri: path_to_tmdbUri(detailsData.backdrop_path, null)}}
            resizeMode="cover"
            style={tw`w-full h-full flex-row `}></ImageBackground>
        </View>
        <View style={tw`mt-4 mx-2 `}>
          <Text style={tw`text-white text-2xl font-extrabold mb-2`}>
            {detailsData?.title
              ? detailsData.title
              : detailsData?.name
              ? detailsData.name
              : ''}
          </Text>
          <Text style={tw`text-lightgrey text-sm`}>
            {detailsData?.release_date
              ? detailsData.release_date
              : detailsData?.first_air_date
              ? detailsData.first_air_date
              : ''}
          </Text>
          {selectedType == 'MOVIES' && (
            <Text style={tw`text-lightgrey text-sm`}>
              {Math.floor(detailsData.runtime / 60)}h{' '}
              {Math.ceil(((detailsData.runtime / 60) % 1) * 60)}m
            </Text>
          )}
        </View>
      </View>
    );
  },
);

export default ShowCoverSection;
