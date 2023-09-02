import {createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/TVTracker';
import CountdownScreen from '../screens/CountdownScreen';
import TabStackNavigator from './navigationTabs';
import {theme} from '../theme/tailwind.config';
import tw from '../theme/tailwind';
import ViewMovieOrTVShowScreen from '../screens/ViewMovieOrTVShowScreen';
import ViewSeasonsScreen from '../screens/ViewSeasonsScreen';
import ViewEpisodesScreen from '../screens/ViewEpisodesScreen';
export const navigationRef = createNavigationContainerRef<any>();
const RootStack = createNativeStackNavigator<any>();

const RootStackNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Home"
        component={TabStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="ViewMovieOrTVShowScreen"
        component={ViewMovieOrTVShowScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="ViewSeasonsScreen"
        component={ViewSeasonsScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="ViewEpisodesScreen"
        component={ViewEpisodesScreen}
        options={{
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
