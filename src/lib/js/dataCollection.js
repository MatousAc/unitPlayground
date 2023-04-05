import { supabase } from '$pj/auth'
import { readable, get } from 'svelte/store'

export const startTime = readable(new Date())
