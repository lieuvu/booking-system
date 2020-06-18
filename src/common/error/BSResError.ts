/**
 * Class servers as the base class of the system response
 * error to the server request.
 */
class BSResError extends Error {
  // Private properties
  #code: number;
  #errorId?: string;

  // Public property
  message: string;
  name: string;

  /**
   * Create a BSResponse error.
   * @param message The error message.
   * @param code The error code.
   * @param [errorId] The error id.
   */
  constructor(message: string, code: number, errorId?: string) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'BSResError';
    this.message = message;
    this.#code = code;
    this.#errorId = errorId;
  }

  /**
   * Get the code value.
   * @returns The code value
   */
  public getCode(): number {
    return this.#code;
  }

  /**
   * Get the error id.
   * @return The error id.
   */
  public getErrorId(): string {
    return this.#errorId;
  }
}

/**
 * Class representing the bad input error.
 * @extends BSResError
 */
class BSResBadInputError extends BSResError {

  /**
   * Create a BSResBadInputError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message, 400);
    this.name = 'BSResBadInputError';
  }
}

/**
 * Class representing the bad request error.
 * @extends BSResError
 */
class BSResBadRequestError extends BSResError {

  /**
   * Create a BSResBadRequestError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message, 400);
    this.name = 'BSResBadRequestError';
  }
}

/**
 * Class representing the system error.
 * @extends BSResError
 */
class BSResSystemError extends BSResError {

  /**
   * Create a BSResSystemError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message, 500);
    this.name = 'BSResSystemError';
  }
}

/**
 * Class representing the unprocessable entity error.
 * @extends BSResError
 */
class BSResUnprocessableError extends BSResError {

  /**
   * Create a BSResUnprocessableError.
   * @param message The error message.
   */
  constructor(message: string) {
    super(message, 422);
    this.name = 'BSResUnrpocessableError';
  }
}

// Export
export {
  BSResError,
  BSResBadInputError,
  BSResBadRequestError,
  BSResSystemError,
  BSResUnprocessableError,
};
