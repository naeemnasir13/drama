import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {navigationRef} from '../navigation/navigationRoot';
import tw from '../theme/tailwind';
import {theme} from '../theme/tailwind.config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import {hStyles} from './headerStyles';
type EpisodesHeaderBarProps = {
  selectionAction: any;
  selectionText: string;
};
export default function EpisodesHeaderBar(props: EpisodesHeaderBarProps) {
  const sfi = useSafeAreaInsets();

  return (
    <View
      style={[
        tw`flex-row items-center w-full h-12 px-3 bg-header`,
        {paddingTop: sfi.top - 10, height: sfi.top + 45},
      ]}>
      <View style={tw`flex-row w-full h-full justify-center items-center`}>
        <TouchableOpacity
          style={tw`bg-header/20 flex-row p-2 rounded-2 absolute left-0 top-1/5 items-center`}
          onPress={() => {
            navigationRef.goBack();
          }}>
          <Ionicons name="arrow-back" size={25} color={'#FFF'} />
          {/* <Text style={tw`ml-2 text-tertiary font-semibold`}>Back</Text> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-header/20 flex-row p-2 rounded-2 absolute right-0 top-1/5 items-center`}
          onPress={props.selectionAction}>
          <Text style={tw`ml-2 text-white font-semibold`}>
            {props.selectionText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
