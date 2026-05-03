import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "player",
  initialState: {
    currentSong: null,
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
    queue: [],
    currentIndex: 0,
  },
  reducers: {
    setSong: (state, action) => {
      const { queue, queueIndex, ...song } = action.payload;
      state.currentSong = song;
      state.isPlaying = true;
      state.progress = 0;

      if (queue) {
        state.queue = queue;
        state.currentIndex = queueIndex !== undefined ? queueIndex : 0;
      }
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    nextSong: (state) => {
      if (
        state.queue.length > 0 &&
        state.currentIndex < state.queue.length - 1
      ) {
        state.currentIndex += 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
        state.progress = 0;
        state.duration = 0;
      } else {
        state.isPlaying = false;
        state.currentSong = null;
        state.progress = 0;
      }
    },

    clearSong: (state) => {
      state.currentSong = null;
      state.isPlaying = false;
      state.progress = 0;
      state.duration = 0;
    },
    prevSong: (state) => {
      if (state.queue.length > 0 && state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentSong = state.queue[state.currentIndex];
        state.isPlaying = true;
        state.progress = 0;
        state.duration = 0;
      }
    },
  },
});

export const {
  setSong,
  togglePlay,
  setProgress,
  setDuration,
  setVolume,
  setQueue,
  nextSong,
  prevSong,
  clearSong,
} = playerSlice.actions;
export default playerSlice.reducer;
