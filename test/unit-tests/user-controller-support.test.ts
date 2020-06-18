// App
import {
  generateHashPassword,
  generateRandomString,
  genreateSaltHashPassword,
} from '@controllers/user/user-controller-support';

describe('User Controller Support Functions', () => {
  test('should generate a random string with a certain length', () => {
    const minLength = 10;
    const maxLength = 25;
    const experimentNumber = 500;

    for (let i = 0; i < experimentNumber; i++) {
      const randomLength = Math.ceil(Math.random() * (maxLength - minLength) + minLength);
      const randomStr = generateRandomString(randomLength);
      expect(randomStr).toHaveLength(randomLength);
      expect(randomStr.length).toBeGreaterThanOrEqual(minLength);
      expect(randomStr.length).toBeLessThanOrEqual(maxLength);
    }
  });

  test('should generate the same hash password with the same salt', () => {
    const salt = generateRandomString(16);
    const password = 'testPassword';
    const firstHashPassword = generateHashPassword(password, salt);
    const secondHashPassword = generateHashPassword(password, salt);

    expect(firstHashPassword).toHaveProperty('salt', salt);
    expect(firstHashPassword).toHaveProperty('hashPassword');
    expect(secondHashPassword).toHaveProperty('salt', salt);
    expect(secondHashPassword).toHaveProperty('hashPassword');
    expect(firstHashPassword.hashPassword).toEqual(secondHashPassword.hashPassword);
  });

  test('should generate different hash passwords with different salts', () => {
    const password = 'testPassword';
    const firstHashPassword = genreateSaltHashPassword(password);
    const secondHashPassword = genreateSaltHashPassword(password);

    expect(firstHashPassword).toHaveProperty('salt');
    expect(firstHashPassword).toHaveProperty('hashPassword');
    expect(secondHashPassword).toHaveProperty('salt');
    expect(secondHashPassword).toHaveProperty('hashPassword');
    expect(firstHashPassword.salt).not.toEqual(secondHashPassword.salt);
    expect(firstHashPassword.hashPassword).not.toEqual(secondHashPassword.hashPassword);
  });

});
