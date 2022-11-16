// this file defines a store for app settings
import { writable } from 'svelte/store'

export const includeScalar = writable(false);
export const significantDigits = writable(2);
