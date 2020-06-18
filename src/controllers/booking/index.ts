// Library
import type { NextFunction, Request, Response } from 'express';
import { sql } from 'slonik';

// Interface, model and error
import type { Booking } from '@models/Booking';
import { BookingStatus } from '@models/Booking';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Config
import { config } from '@src/config';

// Util
import { log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

// Supporting
import {
  getTheBeginningOfDate,
  getTheEndOfDate,
  getUTCDateAtTheBeginningOfTheWeek,
  getUTCDateAtTheEndOfTheWeek,
  isAfterDate,
  isAfterNow,
} from '@controllers/booking/booking-support';

/**
 * Create a booking
 */
async function createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { user_id, machine_id, start_time, end_time }: Booking = req.body;
  log.info('Creating booking...');

  try {
    // Throw error if start time is after end time
    if (isAfterDate(start_time, end_time)) {
      throw new BSError(`The start time ${start_time} is after the end time ${end_time}!`);
    }

    // Throw error if start time is after now
    if (isAfterNow(start_time)) {
      throw new BSError(`The start time ${start_time} is after now!`);
    }

    // Get the date at the beginning and at end of the week from start time
    const dateAtTheBeginningOfTheWeek = getUTCDateAtTheBeginningOfTheWeek(start_time);
    const dateAtTheEndOfTheWeek = getUTCDateAtTheEndOfTheWeek(start_time);

    // DB Service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const numberOfBookingsDuringTheWeek = await connection.one<any>(sql`
        SELECT COUNT(*) FROM booking
        WHERE start_time >= ${dateAtTheBeginningOfTheWeek}
        AND end_time <= ${dateAtTheEndOfTheWeek}
      `);

      // Throw an error if quota is exceeded
      if (numberOfBookingsDuringTheWeek.count > config.QUOTA_LIMIT) {
        throw new BSError('Quota Exceeded!');
      }

      const newBookingId = await connection.maybeOneFirst(sql`
        INSERT INTO booking (user_id, machine_id, start_time, end_time)
        VALUES (
          ${user_id},
          ${machine_id},
          ${start_time},
          ${end_time}
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      // Throw an error if machine location could not be created
      if (!newBookingId) {
        throw new BSError(`Booking could not be created: ${JSON.stringify(newBookingId)}`);
      }

      log.info(`Created booking ${newBookingId} for machine ${machine_id} from ${start_time} to ${end_time}`);
      res.status(200).json({ id: newBookingId });
    });
  } catch (error) {
    log.error(
      `Booking for machine ${machine_id} from ${start_time} to ${end_time} could not be created: ${error.message}`
    );
    next(
      new BSResUnprocessableError(
        `Booking for machine ${machine_id} from ${start_time} to ${end_time} could not be created!`
      )
    );
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a booking by id
 */
async function getBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting booking with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingBooking = await connection.one<Booking>(sql`
        SELECT
          user_id,
          machine_id,
          status,
          to_char(start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS start_time,
          to_char(end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS end_time
        FROM booking WHERE id = ${id} AND status = ${BookingStatus.Active};
      `);

      res.status(200).json(existingBooking);
    });
  } catch (error) {
    log.error(`Booking with id ${id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`Booking with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a booking by query
 */
async function getBookingByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { user_id, start_period, end_period } = req.query;
  log.info(`Getting bookings of user ${user_id} from ${start_period} to ${end_period}`);

  try {
    // Get the date at the beginning of start period and the date at end of the end period
    const startPeriod = getTheBeginningOfDate(start_period as string);
    const endPeriod = getTheEndOfDate(end_period as string);

    // DB Service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingBookings = await connection.many<Booking>(sql`
        SELECT
          user_id,
          machine_id,
          status,
          to_char(start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS start_time,
          to_char(end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS end_time
        FROM booking
        WHERE user_id = ${user_id as any}
        AND status = ${BookingStatus.Active}
        AND start_time >= ${startPeriod}
        AND end_time <= ${endPeriod};
      `);

      res.status(200).json(existingBookings);
    });
  } catch (error) {
    log.error(
      `Booking with user ${user_id} from ${start_period} to ${end_period} could not be found: ${error.message}`
    );
    next(
      new BSResUnprocessableError(
        `Booking with user ${user_id} from ${start_period} to ${end_period} could not be found: ${error.message}`
      )
    );
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Delete a booking
 */
async function deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Marking a booking with id ${id} as inactive...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const deletedBooking = await connection.one(sql`
        UPDATE booking
        SET status = ${BookingStatus.Inactive}
        WHERE id = ${id}
        RETURNING
          id,
          user_id,
          status,
          to_char(start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS start_time,
          to_char(end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS end_time;
      `);

      log.info(`Mark booking with id ${id} as inactive successfully.`);

      res.status(200).json({ ...deletedBooking });
    });
  } catch (error) {
    log.error(`Booking with id ${id} could not be marked as inactive: ${error.message}`);
    next(new BSResUnprocessableError(`Booking with id ${id} could not be deleted!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// Booking Controller
const BookingController = {
  createBooking,
  getBooking,
  getBookingByQuery,
  deleteBooking,
};

// Export
export default BookingController;
