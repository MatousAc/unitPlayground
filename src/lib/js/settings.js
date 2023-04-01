// this file defines a store for app settings
import { writable } from 'svelte/store'

const settings = writable({
  includeScalar: true,
  precision: 3,
  simplify: false,
  system: 'si',
  theme: 'light',
  fontSize: 20
})

export default settings