import { supabase } from './supabase'

// ── SIGNUP ────────────────────────────────────────────────────────────────────
export const signupWithEmail = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,   
        display_name: name,
      }
    }
  })

  if (error) throw error
  return data
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const loginWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// ── GOOGLE LOGIN ──────────────────────────────────────────────────────────────
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,   
      queryParams: {
      prompt: 'select_account', 
    },
    }
  })

  if (error) throw error
  return data
}

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ── GET CURRENT SESSION ───────────────────────────────────────────────────────
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
