// custom error types
export class NonError {
  constructor(message) {
    this.name = this.constructor.name
    this.message = 'Stop parsing for now.'
    this.stack = new Error().stack
    this.data = {}
    this.data.color = 'safe'
  }
}

export class Fail {
  constructor(message) {
    this.name = this.constructor.name
    this.message = message
    this.stack = new Error().stack
    this.data = {}
    this.data.color = 'error'
  }
}

export class Hint {
  constructor(message) {
    this.name = this.constructor.name
    this.message = message
    this.stack = new Error().stack
    this.data = {}
    this.data.color = 'safe'
  }
}

// errors
export class Err extends Hint {
  constructor(message) {
    super(message)
    this.data.color = 'error'
  }
}

export class InvalidOperands extends Err {
  opsRE = /Cannot\s(\w+)\s(.*)\sand\s(.*):/
  constructor(errormessage, message) {
    let m = errormessage.match(/Cannot\s(\w+)\s(.*)\sand\s(.*):/)
    super(`Can't ${m[1]} <b>${m[2]}</b> and <b>${m[3]}</b>${message}`)
    this.name = this.constructor.name
  }
}

export class DimensionMismatch extends InvalidOperands {
  constructor(message) {
    super(message, ' because they measure different dimensions')
    this.name = this.constructor.name
  }
}

export class ValueMissingOnUnit extends InvalidOperands {
  constructor(message) {
    super(message, '. Both units must have values.')
    this.name = this.constructor.name
  }
}

export class UnrecognizedCharacters extends Err {
  constructor(chars) {
    super(`We don't know what the character ${chars} means.`)
    this.name = this.constructor.name
  }
}

export class MissingOperand extends Err {
  constructor() {
    super(`You are missing an operand.`)
    this.name = this.constructor.name
  }
}

// warnings
export class Warning extends Hint {
  constructor(message) {
    super(message)
    this.data.color = 'warning'
  }
}

export class UnrecognizedUnit extends Warning {
  constructor(unitString) {
    super(`Unit '${unitString}' does not exist.`)
    this.data.unitName = unitString
    this.name = this.constructor.name
    this.data.button = true
  }
}

export class FillPH extends Warning {
  constructor(message) {
    super(`Fill the placeholder.`)
    this.name = this.constructor.name
  }
}
