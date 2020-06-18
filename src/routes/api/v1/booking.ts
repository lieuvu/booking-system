// Library
import express from 'express';

// App
import BookingController from '@controllers/booking';
import { validateId } from '@src/middlewares/params-validator';
import { validateRequestBody } from '@src/middlewares/body-validator';
import { validateQueryParams } from '@src/middlewares/query-params-validator';

// Router
const router = express.Router();

// Route
router.post('/',
  validateRequestBody([
    '@schemas/booking/booking-common.json',
    '@schemas/booking/booking-post.json'
  ]),
  BookingController.createBooking
);

router.get('/:id', validateId, BookingController.getBooking);

router.get('/',
  validateQueryParams('@schemas/booking/booking-query-params.json'),
  BookingController.getBookingByQuery
);

router.delete('/:id', validateId, BookingController.deleteBooking);

// Export
export { router as bookingRoute };
