export class ArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidateResult {
  constructor(success, err) { this.success = success; this.err = err; }
}

export class Validation {
  static IsAtLeast = l => a => new ValidateResult(
    a >= l,
    `Must be at least ${l}`);
  static IsNotNegative = a => new ValidateResult(
    this.IsAtLeast(0),
    "Must not be negative");
  static IsNumber = a => new ValidateResult( 
    !isNaN(a),
    "Must be a number");
  static HasKey = obj => key => new ValidateResult(
    key in obj,
    `Key ${key} not found`);

  static And = f => g => a => {
    let rF = f(a);
    if (!rF.success) return rF;
    let rG = g(a);
    if (!rG.success) return rG;
    return new ValidateResult(true, "");
  }

  static ValidateOrError = test => a => {
    let result = test(a);
    if (!result.success) throw new ArgumentError(result.err);
    return true;
  }

  static RunIfValid = f => validator => a => {
    this.ValidateOrError(validator)(a);
    return f(a);
  }
}