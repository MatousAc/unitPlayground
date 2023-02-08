// this file defines a store for app settings
import { writable } from 'svelte/store'

const settings = writable({
  includeScalar: true,
  significantDigits: 3,
  simplify: false,
  theme: "light"
})

export default settings;