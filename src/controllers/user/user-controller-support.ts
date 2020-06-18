// Library
import crypto from 'crypto';

/* Interfaces */
interface SaltHashPassword {
  salt: string;
  hashPassword: string;
}

/**
 * Generate a random string of hexadecimal characters.
 * It is used to generate a salt of a password.
 *
 * @param length A length of the random string.
 * @returns The random hexadecimal character string with a certain length.
 */
function generateRandomString(length: number): string {
  const numberOfBase64Bytes = Math.ceil((6 * length) / 8);
  return crypto.randomBytes(numberOfBase64Bytes).toString('base64').slice(0, length);
}

/**
 * Generate a hash password of a given password  and a salt.
 *
 * @param password A password to generate hash password from.
 * @param salt A salt to go with a password.
 * @returns The object containing a salt and a hash password.
 */
function generateHashPassword(password: string, salt: string): SaltHashPassword {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const hashPassword = hash.digest('base64');
  return {
    salt,
    hashPassword,
  };
}

/**
 * Generate a hash password with a random salt.
 *
 * @param password A password from which to generate a hash password with a random salt.
 * @returns The hash password generated with a random salt.
 * @returns The object containing a salt and a hash password.
 */
function genreateSaltHashPassword(password: string): SaltHashPassword {
  const salt = generateRandomString(18);
  return generateHashPassword(password, salt);
}

// Export
export type { SaltHashPassword };

export {
  generateRandomString,
  generateHashPassword,
  genreateSaltHashPassword,
};
