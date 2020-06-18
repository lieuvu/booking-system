// Library
import { DateTime, Settings } from 'luxon';

// App
import { log } from '@src/utils';

// Make luxon throw error
Settings.throwOnInvalid = true;

/**
 * Check if the date is after now in UTC.
 *
 * @param date The date to check against now.
 * @returns true if the date is after now in UTC. Otherwise, false.
 */
function isAfterNow(date: string): boolean {
  try {
    return DateTime.fromISO(date, { zone: 'utc' }) > DateTime.utc();
  } catch (error) {
    log.error(error.message);
    throw error;
  }
}

/**
 * Check if dateA is after dateB in UTC.
 *
 * @param date The date to check against now.
 * @returns true if dateA is after dateB in UTC. Otherwise, false.
 */
function isAfterDate(dateA: string, dateB: string): boolean {
  try {
    const dateAInUTC = DateTime.fromISO(dateA, { zone: 'utc' });
    const dateBInUTC = DateTime.fromISO(dateB, { zone: 'utc' });

    return dateAInUTC > dateBInUTC;
  } catch (error) {
    log.error(error.message);
    throw error;
  }
}

/**
 * Get a UTC date of the beginning of the week formatted as ISO string
 * given a date string in ISO.
 *
 * @param date The date as an input to get the beginning UTC date of the week.
 * @return The UTC date at the end of the week in ISO format.
 */
function getUTCDateAtTheBeginningOfTheWeek(date: string): string {
  try {
    const dateInUTC = DateTime.fromISO(date, { zone: 'utc' });
    return dateInUTC.startOf('week').toISO();
  } catch (error) {
    log.error(error.message);
    throw error;
  }
}

/**
 * Get a UTC date of the end of the week formatted as ISO string
 * given a date string in ISO.
 *
 * @param date The date as an input to get the end date of the week.
 * @return The UTC date at the end of the week in ISO format.
 */
function getUTCDateAtTheEndOfTheWeek(date: string): string {
  try {
    const dateInUTC = DateTime.fromISO(date, { zone: 'utc' });
    return dateInUTC.endOf('week').toISO();
  } catch (error) {
    log.error(error.message);
    throw error;
  }
}

function getTheBeginningOfDate(date: string): string {
  try {
    return DateTime.fromISO(date, { zone: 'utc' }).startOf('day').toISO();
  } catch (error) {
    log.error(error.message);
    throw error;
  }
}

function getTheEndOfDate(date: string): string {
  try {
    return DateTime.fromISO(date, { zone: 'utc' }).endOf('day').toISO();
  } catch (error) {
    log.error(error.message);
    throw error;
  }
}

// Export
export {
  isAfterNow,
  isAfterDate,
  getUTCDateAtTheBeginningOfTheWeek,
  getUTCDateAtTheEndOfTheWeek,
  getTheBeginningOfDate,
  getTheEndOfDate,
};
