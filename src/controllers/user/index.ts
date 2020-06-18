// Library
import type { NextFunction, Request, Response } from 'express';
import { sql } from 'slonik';

// Interface, model and error
import type { User } from '@models/User';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Util
import { log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

// Supportting
import { genreateSaltHashPassword } from '@controllers/user/user-controller-support';

/**
 * Create user
 */
async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { first_name, last_name, email, password }: User & { password: string } = req.body;
  log.info(`Creating user with email ${email}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingUserId = await connection.maybeOneFirst(sql`
        SELECT id FROM "user" WHERE "user".email = LOWER(${email});
      `);

      // Throw an error if there is an user having the email
      if (existingUserId) {
        throw new BSError(`User with email ${email} already existed!`);
      }

      const { salt, hashPassword } = genreateSaltHashPassword(password);

      const newUser = await connection.one<User>(sql`
        INSERT INTO "user" (first_name, last_name, hash_password, salt, email, role)
        VALUES (
          ${first_name},
          ${last_name},
          ${hashPassword},
          ${salt},
          LOWER(${email}),
          'role_test'
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      log.info(`Created user with email ${email} and id: ${newUser.id}`);
      res.status(200).json({ id: newUser.id });
    });
  } catch (error) {
    log.error(`User with email ${email} could not be created: ${error.message}`);
    next(new BSResUnprocessableError(`User with email ${email} could not be created!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get user
 */
async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting user with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingUser = await connection.one<User>(sql`
        SELECT id, first_name, last_name, email, role FROM "user" WHERE id = ${id};
      `);

      res.status(200).json(existingUser);
    });
  } catch (error) {
    log.error(`User could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`User with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Update user
 */
async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  const { first_name, last_name, email, password } = req.body;
  log.info(`Updating user with id ${id}...`);

  try {
    const { salt = null, hashPassword = null } = password ? genreateSaltHashPassword(password) : {};
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const updatedUser = await connection.one<User>(sql`
        UPDATE "user"
        SET
          first_name = COALESCE(${first_name ? first_name : null}, first_name),
          last_name = COALESCE(${last_name ? last_name : null}, last_name),
          email = COALESCE(${email ? email : null}, email),
          hash_password = COALESCE(${hashPassword}, hash_password),
          salt = COALESCE(${salt}, salt)
        WHERE id = ${id}
        RETURNING id, first_name, last_name, email;
      `);

      log.info(`Updated user with id ${updatedUser.id} successfully`);

      res.status(200).json(updatedUser);
    });
  } catch (error) {
    log.error(`User with id ${id} could not be updated: ${error.message}`);
    next(new BSResUnprocessableError(`User with id ${id} could not be updated!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Delete user
 */
async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Deleting user with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const deletedUserId = await connection.oneFirst(sql`
        DELETE FROM "user" WHERE id = ${id} RETURNING id;
      `);

      log.info(`Deleted user with id ${deletedUserId}`);
      res.status(200).json({ id: deletedUserId });
    });
  } catch (error) {
    log.error(`User with id ${id} could not be deleted: ${error.message}`);
    next(new BSResUnprocessableError(`User with id ${id} could not be deleted!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// User Controller
const UserController = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};

// Export
export default UserController;
