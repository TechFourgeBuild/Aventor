import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import playerReducer from "./slices/playerSlice";
import songsReducer from "./slices/songsSlice";
import likedSongsReducer from "./slices/likedSongsSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    songs: songsReducer,
    liked: likedSongsReducer,
    profile: profileReducer,
  },
});
