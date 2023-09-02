/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from 'react';
import {Animated, Linking, Platform} from 'react-native';
import {navigationRef} from '../navigation/navigationRoot';
import useStore from '../store/useStore';
import {
  fetchApi,
  getTvShowDetails,
  getTvShowEpisodes,
  useGetTvShowEpisodes,
  useGetUpcomingMovies,
} from '../services/apiService';
import Cache from '../utils/Cache';
import Toast from 'react-native-toast-message';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

export const useMoviesAndShows = () => {
  const {
    selectedShow,
    setSelectedShow,
    setSelectedShowID,
    selectedShowID,
    selectedType,
    setSelectedType,
    trackedShows,
    setTrackedShows,
    selectedSeason,
    setSelectedSeason,
    trackedMovies,
    setTrackedMovies,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    async function checkCache() {
      setTrackedShows(await Cache.get('tvShowsTrackerList'));
      setTrackedMovies(await Cache.get('moviesTrackerList'));

      console.log('pulled from cache');
    }
    if (initialising) {
      setInitialising(false);
      checkCache();
    }
  }, []);

  async function removeMoviesFromTracking(moviesList: any): Promise<any> {
    const list: any[] = trackedMovies || [];
    console.log(moviesList);
    if (moviesList) {
      moviesList
        .filter((movie: any) => movie.editing == true)
        .forEach((movie: any) => {
          console.log('Deleting ' + movie.original_title);
          const existingIndex = list.findIndex(
            (item: any) => item.id === movie.id,
          );

          list.splice(existingIndex, 1);
          setLoading(false);
        });
      setTrackedMovies(list);
      await Cache.set('moviesTrackerList', list);
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  const getTrackedIndicator = (show: any) => {
    if (selectedType == 'TVSHOWS') {
      if (show && trackedShows) {
        var showTracked =
          trackedShows.findIndex((item: any) => item.id == show.id) > -1;
        return showTracked;
      }
    } else {
      if (show && trackedMovies) {
        var movieTracked =
          trackedMovies.findIndex((item: any) => item.id == show.id) > -1;
        return movieTracked;
      }
      return false;
    }
  };

  const setSeasonWatched = (seasonnumber: any, watchedValue: boolean) => {
    console.log('here');
    var tempShow = selectedShow;
    console.log('here1');

    var seasonIndex = tempShow.seasons.findIndex(
      (s: any) => s.season_number == seasonnumber,
    );
    console.log('here2', JSON.stringify(seasonIndex));

    var tempSeason = selectedShow.seasons[seasonIndex];
    // console.log('here3', JSON.stringify(tempSeason));

    var updatedEpisodes = tempSeason.episodes.map((ep: any) => {
      return {...ep, watched: watchedValue};
    });
    // console.log('here4', JSON.stringify(updatedEpisodes));

    tempSeason = {
      ...tempSeason,
      episodes: updatedEpisodes,
      watched: watchedValue,
    };
    // console.log('here5', JSON.stringify(tempSeason));

    if (
      selectedSeason &&
      selectedSeason.season_number === tempSeason.season_number
    ) {
      setSelectedSeason(tempSeason);
    }

    tempShow.seasons[seasonIndex] = tempSeason;
    // console.log('her e7');
    console.log(JSON.stringify(tempShow));
    setSelectedShow(tempShow);
    var trackedShowsTemp = trackedShows;
    var index = trackedShowsTemp.findIndex(
      (show: any) => show.id == tempShow.id,
    );
    trackedShowsTemp[index] = tempShow;
    setTrackedShows(trackedShowsTemp);
    Cache.set('tvShowsTrackerList', trackedShowsTemp);
  };

  const setEpisodeWatched = (seasonNumber, episodeNumber, watchedValue) => {
    const tempShow = {...selectedShow};
    const seasonIndex = tempShow.seasons.findIndex(
      s => s.season_number === seasonNumber,
    );
    var tempSeason = {...selectedSeason};
    const updatedEpisodeIndex = tempSeason.episodes.findIndex(
      ep => ep.episode_number === episodeNumber,
    );
    tempSeason.episodes[updatedEpisodeIndex] = {
      ...tempSeason.episodes[updatedEpisodeIndex],
      watched: watchedValue,
    };

    const allEpisodesWatched = tempSeason.episodes.every(ep => ep.watched);
    tempSeason = {...tempSeason, watched: !allEpisodesWatched};
    console.log('TEMP SEASON WATCHED:', tempSeason.watched);

    if (selectedSeason.season_number === tempSeason.season_number) {
      console.log('Storing to selected season');
      setSelectedSeason(tempSeason);
    }

    const updatedSeasons = [...tempShow.seasons];
    updatedSeasons[seasonIndex] = tempSeason;
    setSelectedShow({...tempShow, seasons: updatedSeasons});

    const trackedShowsTemp = [...trackedShows];
    const index = trackedShowsTemp.findIndex(show => show.id === tempShow.id);
    trackedShowsTemp[index] = tempShow;
    setTrackedShows(trackedShowsTemp);
    Cache.set('tvShowsTrackerList', trackedShowsTemp);
  };

  const storeTVShow = async (show: any, getDetails: boolean) => {
    setLoading(true);
    if (selectedType === 'TVSHOWS') {
      // Get the existing list from cache or initialize an empty array
      const list: any[] = trackedShows || [];

      // Check if the tvShow is already in the list
      const existingIndex = list.findIndex((item: any) => item.id === show.id);

      if (existingIndex === -1) {
        var tvShow = show;
        if (getDetails) {
          tvShow = await getTvShowDetails(show.id);
        }
        const seasonsWithEpisodes: any[] = [];

        for (const season of tvShow.seasons) {
          try {
            const eps = await getTvShowEpisodes(
              tvShow.id,
              season.season_number,
            );
            seasonsWithEpisodes.push(eps);
          } catch (err) {
            console.log('SEASON ' + season.season_number + ' ERROR: ' + err);
          }
        }
        tvShow.seasons = seasonsWithEpisodes;

        // tvShow doesn't exist in the list, add it
        list.push(tvShow);
        await Cache.set('tvShowsTrackerList', list);
        setTrackedShows(list);
        Toast.show({
          type: 'success',
          text1: 'TV Show is tracked',
        });
        setLoading(false);
        return seasonsWithEpisodes;
      } else {
        list.splice(existingIndex, 1);
        setTrackedShows(list);
        await Cache.set('tvShowsTrackerList', list);
        Toast.show({
          type: 'success',
          text1: 'TV Show is not tracked anymore',
        });
        setLoading(false);
        return null;
      }
    } else {
      // Get the existing list from cache or initialize an empty array
      const list: any[] = trackedMovies || [];

      // Check if the tvShow is already in the list
      const existingIndex = list.findIndex((item: any) => item.id === show.id);

      if (existingIndex === -1) {
        var movie = show;

        // tvShow doesn't exist in the list, add it
        list.push(movie);
        await Cache.set('moviesTrackerList', list);
        setTrackedMovies(list);
        const notifTypes: string[] =
          (await Cache.get('movieNotificationTypes')) || [];
        updateMovieNotifications(movie, 'add', notifTypes);
        Toast.show({
          type: 'success',
          text1: 'Movie is tracked',
        });
        setLoading(false);
      } else {
        var movie = show;

        list[existingIndex].editing = false;
        list.splice(existingIndex, 1);
        cancelNotification(movie.id);
        setTrackedMovies(list);
        await Cache.set('moviesTrackerList', list);
        Toast.show({
          type: 'success',
          text1: 'Movie is not tracked anymore',
        });
        setLoading(false);
        return null;
      }
    }
  };

  async function setTrackingNotifTypes(
    type: string,
    add: boolean,
  ): Promise<string[]> {
    var triggers: string[] = (await Cache.get('movieNotificationTypes')) || [];
    console.log(add, type);
    if (triggers.indexOf(type) > -1) {
      if (!add) {
        triggers.splice(triggers.indexOf(type), 1);
        console.log('Removed ' + type);
      }
    } else {
      if (add) {
        triggers.push(type);
        console.log('Added ' + type);
      }
    }
    console.log(triggers);
    await Cache.set('movieNotificationTypes', triggers);
    trackedMovies.forEach((movie: any) => {
      updateMovieNotifications(movie, add ? 'add' : 'remove', triggers);
    });
    return triggers;
  }
  async function updateMovieNotifications(
    movie: any,
    action: string,
    types: string[],
  ) {
    const notifs: any[] =
      (await Cache.get('movieNotificationsScheduled')) || [];

    // Find the movie notifications based on the movieId
    let movieNotifs = notifs.find(notif => notif.movieID === movie.id);

    if (!movieNotifs) {
      // Create new movie notifications object if not found
      movieNotifs = {
        movieID: movie.id,
        scheduledNotifications: [],
      };

      notifs.push(movieNotifs); // Add it to the notifs array
    }

    // Retrieve the scheduled notifications for the movie
    const scheduledNotifications = movieNotifs.scheduledNotifications;

    // Filter out the notifications that are not in the types list
    const updatedNotifications = scheduledNotifications.filter(
      (scheduledNotif: any) => !types.includes(scheduledNotif.type),
    );

    if (action === 'add') {
      console.log('adding...');
      // Add new notifications to the movie
      types.forEach(async type => {
        if (
          !scheduledNotifications.find(notif => notif.type === type) &&
          new Date(movie.release_date) > new Date()
        ) {
          // Create and add the notification
          updatedNotifications.push({
            type: type,
            // Add other properties as needed
          });

          // Call onCreateTriggerNotification function for added notification
          await onCreateTriggerNotification(
            movie.id,
            movie.original_title,
            movie.release_date,
            type,
          );
        } else {
          console.log('Notification not added because date is in the past.');
        }
      });
    } else if (action === 'remove') {
      // Call cancelNotification function for removed notifications
      types.forEach(async type => {
        await cancelNotification(movie.id, type);
      });
    }

    // Update the movie notifications in the cache
    movieNotifs.scheduledNotifications = updatedNotifications;
    await Cache.set('movieNotificationsScheduled', notifs);
  }

  async function onCreateTriggerNotification(
    id: string,
    movieTitle: string,
    date: string,
    type: string,
  ) {
    const dateToTrigger = new Date(date);
    // Subtract 1 week
    if (type == 'WEEK') {
      dateToTrigger.setDate(dateToTrigger.getDate() - 7);
    } else {
      // Subtract 1 day
      dateToTrigger.setDate(dateToTrigger.getDate() - 1);
    }
    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: dateToTrigger.getTime(), // fire at 11:10am (10 minutes before meeting)
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        id: id + '_' + type,
        title: 'Movie release notification',
        body:
          type == 'WEEK'
            ? movieTitle + ' will be released in 1 week'
            : movieTitle + ' will be released in 1 day',
        android: {
          channelId: 'cubo-channel',
        },
      },
      trigger,
    );
  }

  async function cancelNotification(movieId: string, type: string) {
    await notifee.cancelNotification(movieId + '_' + type);
  }

  return {
    loading,
    setLoading,
    fadeAnimation,
    setSelectedShow,
    selectedShow,
    setSelectedShowID,
    selectedShowID,
    selectedType,
    setSelectedType,
    storeTVShow,
    trackedShows,
    getTrackedIndicator,
    setSeasonWatched,
    setSelectedSeason,
    selectedSeason,
    setEpisodeWatched,
    trackedMovies,
    removeMoviesFromTracking,
    setTrackingNotifTypes,
  };
};
