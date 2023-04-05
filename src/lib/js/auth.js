import { writable, get } from 'svelte/store'
import { createClient } from '@supabase/supabase-js'
import {
  // FIXME env vars should be built into package
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL
} from '$env/static/public'
export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
)

export const user = writable(undefined)
export const isAuthed = () => get(user) !== undefined
export const isSAU = () => {
  if (!isAuthed()) return false
  let email = get(user).email
  // for now, we only allow SAU emails
  let match = email.match(/^\S+@southern\.edu$/)
  return match !== null
}
export const canPlay = () => isAuthed() && isSAU()
export const getIDData = () => {
  if (!isAuthed()) return false
  else return get(user).identities[0].identity_data
}

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
