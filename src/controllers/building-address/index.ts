// Library
import type { NextFunction, Request, Response } from 'express';
import { sql } from 'slonik';

// Interface, model and error
import type { BuildingAddress } from '@models/BuildingAddress';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Util
import { capitalize, log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

/**
 * Create a building address
 */
async function createBuildingAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { street, number, block_number, postal_code, city }: BuildingAddress = req.body;
  log.info('Creating building address...');

  try {
    // Sanitize input
    const sanitizedStreet = capitalize(street.trim().toLowerCase());
    const sanitizedNumber = number ? number.trim().toUpperCase() : null;
    const sanitizedBlockNumber = block_number ? block_number.trim().toUpperCase() : null;
    const sanitizedPostalCode = postal_code.trim().toUpperCase();
    const sanitizedCity = capitalize(city.trim().toLowerCase());

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingBAId = await connection.maybeOneFirst(sql`
        SELECT id FROM building_address
        WHERE street = ${sanitizedStreet}
        AND number = ${sanitizedNumber}
        AND block_number = ${sanitizedBlockNumber}
        AND postal_code = ${sanitizedPostalCode}
        AND city = ${sanitizedCity};
      `);

      // Throw an error if there is existing building address
      if (existingBAId) {
        throw new BSError('Building address already existed!');
      }

      const newBAId = await connection.maybeOneFirst(sql`
        INSERT INTO building_address (street, number, block_number, city, postal_code)
        VALUES (
          ${sanitizedStreet},
          ${sanitizedNumber},
          ${sanitizedBlockNumber},
          ${sanitizedCity},
          ${sanitizedPostalCode}
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      // Throw an error if building address could not be created
      if (!newBAId) {
        throw new BSError(`Building address could not be created: ${JSON.stringify(newBAId)}`);
      }

      log.info(`Created building address (${street}, ${postal_code}, ${city}) with id ${newBAId}`);
      res.status(200).json({ id: newBAId });
    });
  } catch (error) {
    log.error(`Building address (${street}, ${postal_code}, ${city}) could not be created: ${error.message}`);
    next(new BSResUnprocessableError(`Building address (${street}, ${postal_code}, ${city}) could not be created!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a building address
 */
async function getBuildingAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting building address with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingBA = await connection.one<BuildingAddress>(sql`
        SELECT id, street, number, block_number, postal_code, city FROM building_address WHERE id = ${id};
      `);

      res.status(200).json(existingBA);
    });
  } catch (error) {
    log.error(`Building address with id ${id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`Building address with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Update a building address
 */
async function updateBuildingAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  const { street, number, block_number, postal_code, city } = req.body;
  log.info(`Updating building address with id ${id}...`);

  try {
    // Sanitze input
    const sanitizedStreet = street ? capitalize(street.trim()) : null;
    const sanitizedNumber = number ? number.trim().toUpperCase() : null;
    const sanitizedBlockNumber = block_number ? block_number.trim().toUpperCase() : null;
    const sanitizedPostalCode = postal_code ? postal_code.trim().toUpperCase() : null;
    const sanitizedCity = city ? capitalize(city.trim()) : null;

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const updatedBA = await connection.one<BuildingAddress>(sql`
        UPDATE building_address
        SET
          street = COALESCE(${sanitizedStreet}, street),
          number = ${sanitizedNumber},
          block_number = ${sanitizedBlockNumber},
          city = COALESCE(${sanitizedCity}, city),
          postal_code = COALESCE(${sanitizedPostalCode}, postal_code)
        WHERE id = ${id}
        RETURNING id, street, number, block_number, postal_code, city;
      `);

      log.info(`Updated building address id ${updatedBA.id} successfully`);

      res.status(200).json(updatedBA);
    });
  } catch (error) {
    log.error(`Building address with id ${id} could not be updated: ${error.message}`);
    next(new BSResUnprocessableError(`Building address with id ${id} could not be updated!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Delete a building address
 */
async function deleteBuildingAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Deleting building address with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const deletedBAId = await connection.oneFirst(sql`
        DELETE FROM building_address WHERE id = ${id} RETURNING id;
      `);

      log.info(`Deleted builiding address id ${deletedBAId} successfully.`);

      res.status(200).json({ id: deletedBAId });
    });
  } catch (error) {
    log.error(`Building address with id ${id} could not be deleted: ${error.message}`);
    next(new BSResUnprocessableError(`Building address with id ${id} could not be deleted!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// Building Address Controller
const BuildingAddressController = {
  createBuildingAddress,
  getBuildingAddress,
  updateBuildingAddress,
  deleteBuildingAddress,
};

// Export
export default BuildingAddressController;
