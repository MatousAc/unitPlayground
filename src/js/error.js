// custom error types
export class Fail extends Error {
  constructor(message) {
    super(message);
    this.name = "Fail";
  }
}

export class Hint extends Error {
  constructor(message) {
    super(message);
    this.name = "Hint";
  }
}

export class UnrecognizedUnit extends Hint {
  constructor(str) {
    super(`Unit '${str}' not recognized.`);
    this.name = "UnrecognizedUnit";
  }
}
