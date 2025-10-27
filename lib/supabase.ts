import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Platform } from "react-native";

const supabaseUrl =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "";
const supabaseAnonKey =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "";

class SupabaseStorage {
  getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        return Promise.resolve(localStorage.getItem(key));
      }
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  }

  setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  }

  removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new SupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

export const createUserProfile = async (userId: string, email: string) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: userId,
        email,
        is_premium: false,
        article_count: 0,
      },
    ])
    .select()
    .single();
  return { data, error };
};

export const updateUserPremiumStatus = async (
  userId: string,
  isPremium: boolean
) => {
  const { data, error } = await supabase
    .from("users")
    .update({ is_premium: isPremium })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
};

// Article functions
export const createArticle = async (article: {
  user_id: string;
  title: string;
  keywords: string;
  target_audience: string;
  tone: string;
  content: string;
  word_count: number;
  has_image: boolean;
  image_url?: string;
  image_alt_text?: string;
  payment_status: string;
}) => {
  const { data, error } = await supabase
    .from("articles")
    .insert([article])
    .select()
    .single();
  return { data, error };
};

export const getUserArticles = async (userId: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const getArticleById = async (articleId: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single();
  return { data, error };
};

// Image upload function
export const uploadArticleImage = async (
  userId: string,
  imageUri: string,
  fileName: string
) => {
  try {
    // Fetch the image as blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const filePath = `${userId}/${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from("article-images")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      return { data: null, error };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("article-images").getPublicUrl(filePath);

    return { data: { path: filePath, publicUrl }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
