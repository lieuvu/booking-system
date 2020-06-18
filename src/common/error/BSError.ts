/**
 * Class server as an error of the application. It uses to capture
 * any application errors that will not be exposed outside of the application.
 */
class BSError extends Error {
  // Public properties
  message: string

  constructor(message: string) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'BSError';
    this.message = message;
  }
}

/**
 * Class representing a bad intput error.
 */
class BSBadInputError extends BSError {

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'BSBadInputError';
  }
}


// Export
export {
  BSError,
  BSBadInputError
};
