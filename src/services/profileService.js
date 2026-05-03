import { supabase } from "./supabase";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80";

export const fetchUserProfile = async (userId) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching profile:", error);
    return null;
  }
  
  return data;
};

export const createDefaultProfile = async (userId, userMetadata) => {
  const profileData = {
    id: userId,
    display_name: userMetadata?.display_name ||
      userMetadata?.full_name ||
      userMetadata?.email?.split("@")[0] ||
      "User",
    avatar_url: userMetadata?.avatar_url || DEFAULT_AVATAR,
    user_bio: "",
  };
  
  const { error } = await supabase
    .from("profiles")
    .insert(profileData);
  
  if (error) {
    console.error("Error creating profile:", error);
    return null;
  }
  
  return profileData;
};