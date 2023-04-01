// a typeOf f(x)
export const typeOf = (obj) => {
  if (obj.units != undefined) return 'unit'
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase()
}

export const objMap = (obj, fn) =>
Object.fromEntries(
  Object.entries(obj).map(
    ([k, v], i) => [k, fn(v, k, i)]
  )
)

export const obj2Arr = (obj, fn) =>
Object.entries(obj).map(
  ([k, v], i) => [k, fn(v, k, i)]
)

export const humanize = str => {
  let pieces = str.split('_')
  pieces = pieces.map(word => {
    word = word.toLowerCase()
    word = word.charAt(0).toUpperCase() + word.slice(1)
    if (word == "Si") word = "SI"
    return word
  })
  return pieces.join(' ')
}

export const hyphenate = str => {
  return str.toLowerCase().replace("_", "-")
}

// from https://stackoverflow.com/a/11935263/14062356
export const getRandomSubarray = (arr, size) => {
  var shuffled = arr.slice(0), i = arr.length, temp, index
  while (i--) {
      index = Math.floor((i + 1) * Math.random())
      temp = shuffled[index]
      shuffled[index] = shuffled[i]
      shuffled[i] = temp
  }
  return shuffled.slice(0, size)
}

export function isMobile() {
	const toMatch = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i
	]
	
	return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem)
	})
}