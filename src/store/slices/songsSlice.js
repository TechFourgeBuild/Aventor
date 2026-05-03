import { createSlice } from '@reduxjs/toolkit'

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    allSongs: [],
    likedSongs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSongs: (state, action) => {
      state.allSongs = action.payload
      state.loading = false
    },
    setLikedSongs: (state, action) => {
      state.likedSongs = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    addLike: (state, action) => {
      state.likedSongs.push(action.payload)
    },
    removeLike: (state, action) => {
      state.likedSongs = state.likedSongs.filter(
        id => id !== action.payload
      )
    },
  },
})

export const {
  setSongs, setLikedSongs, setLoading,
  setError, addLike, removeLike
} = songsSlice.actions
export default songsSlice.reducer