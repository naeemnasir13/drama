import {Switch, Text, View} from 'react-native';
import tw from '../theme/tailwind';
import {theme} from '../theme/tailwind.config';
import {useMoviesAndShows} from '../hooks/useMoviesAndShows';
import {useEffect, useState} from 'react';
import Cache from '../utils/Cache';

export default function MoreScreen() {
  const {setTrackingNotifTypes} = useMoviesAndShows();
  const [trackingTypes, setTrackingTypes] = useState<string[]>([]);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    async function checkCache() {
      var types: string[] = (await Cache.get('movieNotificationTypes')) || [];
      setTrackingTypes(types);
    }
    if (initialising) {
      setInitialising(false);
      checkCache();
    }
  }, []);
  console.log(trackingTypes.indexOf('DAY') > 0);
  return (
    <View style={tw`h-full w-full bg-black`}>
      <Text style={tw`text-lightgrey mt-5 mx-3`}>COUNTDOWN NOTIFICATIONS</Text>
      <View style={tw`w-full bg-header`}>
        <View
          style={tw`w-full flex-row justify-between px-4 items-center border-b border-lightgrey text-white`}>
          <Text style={tw` text-white font-bold my-5`}>Day before</Text>
          <Switch
            trackColor={{false: '#767577', true: theme?.extend?.colors.blue}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async value => {
              setTrackingTypes(await setTrackingNotifTypes('DAY', value));
            }}
            value={trackingTypes.indexOf('DAY') > -1 ? true : false}
          />
        </View>
        <View
          style={tw`w-full flex-row justify-between px-4 items-center border-b border-lightgrey text-white`}>
          <Text style={tw` text-white font-bold my-5`}>Week before</Text>
          <Switch
            trackColor={{false: '#767577', true: theme?.extend?.colors.blue}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async value => {
              setTrackingTypes(await setTrackingNotifTypes('WEEK', value));
            }}
            value={trackingTypes.indexOf('WEEK') > -1 ? true : false}
          />
        </View>
      </View>
    </View>
  );
}
