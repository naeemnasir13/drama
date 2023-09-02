import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '../theme/tailwind';
import {useMoviesAndShows} from '../hooks/useMoviesAndShows';
import {navigationRef} from '../navigation/navigationRoot';
import {path_to_tmdbUri} from '../services/apiService';
import ProgressBar from '../UIComponents/ProgressBar';
import StyledButton from '../UIComponents/StyledButton';
import {useEffect, useState} from 'react';
import MoviesHeaderBar from '../UIComponents/MoviesHeaderBar';
import CheckBox from '@react-native-community/checkbox';

export default function CountdownScreen() {
  const {
    trackedMovies,
    selectedShowID,
    selectedType,
    storeTVShow,
    getTrackedIndicator,
    loading,
    removeMoviesFromTracking,
  } = useMoviesAndShows();
  const [editing, setEditing] = useState(false);
  const [trackedMoviesTemp, setTrackedMoviesTemp] = useState([
    ...(trackedMovies || []),
  ]);

  function calculateDaysUntilDate(targetDate: string) {
    const currentDate = new Date();
    const targetDateObj = new Date(targetDate);

    // Calculate the time difference in milliseconds
    const timeDiff = targetDateObj.getTime() - currentDate.getTime();

    // Convert the time difference to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  }

  useEffect(() => {
    setTrackedMoviesTemp(trackedMovies);
  }, [trackedMovies]);

  const renderTrackedMovieItem = (show: any) => {
    if (show && show.poster_path)
      return (
        <TouchableOpacity
          key={show.id}
          style={tw`flex-col flex-1 w-full `}
          onPress={() => {
            // setSelectedShow(show);
            // navigationRef.navigate('ViewSeasonsScreen');
          }}>
          <View style={tw`w-full flex-row flex-1 py-3 items-center`}>
            {editing && (
              <View style={tw`w-5 h-5 mr-2 `}>
                <CheckBox
                  value={show.editing}
                  onValueChange={() => {
                    show.editing = true;
                    console.log(show);
                  }}
                  style={tw`w-5 h-5`}
                />
              </View>
            )}
            <ImageBackground
              source={{uri: path_to_tmdbUri(show.poster_path, 'low')}}
              resizeMode="cover"
              imageStyle={tw`rounded-3`}
              style={tw`w-12 h-16 flex-row`}
            />

            <View style={tw`flex-col justify-center  mx-3 flex-1 `}>
              <Text style={tw`text-white  text-base font-semibold`}>
                {show.original_title}
              </Text>
              <Text style={tw`text-lightgrey  text-xs font-semibold`}>
                {show.release_date}
              </Text>
            </View>
            <View key={2} style={tw`flex-col justify-center mr-2 ml-auto`}>
              <Text style={tw`text-blue text-sm text-center font-semibold `}>
                {calculateDaysUntilDate(show.release_date) - 1}
              </Text>
              <Text style={tw`text-blue text-sm text-center font-semibold `}>
                days
              </Text>
            </View>
          </View>
          <View style={tw`border-t border-lightgrey h-0 mx-15 my-1`} />
        </TouchableOpacity>
      );
  };

  return (
    <View style={tw`bg-black h-full w-full `}>
      <MoviesHeaderBar
        text={'Countdown'}
        editing={editing}
        editAction={() => {
          setEditing(true);
        }}
        buttonText={'Edit'}
        deleteAction={() => {
          removeMoviesFromTracking(trackedMoviesTemp);
          // setEditing(false);
        }}
        doneAction={() => {
          setEditing(false);
        }}
      />
      <View style={tw`bg-header mx-3 py-5 px-2 mt-3 rounded-t-2`}>
        <Text style={tw`text-white font-semibold  mx-1`}>Movies</Text>
      </View>
      {trackedMoviesTemp && trackedMoviesTemp.length > 0 && (
        <ScrollView
          style={tw`mb-2 mx-3 `}
          contentContainerStyle={tw` bg-header rounded-b-2  px-2`}>
          {trackedMoviesTemp.map((movie: any) => renderTrackedMovieItem(movie))}
        </ScrollView>
      )}
    </View>
  );
}
