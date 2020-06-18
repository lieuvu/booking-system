// Library
import type { NextFunction, Request, Response } from 'express';
import { sql } from 'slonik';

// Interface, model and error
import type { Machine } from '@models/Machine';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Util
import { log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

/**
 * Create a machine
 */
async function createMachine(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { machine_type_id, brand, model, description }: Machine = req.body;
  log.info('Creating machine...');

  try {
    // Sanitize input
    const sanitizedDescription = description ? description : null;

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const newMachineId = await connection.maybeOneFirst(sql`
        INSERT INTO machine (machine_type_id, brand, model, description)
        VALUES (
          ${machine_type_id},
          ${brand},
          ${model},
          ${sanitizedDescription}
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      // Throw an error if machine could not be created
      if (!newMachineId) {
        throw new BSError(`Machine could not be created: ${JSON.stringify(newMachineId)}`);
      }

      log.info(`Created the machine with id ${newMachineId}`);
      res.status(200).json({ id: newMachineId });
    });
  } catch (error) {
    log.error(`Machine could not be created: ${error.message}`);
    next(new BSResUnprocessableError('Machine could not be created!'));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a machine
 */
async function getMachine(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting machine with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingMachineId = await connection.one<Machine>(sql`
        SELECT id, machine_type_id, brand, model, description FROM machine WHERE id = ${id};
      `);

      res.status(200).json(existingMachineId);
    });
  } catch (error) {
    log.error(`Machine with id ${id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`Machine with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Update a machine
 */
async function updateMachine(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  const { machine_type_id, brand, model, description } = req.body;
  log.info(`Updating machine with id ${id}...`);

  try {
    // Sanitize input
    const sanitizedMachineId = machine_type_id ? machine_type_id : null;
    const sanitizedBrand = brand ? brand : null;
    const sanitizedModel = model ? model : null;
    const sanitizedDescription = description ? description : null;

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {

      // Throw an error if there is no machine type found
      if (machine_type_id) {
        const existingMTId = await connection.maybeOneFirst(sql`
          SELECT id FROM machine_type WHERE id = ${machine_type_id};
        `);

        if (!existingMTId) {
          throw new BSError(`No machine type with id ${machine_type_id} found!`);
        }
      }

      const updatedMachine = await connection.one<Machine>(sql`
        UPDATE machine
        SET
          machine_type_id = COALESCE(${sanitizedMachineId}, machine_type_id),
          brand = COALESCE(${sanitizedBrand}, brand),
          model = COALESCE(${sanitizedModel}, model),
          description = COALESCE(${sanitizedDescription}, description)
        WHERE id = ${id}
        RETURNING id, machine_type_id, brand, model, description;
      `);

      log.info(`Updated machine id ${updatedMachine.id} successfully`);

      res.status(200).json(updatedMachine);
    });
  } catch (error) {
    log.error(`Machine with id ${id} could not be updated: ${error.message}`);
    next(new BSResUnprocessableError(`Machine with id ${id} could not be updated!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Delete a machine
 */
async function deleteMachine(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Deleting machine with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const deletedMachineId = await connection.oneFirst(sql`
        DELETE FROM machine WHERE id = ${id} RETURNING id;
      `);

      log.info(`Deleted machine id ${deletedMachineId} successfully.`);

      res.status(200).json({ id: deletedMachineId });
    });
  } catch (error) {
    log.error(`Machine with id ${id} could not be deleted: ${error.message}`);
    next(new BSResUnprocessableError(`Machine with id ${id} could not be deleted!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// Machine Controller
const MachineController = {
  createMachine,
  getMachine,
  updateMachine,
  deleteMachine,
};

// Export
export default MachineController;
