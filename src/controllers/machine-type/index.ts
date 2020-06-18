// Library
import type { NextFunction, Request, Response } from 'express';
import { sql } from 'slonik';

// Interface, model and error
import type { MachineType } from '@models/MachineType';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Util
import { log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

/**
 * Create a machine type
 */
async function createMachineType(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { type }: MachineType = req.body;
  log.info('Creating machine type...');

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingMTId = await connection.maybeOneFirst(sql`
        SELECT id FROM machine_type WHERE type = ${type};
      `);

      // Throw an error if there is existing machine type
      if (existingMTId) {
        throw new BSError('Machine type already existed!');
      }


      const newMTId = await connection.maybeOneFirst(sql`
        INSERT INTO machine_type (type)
        VALUES (${type})
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      // Throw an error if the machine type could not be created
      if (!newMTId) {
        throw new BSError(`Machine type could not be created: ${JSON.stringify(newMTId)}`);
      }

      log.info(`Created the machine type (${type}) with id ${newMTId}`);
      res.status(200).json({ id: newMTId });
    });
  } catch (error) {
    log.error(`Machine type (${type}) could not be created: ${error.message}`);
    next(new BSResUnprocessableError(`Machine type (${type}) could not be created!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a machine type
 */
async function getMachineType(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting machine type with id ${id}`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingMTId = await connection.one<MachineType>(sql`
        SELECT id, type FROM machine_type WHERE id = ${id};
      `);

      res.status(200).json(existingMTId);
    });
  } catch (error) {
    log.error(`Machine type with id ${id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`Machine type with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Update a machine type
 */
async function updateMachineType(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  const { type } = req.body;
  log.info(`Updating machine type with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const updatedMT = await connection.one<MachineType>(sql`
        UPDATE machine_type
        SET
          type = COALESCE(${type}, type)
        WHERE id = ${id}
        RETURNING id, type;
      `);

      log.info(`Updated machine type id ${updatedMT.id} successfully`);

      res.status(200).json(updatedMT);
    });
  } catch (error) {
    log.error(`Machine type with id ${id} could not be updated: ${error.message}`);
    next(new BSResUnprocessableError(`Machine type with id ${id} could not be updated!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Delete a machine type
 */
async function deleteMachineType(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Deleting machine type with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const deletedMTId = await connection.oneFirst(sql`
        DELETE FROM machine_type WHERE id = ${id} RETURNING id;
      `);

      log.info(`Deleted machine type id ${deletedMTId} successfully.`);

      res.status(200).json({ id: deletedMTId });
    });
  } catch (error) {
    log.error(`Machine type with id ${id} could not be deleted: ${error.message}`);
    next(new BSResUnprocessableError(`Machine type with id ${id} could not be deleted!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// Machine Type Controller
const MachineTypeController = {
  createMachineType,
  getMachineType,
  updateMachineType,
  deleteMachineType,
};

// Export
export default MachineTypeController;
