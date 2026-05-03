import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    displayName: "",
    avatarUrl: "",
    userBio: "",
    loading: false,
  },
  reducers: {
    setProfile: (state, action) => {
      state.displayName = action.payload.displayName;
      state.avatarUrl = action.payload.avatarUrl;
      state.userBio = action.payload.userBio || "";
      state.loading = false;
    },
    updateDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    updateAvatarUrl: (state, action) => {
      state.avatarUrl = action.payload;
    },
    updateUserBio: (state, action) => {
      state.userBio = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setProfile,
  updateDisplayName,
  updateAvatarUrl,
  updateUserBio,
  setProfileLoading,
} = profileSlice.actions;

export default profileSlice.reducer;