import { createSlice } from "@reduxjs/toolkit";
import { likeSong, unlikeSong } from "../../services/likedSongsService";

const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState: {
    likedIds: [], 
    loading: false,
  },
  reducers: {

    setLikedIds: (state, action) => {
      state.likedIds = action.payload;
      state.loading = false;
    },
    addLike: (state, action) => {
      const songId = action.payload;
      if (!state.likedIds.includes(songId)) {
        state.likedIds.push(songId);
      }
    },
    removeLike: (state, action) => {
      const songId = action.payload;
      state.likedIds = state.likedIds.filter((id) => id !== songId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Async action to toggle like (with database sync)
export const toggleLike = (song, userId) => async (dispatch, getState) => {
  const { likedIds } = getState().liked;
  const isLiked = likedIds.includes(song.id);

  try {
    if (isLiked) {
      await unlikeSong(userId, song.id);
      dispatch(removeLike(song.id));
    } else {
      await likeSong(userId, song.id);
      dispatch(addLike(song.id));
    }
  } catch (error) {
    console.error("Failed to sync like status:", error);
    throw error;
  }
};

export const { setLikedIds, addLike, removeLike, setLoading } =
  likedSongsSlice.actions;
export default likedSongsSlice.reducer;
