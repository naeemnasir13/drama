import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  movieSearch,
  path_to_tmdbUri,
  tvSearch,
  useGetTrendingMovies,
  useGetTrendingTvShows,
  useMovieSearch,
  useTvSearch,
} from '../services/apiService';
import {useMoviesAndShows} from '../hooks/useMoviesAndShows';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useEffect, useState} from 'react';
import MovieCard from '../UIComponents/MovieCard';
import tw from '../theme/tailwind';
import ToggleButton from '../UIComponents/ToggleButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme} from '../theme/tailwind.config';
import {navigationRef} from '../navigation/navigationRoot';
export default function ViewMovieOrTVShowScreen() {
  const [showData, setShowData] = useState<any>();
  const [finalData, setFinalData] = useState<any>();

  const [searchTermRef, setSearchTermRef] = useState<any>('');
  const [searchTerm, setSearchTerm] = useState<any>('');
  const {
    setSelectedShowID,
    setSelectedShow,
    selectedType,
    setSelectedType,
    trackedShows,
    getTrackedIndicator,
    loading,
    storeTVShow,
  } = useMoviesAndShows();
  const safeArea = useSafeAreaInsets();

  const {
    data: moviesData,
    isLoading: moviesLoading,
    isError: moviesError,
    error: moviesErrorData,
  } = useGetTrendingMovies(1);
  const {
    data: tvData,
    isLoading: tvLoading,
    isError: tvError,
    error: tvErrorData,
  } = useGetTrendingTvShows(1);

  useEffect(() => {
    if (selectedType === 'MOVIES' && moviesData) {
      setSearchTerm('');
      setShowData(moviesData.results);
    } else if (selectedType === 'TVSHOWS' && tvData) {
      setSearchTerm('');
      setShowData(tvData.results);
    }
  }, [selectedType, moviesData, tvData]);

  const handleSearchTermChange = text => {
    if (selectedType == 'MOVIES') {
      movieSearch(searchTermRef)
        .then(results => {
          if (results) {
            setShowData(results.results);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      if (selectedType == 'TVSHOWS') {
        tvSearch(searchTermRef)
          .then(results => {
            if (results) {
              setShowData(results.results);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  if (moviesLoading || tvLoading) {
    return (
      <View style={tw`h-full w-full bg-black justify-center items-center`}>
        <ActivityIndicator
          color={theme.extend.colors.lightgrey}
          size={'large'}
        />
      </View>
    );
  }

  if (moviesError || tvError) {
    const error = moviesError ? moviesErrorData : tvErrorData;
    return (
      <View style={tw`h-full w-full bg-black justify-center items-center`}>
        <Text style={tw`text-lightgrey text-lg`}>
          An error occured while retrieving the movies and tv shows.
        </Text>
      </View>
    );
  }

  const MovieTypeToggle = () => {
    return (
      <View style={tw`items-center flex-row rounded-2 my-2`}>
        {ToggleButton('Movies', selectedType == 'MOVIES', 1, () =>
          setSelectedType('MOVIES'),
        )}
        {ToggleButton('TV Shows', selectedType == 'TVSHOWS', 10, () =>
          setSelectedType('TVSHOWS'),
        )}
      </View>
    );
  };

  let timeoutId;

  return (
    <View style={tw`bg-black `}>
      <View style={tw`mx-3 h-full `}>
        {MovieTypeToggle()}
        <View style={tw`bg-header rounded-2 flex-row items-center px-2`}>
          <Ionicons name="search" color={'#5B5A60'} size={18} />
          <TextInput
            placeholder="Movies & TV Shows"
            value={searchTermRef}
            onBlur={value => {
              console.log('here');
              handleSearchTermChange(searchTermRef);
            }}
            onChangeText={text => {
              console.log('here2');

              setSearchTermRef(text);
            }}
            placeholderTextColor={'#5B5A60'}
            style={tw` ml-2 py-2 text-white`}
          />
        </View>
        <Text style={tw`text-white font-bold mt-2 mb-1 `}>Coming Soon</Text>

        <ScrollView
          contentContainerStyle={[tw`flex-row flex-wrap justify-around mx-2 `]}
          showsHorizontalScrollIndicator={false}>
          {showData &&
            showData.length > 0 &&
            showData.map((item: any) => (
              <MovieCard
                key={item.id}
                url={path_to_tmdbUri(item.poster_path, 'low')}
                tracked={getTrackedIndicator(item)}
                action={() => {
                  setSelectedShow(item);
                  setSelectedShowID(item.id);
                  navigationRef.navigate('ViewMovieOrTVShowScreen');
                }}
                plusAction={() => {
                  item.loading = true;
                  storeTVShow(item, true)
                    .then(res => {
                      item.loading = false;
                    })
                    .catch(err => {
                      console.log(err);
                      item.loading = false;
                    });
                }}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
}
