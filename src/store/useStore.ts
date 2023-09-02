import {create} from 'zustand';

export type StoreState = {
  selectedShow: any;
  setSelectedShow: (selectedShow: any) => void;
  selectedShowID: any;
  setSelectedShowID: (selectedShowID: any) => void;
  selectedType: any;
  setSelectedType: (selectedType: any) => void;
  selectedSeason: any;
  setSelectedSeason: (selectedType: any) => void;
  trackedShows: any;
  setTrackedShows: (trackedShows: any) => void;
  trackedMovies: any;
  setTrackedMovies: (trackedMovies: any) => void;
  adMobIds: any;
  setAdMobIds: (adMobIds: any) => void;
};

const useStore = create<StoreState>((set, get) => ({
  selectedShow: null,
  selectedShowID: null,
  selectedType: 'MOVIES',
  trackedShows: null,
  selectedSeason: null,
  trackedMovies: null,
  adMobIds:null,
  setTrackedMovies: trackedMovies =>
    set(state => ({trackedMovies: trackedMovies})),

  setSelectedShow: selectedShow => set(state => ({selectedShow: selectedShow})),
  setSelectedSeason: selectedSeason =>
    set(state => ({selectedSeason: selectedSeason})),

  setSelectedShowID: selectedShowID =>
    set(state => ({selectedShowID: selectedShowID})),
  setSelectedType: selectedType => set(state => ({selectedType: selectedType})),
  setTrackedShows: trackedShows => set(state => ({trackedShows: trackedShows})),
  setAdMobIds: adMobIds => set(state => ({adMobIds: adMobIds})),

}));

export default useStore;
