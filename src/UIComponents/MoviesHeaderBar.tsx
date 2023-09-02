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
type MoviesHeaderBarProps = {
  text: string;
  editing: boolean;
  editAction: any;
  buttonText: string;
  deleteAction: any;
  doneAction: any;
};
export default function MoviesHeaderBar(props: MoviesHeaderBarProps) {
  const sfi = useSafeAreaInsets();

  return (
    <View
      style={[
        tw`flex-row items-center w-full h-12 px-3 bg-header`,
        {paddingTop: sfi.top - 10, height: sfi.top + 45},
      ]}>
      <View style={tw`flex-row w-full h-full items-center`}>
        {!props.editing ? (
          <>
            <Text style={tw`text-center text-white  font-semibold mx-auto`}>
              {props.text}
            </Text>
            <TouchableOpacity
              style={tw`bg-header/20 flex-row  rounded-2 absolute right-0 mr-2 top-1/5 items-center`}
              onPress={props.editAction}>
              <Text style={tw`text-base font-semibold text-blue`}>Edit</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={tw`flex-row flex-1 items-center`}>
            <Text style={tw`text-white font-semibold mr-auto`}>
              {props.text}
            </Text>
            <View style={tw`flex-row`}>
              <TouchableOpacity
                style={tw`bg-header/20  items-center`}
                onPress={props.doneAction}>
                <Text style={tw`text-base font-semibold text-blue`}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-header/20 items-center ml-5`}
                onPress={props.deleteAction}>
                <Text style={tw`text-base font-semibold text-red`}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
