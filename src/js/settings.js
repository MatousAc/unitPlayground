// this file defines a store for app settings
import { writable } from 'svelte/store'

const settings = writable({
  includeScalar: false,
  significantDigits: 2,
  convertToSI: false,
  theme: "light"
})

export default settings;