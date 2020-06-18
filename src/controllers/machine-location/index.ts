// Library
import type { NextFunction, Request, Response } from 'express';
import { sql, SqlTokenType } from 'slonik';

// Interface, model and error
import type { MachineLocation } from '@models/MachineLocation';
import { MachineLocationQueryRes, MachineLocationStatus } from '@models/MachineLocation';
import { BSError } from '@common/error/BSError';
import { BSResUnprocessableError } from '@common/error/BSResError';

// Util
import { log } from '@src/utils';

// Serivce
import { DBFactoryService } from '@src/services';

// Supporting
import { convertToMLResponse } from '@controllers/machine-location/machine-locaton-support';

/**
 * Create a machine location
 */
async function createMachineLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { machine_id, building_id, number, status }: MachineLocation = req.body;
  log.info('Creating machine location...');

  try {
    // Sanitize input
    const sanitizedNumber = number ? number : -1;
    const sanitizedStatus = status ? status : MachineLocationStatus.Storage;

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingMLId = await connection.maybeOneFirst(sql`
        SELECT id FROM machine_location WHERE machine_id = ${machine_id};
      `);

      // Throw an error if there is existing machine location
      if (existingMLId) {
        throw new BSError('Machine location already existed!');
      }

      if (sanitizedNumber !== -1) {
        const existingMLIdWithNumber = await connection.maybeOneFirst(sql`
          SELECT id FROM machine_location
          WHERE building_id = ${building_id}
          AND number = ${sanitizedNumber};
        `);

        // Throw an error if there is existing machine with the provided number
        // in the same building
        if (existingMLIdWithNumber) {
          throw new BSError(`Machine location already has a machine with number ${sanitizedNumber}`);
        }
      }

      const newMLId = await connection.maybeOneFirst(sql`
        INSERT INTO machine_location (machine_id, building_id, number, status)
        VALUES (
          ${machine_id},
          ${building_id},
          ${sanitizedNumber},
          ${sanitizedStatus}
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `);

      // Throw an error if machine location could not be created
      if (!newMLId) {
        throw new BSError(`Machine location could not be created: ${JSON.stringify(newMLId)}`);
      }

      log.info(`Created machine location of machine ${machine_id} at building ${building_id} with id ${newMLId}`);
      res.status(200).json({ id: newMLId });
    });
  } catch (error) {
    log.error(`Machine location of machine ${machine_id} at building ${building_id} ` +
              `could not be created: ${error.message}`);
    next(
      new BSResUnprocessableError(`Machine location of machine ${machine_id} at building ${building_id} ` +
                                  'could not be created!')
    );
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a machine location
 */
async function getMachineLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Getting machine location with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const existingMLQueryRes = await connection.one<MachineLocationQueryRes>(sql`
        SELECT
          mt.type AS machine_type,
          m.id AS machine_id, m.brand AS machine_brand, m.model AS machine_model, m.description AS machine_description,
          ml.id, ml.number AS machine_number,
          ba.id AS building_address_id, ba.street AS building_address_street, ba.number AS building_address_number,
          ba.block_number AS building_address_block_number, ba.city AS building_address_city,
          ba.postal_code AS building_address_postal_code
        FROM machine_type AS mt
        INNER JOIN machine AS m ON m.machine_type_id = mt.id
        INNER JOIN machine_location AS ml ON ml.machine_id = m.id
        INNER JOIN building_address AS ba ON ba.id = ml.building_id
        WHERE ml.id = ${id};
      `);

      const existingMLRes = convertToMLResponse(existingMLQueryRes);

      res.status(200).json(existingMLRes);
    });
  } catch (error) {
    log.error(`Machine location with id ${id} could not be found: ${error.message}`);
    next(new BSResUnprocessableError(`Machine location with id ${id} could not be found!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Get a machine location by query
 */
async function getMachineLocationByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { machine_id, building_id, status } = req.query;
  log.info(
    'Getting machine location with query ' +
    `(machine_id: ${machine_id}, building_id: ${building_id}, status: ${status})...`
  );

  try {
    const dbService = DBFactoryService.getConnectionPool();
    const query: SqlTokenType[] = [];

    // Build query
    if (machine_id) {
      query.push(sql`ml.machine_id = ${machine_id as any}`);
    }

    if (building_id) {
      query.push(sql`ml.building_id = ${building_id as any}`);
    }

    if (status) {
      query.push(sql`ml.status = ${status as any}`);
    }

    await dbService.connect(async connection => {
      const existingMLQueryResponses = await connection.many<MachineLocationQueryRes>(sql`
        SELECT
          mt.type AS machine_type,
          m.id AS machine_id, m.brand AS machine_brand, m.model AS machine_model, m.description AS machine_description,
          ml.id, ml.number AS machine_number,
          ba.id AS building_address_id, ba.street AS building_address_street, ba.number AS building_address_number,
          ba.block_number AS building_address_block_number, ba.city AS building_address_city,
          ba.postal_code AS building_address_postal_code
        FROM machine_type AS mt
        INNER JOIN machine AS m ON m.machine_type_id = mt.id
        INNER JOIN machine_location AS ml ON ml.machine_id = m.id
        INNER JOIN building_address AS ba ON ba.id = ml.building_id
        WHERE ${sql.join(query, sql` AND `)};
      `);

      const existingMLResponses = existingMLQueryResponses.map(queryRes => convertToMLResponse(queryRes));

      res.status(200).json(existingMLResponses);
    });
  } catch (error) {
    log.error(
      `Machine location with query (machine_id: ${machine_id}, building_id: ${building_id}, status: ${status}) ` +
      `could not be found: ${error.message}`
    );
    next(
      new BSResUnprocessableError(
        `Machine location with query (machine_id: ${machine_id}, building_id: ${building_id}, status: ${status}) ` +
        'could not be found!'
      )
    );
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Update a machine location
 */
async function updateMachineLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  const { machine_id, building_id, number, status } = req.body;
  log.info(`Updating machine location with id ${id}...`);

  try {
    // Sanitize input
    const sanitizedMachineId = machine_id ? machine_id : null;
    const sanitizedBuildingId = building_id ? building_id : null;
    const sanitizedNumber = number ? number : null;
    const sanitizedStatus = status ? status : null;

    // DB service
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const updatedML = await connection.one<MachineLocation>(sql`
        UPDATE machine_location
        SET
          machine_id = COALESCE(${sanitizedMachineId}, machine_id),
          building_id = COALESCE(${sanitizedBuildingId}, building_id),
          number = COALESCE(${sanitizedNumber}, number),
          status = COALESCE(${sanitizedStatus}, status)
        WHERE id = ${id}
        RETURNING id, machine_id, building_id, number, status;
      `);

      log.info(`Updated machine location id ${updatedML.id} successfully`);

      res.status(200).json(updatedML);
    });
  } catch (error) {
    log.error(`Machine location with id ${id} could not be updated: ${error.message}`);
    next(new BSResUnprocessableError(`Machine location with id ${id} could not be updated!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

/**
 * Delete a machine location
 */
async function deleteMachineLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  log.info(`Deleting machine location with id ${id}...`);

  try {
    const dbService = DBFactoryService.getConnectionPool();

    await dbService.connect(async connection => {
      const deletedMLId = await connection.oneFirst(sql`
        DELETE FROM machine_location WHERE id = ${id} RETURNING id;
      `);

      log.info(`Deleted machine location id ${deletedMLId} successfully.`);

      res.status(200).json({ id: deletedMLId });
    });
  } catch (error) {
    log.error(`Machine location with id ${id} could not be deleted: ${error.message}`);
    next(new BSResUnprocessableError(`Machine location with id ${id} could not be deleted!`));
  } finally {
    await DBFactoryService.closeConnectionPool();
  }
}

// Machine Location Controller
const MachineLocationController = {
  createMachineLocation,
  getMachineLocation,
  getMachineLocationByQuery,
  updateMachineLocation,
  deleteMachineLocation,
};

// Export
export default MachineLocationController;
