export type TValidatorValidateFunction<T> = (value?: T) => string[]
export type TValidatorValueGetter<T> = () => T | undefined | null
export type TValidatorPayload<T> = { validate: TValidatorValidateFunction<T>; getter?: TValidatorValueGetter<T> }
export type TFormValidatorPayload<T> = { [K in keyof T]: TValidatorPayload<T[K]> }

export const useValidator = () => ({
  createValidator: <T>(validateFunction: TValidatorValidateFunction<T>, valueGetter?: TValidatorValueGetter<T>): Validator<T> => {
    return new Validator(validateFunction, valueGetter)
  },
  createFormValidator: <T extends object>(data: TFormValidatorPayload<T>): FormValidator<T> => {
    return new FormValidator(data)
  }
})

export class Validator<T> {
  private readonly _valueGetter?: TValidatorValueGetter<T>
  private readonly _validateFunction: TValidatorValidateFunction<T>
  private _errors: string[] = []

  constructor(validateFunction: TValidatorValidateFunction<T>, valueGetter?: TValidatorValueGetter<T>) {
    this._errors = []
    this._valueGetter = valueGetter
    this._validateFunction = validateFunction
  }

  public getErrors(): string[] {
    return this._errors
  }

  public hasErrors(): boolean {
    return !!this._errors.length
  }

  public clearErrors(): void {
    this._errors.length = 0
  }

  /**
   * Assert value validity
   * @param value the value to validate. Is optional (if not provided, getter will be used)
   * @returns true if the value is valid, false otherwise
   */
  public validate(value?: T): boolean {
    if (!value && !this._valueGetter)
      throw new Error('Invalid usage: a value getter must be provided at class initialization, or a value must be provided at each validate() call.')

    // valueGetter defined state is checked just above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._errors = this._validateFunction(value || this._valueGetter!() || undefined)

    return !this.hasErrors()
  }
}

export class FormValidator<T extends object> {
  private _validators: { [K in keyof T]: Validator<T[K]> }

  constructor(data: TFormValidatorPayload<T>) {
    const validators: Partial<{ [K in keyof T]: Validator<T[K]> }> = {}

    for (const property of Object.keys(data) as (keyof T)[]) {
      const { validate, getter } = data[property]
      validators[property] = this.createPropertyValidator(validate, getter)
    }

    this._validators = validators as { [K in keyof T]: Validator<T[K]> }
  }

  public validateForm(): boolean {
    let anyError = false

    for (const property of Object.keys(this._validators) as (keyof T)[]) {
      const validator = this._validators[property]
      validator.validate()
      if (!anyError) anyError = validator.hasErrors()
    }

    return !anyError
  }

  public validateOne<K extends keyof T>(property: K, value?: T[K]): boolean {
    return this._validators[property].validate(value)
  }

  public getAllErrors(): Record<keyof T, string[]> {
    const allErrors: Partial<Record<keyof T, string[]>> = {}

    for (const property of Object.keys(this._validators) as (keyof T)[]) {
      const validator = this._validators[property]
      allErrors[property] = validator.getErrors()
    }

    return allErrors as Record<keyof T, string[]>
  }

  public getErrorsOf(property: keyof T): string[] {
    return this._validators[property].getErrors()
  }

  public hasAnyErrors(): boolean {
    for (const property of Object.keys(this._validators) as (keyof T)[]) {
      if (this._validators[property].hasErrors()) return true
    }

    return false
  }

  public getValidator<K extends keyof T>(property: K): Validator<T[K]> {
    return this._validators[property]
  }

  private createPropertyValidator<K extends keyof T>(
    validateFunction: TValidatorValidateFunction<T[K]>,
    getter?: TValidatorValueGetter<T[K]>
  ): Validator<T[K]> {
    return new Validator(validateFunction, getter)
  }
}
