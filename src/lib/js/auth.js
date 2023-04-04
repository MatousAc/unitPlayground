import { writable, get } from 'svelte/store'
import { createClient } from '@supabase/supabase-js'
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL
} from '$env/static/public'
export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
)

export const user = writable(undefined)
export const isAuthed = () => get(user) !== undefined

export const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth(
    {
      provider: 'google'
    },
    {
      redirectTo: window.location.href
    }
  )

  if (error) {
    console.error('Error signing in with Google:', error)
  }
}

export const signOut = async () => {
  if (!isAuthed()) return
  const { error } = await supabase.auth.signOut()
  return error
}

export const getSession = async () => {
  console.log('getting session')
  const { data, error } = await supabase.auth.getSession()
  console.log(data.session)
  return data.session
}
