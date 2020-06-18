// Library
import type { NextFunction, Request, Response } from 'express';
import { sql } from 'slonik';

// Interface, model and error
import type { UserAddressReq, UserAddressRes } from '@models/UserAddress';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Util
import { log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

/**
 * Create a user address
 */
async function createUserAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { user_id, building_id, apartment_number }: UserAddressReq = req.body;
  log.info('Creating user address...');

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingUAId = await connection.maybeOneFirst(sql`
        SELECT id FROM user_address WHERE user_id = ${user_id};
      `);

      // Throw an error if there is existing user address
      if (existingUAId) {
        throw new BSError('User address already existed!');
      }

      const newUAId = await connection.maybeOneFirst(sql`
        INSERT INTO user_address (user_id, building_id, apartment_number)
        VALUES (
          ${user_id},
          ${building_id},
          ${apartment_number}
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      // Throw an error if user address could not be created
      if (!newUAId) {
        throw new BSError(`User address could not be created: ${JSON.stringify(newUAId)}`);
      }

      log.info(`Created user address (user_id ${user_id}, building_id ${building_id}) with id ${newUAId}`);
      res.status(200).json({ id: newUAId });
    });
  } catch (error) {
    log.error(`User address (user_id ${user_id}, building_id ${building_id}) could not be created: ${error.message}`);

    next(
      new BSResUnprocessableError(
        `User address (user_id ${user_id}, building_id ${building_id}) could not be created!`
      )
    );
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a user address
 */
async function getUserAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting user address with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingUA = await connection.one<any>(sql`
        SELECT
          ua.id, ua.user_id, ua.building_id, ua.apartment_number,
          "user".first_name, "user".last_name, "user".email,
          ba.street, ba.number, ba.block_number AS building_block_number, ba.city, ba.postal_code
        FROM user_address AS ua
        INNER JOIN "user" ON "user".id = ua.user_id
        INNER JOIN building_address AS ba ON ba.id = ua.building_id
        WHERE ua.id = ${id};
      `);

      const existingUserAddressRes: UserAddressRes = {
        id: existingUA.id,
        user: {
          id: existingUA.user_id,
          first_name: existingUA.first_name,
          last_name: existingUA.last_name,
          email: existingUA.email,
        },
        address: {
          id: existingUA.building_id,
          street: existingUA.street,
          number: existingUA.number,
          building_block_number: existingUA.building_block_number,
          apartment_number: existingUA.apartment_number,
          postal_code: existingUA.postal_code,
          city: existingUA.city,
        },
      };

      res.status(200).json(existingUserAddressRes);
    });
  } catch (error) {
    log.error(`User address with id ${id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`User address with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a user address by query.
 */
async function getUserAddressByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { user_id } = req.query;
  log.info(`Getting user address of user_id ${user_id}`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingUA = await connection.one<any>(sql`
        SELECT
          ua.id, ua.user_id, ua.building_id, ua.apartment_number,
          "user".first_name, "user".last_name, "user".email,
          ba.street, ba.number, ba.block_number AS building_block_number, ba.city, ba.postal_code
        FROM user_address AS ua
        INNER JOIN "user" ON "user".id = ua.user_id
        INNER JOIN building_address AS ba ON ba.id = ua.building_id
        WHERE ua.user_id = ${user_id as any};
      `);

      const existingUserAddressRes: UserAddressRes = {
        id: existingUA.id,
        user: {
          id: existingUA.user_id,
          first_name: existingUA.first_name,
          last_name: existingUA.last_name,
          email: existingUA.email,
        },
        address: {
          id: existingUA.building_id,
          street: existingUA.street,
          number: existingUA.number,
          building_block_number: existingUA.building_block_number,
          apartment_number: existingUA.apartment_number,
          postal_code: existingUA.postal_code,
          city: existingUA.city,
        },
      };

      res.status(200).json(existingUserAddressRes);
    });
  } catch (error) {
    log.error(`User address with user_id ${user_id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`User address with user_id ${user_id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Update a user address
 */
async function updateUserAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { user_id } = req.query;
  const { building_id, apartment_number } = req.body;
  log.info(`Updating user address with user_id ${user_id}...`);

  try {
    // Sanitize input
    const sanitizedBuildingId = building_id ? building_id : null;

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      await connection.maybeOne(sql`
        UPDATE user_address
        SET
          building_id =  COALESCE(${sanitizedBuildingId}, building_id),
          apartment_number = ${apartment_number}
        WHERE user_id = ${user_id as any};
      `);

      log.info(`Updated user address with user_id ${user_id} successfully`);

      // Construct the response data
      const updatedUA = await connection.one<any>(sql`
        SELECT
          ua.id, ua.user_id, ua.building_id, ua.apartment_number,
          "user".first_name, "user".last_name, "user".email,
          ba.street, ba.number, ba.block_number AS building_block_number, ba.city, ba.postal_code
        FROM user_address AS ua
        INNER JOIN "user" ON ua.user_id = "user".id
        INNER JOIN building_address AS ba ON ua.building_id = ba.id
        WHERE ua.user_id = ${user_id as any};
      `);

      const updatedUserAddressRes: UserAddressRes = {
        id: updatedUA.id,
        user: {
          id: updatedUA.user_id,
          first_name: updatedUA.first_name,
          last_name: updatedUA.last_name,
          email: updatedUA.email,
        },
        address: {
          id: updatedUA.building_id,
          street: updatedUA.street,
          number: updatedUA.number,
          building_block_number: updatedUA.building_block_number,
          apartment_number: updatedUA.apartment_number,
          postal_code: updatedUA.postal_code,
          city: updatedUA.city,
        },
      };

      res.status(200).json(updatedUserAddressRes);
    });
  } catch (error) {
    log.error(`User address with user_id ${user_id} could not be updated: ${error.message}`);
    next(new BSResUnprocessableError(`User address with user_id ${user_id} could not be updated!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// User Address Controller
const UserAddressController = {
  createUserAddress,
  getUserAddress,
  getUserAddressByQuery,
  updateUserAddress,
};

// Export
export default UserAddressController;
