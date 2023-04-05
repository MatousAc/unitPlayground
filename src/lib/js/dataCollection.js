import { supabase, user } from '$pj/auth'
import { readable, get } from 'svelte/store'

export const startTime = readable(new Date())
export const logSessionLength = async () => {
  let now = new Date()
  const elapsed_time = Math.round((now - get(startTime)) / 1000)
  const log_time = now.toISOString()

  const { data, error } = await supabase
    .from('session_length')
    .insert([
      { id: get(user).id, log_time, email: get(user).email, elapsed_time }
    ])
  if (error) console.log(error)
}

export const logUserActivity = async ({ l, r }) => {
  let now = new Date()
  const log_time = now.toISOString()
  const left = get(l)
  const right = get(r)

  const { data, error } = await supabase
    .from('user_activity')
    .insert([
      { id: get(user).id, log_time, email: get(user).email, left, right }
    ])

  if (error) console.log(error)
}
