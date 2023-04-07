// this file defines a store for app settings
import { writable, get } from 'svelte/store'
import { supabase, user, isAuthed, canPlay } from '$pj/auth'

const settings = writable({
  scalar: true,
  precision: 2,
  simplify: true,
  system: 'si',
  theme: 'light',
  font: 22
})

user.subscribe(async u => {
  if (!canPlay()) return
  console.log(`user ${get(user).email} is currently logged in`)
  let sets
  if (!(sets = await fetchSettings(u))) {
    await initSettings(u)
    sets = await fetchSettings(u)
  }
  settings.set(sets)
})

const initSettings = async user => {
  console.log('user.id:', user.id)
  const { error } = await supabase.from('settings').insert([{ id: user.id }])

  if (error) console.error(error)
}

const fetchSettings = async user => {
  const { data: sets, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', user.id)
  if (error) {
    console.error(error)
    return false
  } else if (sets.length > 2) {
    console.error('multiple setting rows returned')
    return false
  } else return sets[0]
}

export const updateSettings = async setting => {
  settings.update(s => ({ ...s, ...setting }))
  if (!isAuthed()) return
  await supabase.from('settings').update(setting).eq('id', get(user).id)
}

export default settings
