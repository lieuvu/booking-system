// Library
import type { DatabasePoolType } from 'slonik';
import { createPool } from 'slonik';

// App
import { config } from '@src/config';
import { log } from '@src/utils';

/**
 * Class DBFactoryService
 *
 * The class to provide static methods to get connection pool. It makes sure
 * that only one instance of connection pool is used during requests.
 */
class DBFactoryService {
  // Private properties
  private static slonik: DatabasePoolType = null;

  private constructor() {}

  public static getConnectionPool(): DatabasePoolType {
    const { PG_HOST, PG_USER, PG_PASS, PG_DB } = config.DATABASE;

    // Create a new connection pool for the first time or if the pool was ended
    if (DBFactoryService.slonik === null || DBFactoryService.slonik.getPoolState().ended) {
      log.debug(`Creating new connection pool at postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`);
      const connectionUrl = `postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`;
      DBFactoryService.slonik = createPool(connectionUrl, { maximumPoolSize: 20 });
    }

    log.debug(`Returning a connection pool at postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`);
    return DBFactoryService.slonik;
  }

  public static async closeConnectionPool(): Promise<void> {
    const { PG_HOST, PG_USER, PG_PASS, PG_DB } = config.DATABASE;

    log.debug(`Closing database connetion at postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}..`);

    // Do nothing if there is no connection pool or if the connection pool was ended
    if (DBFactoryService.slonik === null || DBFactoryService.slonik.getPoolState().ended) {
      log.debug('Connection pool at was already closed!');
      return;
    }

    // Do nothing if the connection pool having active connetion
    if (DBFactoryService.slonik.getPoolState().activeConnectionCount > 0) {
      log.debug('There are active connections! Skipping...');
      return;
    }

    // Close the connection pool
    await DBFactoryService.slonik.end();

    log.debug('Database connection is closed successfully!');
  }
}

// Export
export { DBFactoryService };
