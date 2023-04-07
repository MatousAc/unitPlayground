import units from 'unitmath'

export default class Prefix {
  static dictionary = {}

  static init() {
    // setup dictionary
    for (const [grp, prfx] of Object.entries(units.definitions().prefixes)) {
      Prefix.dictionary[grp] = Object.keys(prfx)
    }
  }

  static getFormatPrefixes(type) {
    switch (type) {
      case 'NONE':
        return []
      case 'SHORT':
      case 'SQUARED':
      case 'CUBIC':
        return ['n', 'p', 'm', 'u', 'k', 'M', 'G', 'T']
      case 'LONG':
      case 'SHORT_LONG':
        return [
          'nano',
          'pico',
          'milli',
          'micro',
          'kilo',
          'Mega',
          'Giga',
          'Tera'
        ]
      default:
        return dictionary[type]
    }
  }

  static humanize(str) {
    let pieces = str.split('_')
    pieces = pieces.map(word => {
      word = word.toLowerCase()
      word = word.charAt(0).toUpperCase() + word.slice(1)
      if (word == 'Si') word = 'SI'
      return word
    })
    return pieces.join(' ')
  }
}

Prefix.init()
