import { writable, get } from 'svelte/store'
import { createClient } from '@supabase/supabase-js'
import {
  // fixme env vars should be built into package
  // czech out https://www.npmjs.com/package/env-cmd
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
  const encodedUrl = encodeURIComponent(window.location.href)
  window.location.href =
    PUBLIC_SUPABASE_URL +
    '/auth/v1/authorize?provider=google&redirect_to=' +
    encodedUrl
}

export const signOut = async () => {
  if (!isAuthed()) return
  console.log('signing out')
  const { error } = await supabase.auth.signOut()
  return error
}

export const getSession = async () => {
  console.log('getting session')
  const { data, error } = await supabase.auth.getSession()
  console.log(data.session)
  return data.session
}
