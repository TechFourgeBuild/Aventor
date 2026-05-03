import { supabase } from "./supabase";

// Fetching all liked song IDs for a user
export const fetchUserLikedSongIds = async (userId) => {
  // console.log("Fetching liked songs for user:", userId);
  const { data, error } = await supabase
    .from("liked_songs") 
    .select("song_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching liked songs:", error);
    return [];
  }
  // console.log("Raw data from DB:", data);
  const songIds = data.map((item) => item.song_id);
  // console.log("Extracted song IDs:", songIds);
  return data.map((item) => item.song_id);
};

// Like a song (add to database)
export const likeSong = async (userId, songId) => {
  const { data, error } = await supabase
    .from("liked_songs")
    .insert([{ user_id: userId, song_id: songId }])
    .select();

  if (error) {
    console.error("Error liking song:", error);
    throw error;
  }
  return data;
};

// Unlike a song (remove from database)
export const unlikeSong = async (userId, songId) => {
  const { error } = await supabase
    .from("liked_songs")
    .delete()
    .eq("user_id", userId)
    .eq("song_id", songId);

  if (error) {
    console.error("Error unliking song:", error);
    throw error;
  }
  return true;
};
