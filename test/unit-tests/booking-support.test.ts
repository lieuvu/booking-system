// Library
import { DateTime } from 'luxon';

// App
import {
  getTheBeginningOfDate,
  getTheEndOfDate,
  getUTCDateAtTheBeginningOfTheWeek,
  getUTCDateAtTheEndOfTheWeek,
  isAfterDate,
  isAfterNow,
} from '@controllers/booking/booking-support';

describe('Booking Support Functions', () => {
  describe('Happy Path', () => {

    describe('Function isAfterNow', () => {
      test('should return true if the date is after now', () => {
        const afterNowISOStr = DateTime.utc().plus({ seconds: 3 }).toISO();
        expect(isAfterNow(afterNowISOStr)).toBeTruthy();
      });

      test('should return false if the date is before now', () => {
        const afterNowISOStr = DateTime.utc().minus({ seconds: 3 }).toISO();
        expect(isAfterNow(afterNowISOStr)).toBeFalsy();
      });
    });

    describe('Function isAfterDate', () => {
      const beforeDateISOArr = ['2020-10-15T23:23:42+00:00', '2020-10-15T23:23:42.587Z', '2020-10-16T01:23:42+02:00'];
      const afterDateISOArr = ['2020-10-15T23:41:30+00:00', '2020-10-15T23:41:30.289Z', '2020-10-16T01:41:30+02:00'];

      test('should return true if "after date" is after "before date"', () => {
        for (const afterDateISOStr of afterDateISOArr) {
          for (const beforeDateISOStr of beforeDateISOArr) {
            expect(isAfterDate(afterDateISOStr, beforeDateISOStr)).toBeTruthy();
          }
        }
      });

      test('should return false if "before date" is after "after date"', () => {
        for (const afterDateISOStr of afterDateISOArr) {
          for (const beforeDateISOStr of beforeDateISOArr) {
            expect(isAfterDate(beforeDateISOStr, afterDateISOStr)).toBeFalsy();
          }
        }
      });

      test('should return false if a date is after itself', () => {
        for (const dateISOStr of beforeDateISOArr) {
          expect(isAfterDate(dateISOStr, dateISOStr)).toBeFalsy();
        }
      });
    });

    describe('Function getUTCDateAtTheBeginningOfTheWeek', () => {
      const testDateISOArr = [
        '2020-10-15', '2020-10-15T23:23:42+00:00', '2020-10-15T23:23:42.587Z', '2020-10-16T01:23:42+02:00'
      ];
      const ISODateAtTheBeginningOfTheWeek = '2020-10-12T00:00:00.000Z';

      test('should return the expected ISO date end of the week', () => {
        for (const testDateISOStr of testDateISOArr) {
          expect(getUTCDateAtTheBeginningOfTheWeek(testDateISOStr)).toEqual(ISODateAtTheBeginningOfTheWeek);
        }
      });
    });

    describe('Function getUTCDateAtTheEndOfTheWeek', () => {
      const testDateISOArr = [
        '2020-10-15', '2020-10-15T23:23:42+00:00', '2020-10-15T23:23:42.587Z', '2020-10-16T01:23:42+02:00'
      ];
      const ISODateAtTheEndOfTheWeek = '2020-10-18T23:59:59.999Z';

      test('should return the expected ISO date end of the week', () => {
        for (const testDateISOStr of testDateISOArr) {
          expect(getUTCDateAtTheEndOfTheWeek(testDateISOStr)).toEqual(ISODateAtTheEndOfTheWeek);
        }
      });
    });

    describe('Function getTheBeginningOfDate', () => {
      const testDateISOArr = ['2020-10-15'];
      const beginningISODate = '2020-10-15T00:00:00.000Z';

      test('should return the expected ISO date end of the week', () => {
        for (const testDateISOStr of testDateISOArr) {
          expect(getTheBeginningOfDate(testDateISOStr)).toEqual(beginningISODate);
        }
      });
    });

    describe('Function getTheEndOfDate', () => {
      const testDateISOArr = ['2020-10-15'];
      const endingISODate = '2020-10-15T23:59:59.999Z';

      test('should return the expected ISO date end of the week', () => {
        for (const testDateISOStr of testDateISOArr) {
          expect(getTheEndOfDate(testDateISOStr)).toEqual(endingISODate);
        }
      });
    });
  });

  describe('Sad Path', () => {
    const invalidISOStrings = ['', 'abc', '0', '-1', '2020-11-28T10:00+0:00', '2020-11-28T10:00.123Z'];

    describe('Function isAfterNow', () => {
      test('should throw error when the input is invalid ISO Date string', () => {
        for (const invalidISOStr of invalidISOStrings) {
          expect(() => isAfterNow(invalidISOStr)).toThrow('Invalid DateTime');
        }
      });
    });

    describe('Function isAfterDate', () => {
      test('should throw error when the inputs are invalid ISO Date strings', () => {
        for (const invalidISOSTr1 of invalidISOStrings) {
          for (const invalidISOStr2 of invalidISOStrings) {
            expect(() => isAfterDate(invalidISOSTr1, invalidISOStr2)).toThrow('Invalid DateTime');
          }
        }
      });
    });

    describe('Function getUTCDateAtTheBeginningOfTheWeek', () => {
      test('should throw error when the inputs are invalid ISO Date strings', () => {
        for (const invalidISOSTr of invalidISOStrings) {
          expect(() => getUTCDateAtTheBeginningOfTheWeek(invalidISOSTr)).toThrow('Invalid DateTime');
        }
      });
    });

    describe('Function getUTCDateAtTheEndOfTheWeek', () => {
      test('should throw error when the inputs are invalid ISO Date strings', () => {
        for (const invalidISOSTr of invalidISOStrings) {
          expect(() => getUTCDateAtTheEndOfTheWeek(invalidISOSTr)).toThrow('Invalid DateTime');
        }
      });
    });

    describe('Function getTheBeginningOfDate', () => {
      test('should throw error when the inputs are invalid ISO Date strings', () => {
        for (const invalidISOSTr of invalidISOStrings) {
          expect(() => getTheBeginningOfDate(invalidISOSTr)).toThrow('Invalid DateTime');
        }
      });
    });

    describe('Function getTheEndOfDate', () => {
      test('should throw error when the inputs are invalid ISO Date strings', () => {
        for (const invalidISOSTr of invalidISOStrings) {
          expect(() => getTheEndOfDate(invalidISOSTr)).toThrow('Invalid DateTime');
        }
      });
    });
  });
});
