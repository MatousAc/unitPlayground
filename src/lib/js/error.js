// custom error types
export class NonError {
  constructor(message) {
    this.name = this.constructor.name
    this.message = "Stop parsing for now."
    this.stack = (new Error()).stack
  }
}

export class Fail {
  constructor(message) {
    this.name = this.constructor.name
    this.message = message
    this.stack = (new Error()).stack
  }
}

export class Hint {
  constructor(message) {
    this.name = this.constructor.name
    this.message = message
    this.stack = (new Error()).stack
  }
}

export class UnrecognizedUnit extends Hint {
  constructor(unitString) {
    super(`Unit '${unitString}' not recognized.`)
    this.name = this.constructor.name
  }
}

export class UnitMismatch extends Hint {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class UnrecognizedCharacters extends Hint {
  constructor(chars) {
    super(`We don't know what the character ${chars} means.`)
    this.name = this.constructor.name
  }
}

export class MissingOperand extends Hint {
  constructor() {
    super(`You are missing an operand.`)
    this.name = this.constructor.name
  }
}
