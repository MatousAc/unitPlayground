// cookieStore and SiteTheme code taken from https://rosshill.ca/
import Cookies from 'universal-cookie'
import { writable } from 'svelte/store'

export const showCategories = writable(new Set())
export const showTags = writable(new Set())
export const minTagNum = writable(2)

export const consoleMessagePrinted = writable(false)

const cookies = new Cookies()
const yearInSeconds = 60 * 60 * 24 * 365

function cookieStore(key, defaultValue, maxAge = yearInSeconds) {
  const initialValue = cookies.get(key) ?? defaultValue
  const { set: setStore, ...store } = writable(initialValue)
  if (initialValue) {
    cookies.set(key, initialValue, { maxAge })
  }

  return {
    ...store,
    set: newValue => {
      setStore(newValue)
      cookies.set(key, newValue, { maxAge })
    }
  }
}

export const theme = cookieStore('theme', 'system')
