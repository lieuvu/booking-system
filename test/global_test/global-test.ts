/**
 * The module defines
 * - global methods such as setup and teardown to run globally before all test suits
 * - global objects that can be used in all test suits
 */


// Library
import { sql, createPool, DatabaseConnectionType } from 'slonik';
import { raw } from 'slonik-sql-tag-raw';

// Typescript
import { config } from '../../src/config/system-config';
import { createMigrator } from '../../src/db/migrator';
import { log } from '../../src/util/logger';


// Global variables
const { PG_HOST, PG_USER, PG_PASS, PG_DB } = config.DATABASE;
const slonik = createPool(`postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`);
const migrator = createMigrator({
  migrationsPath: 'src/db/migrations',
  log: () => { },
  slonik: slonik,
});

/**
 * The function to seed some data globally to run before ALL test suits in jest
 */
const seedData = async () => await slonik.connect(async (connection) => {
  try {
    log.info('Seeding data to database...')

    const query = `
      INSERT INTO building_address (street, number, city, postal_code)
      VALUES
      ('Siltakuja', '2', 'Espoo', '02330'),
      ('Sepetlahdentie', '6', 'Espoo', '02230');
    `;
    await connection.query(sql`${raw(query)}`);

    log.info('Successfullly seeded data to database.');
  } catch (error) {
    log.error(`Error when seeding data: ${error}`);
    throw error;
  }
})

/**
 * The function to setup globally to run before ALL test suits in jest
 */
const setup = async () => {
  try {
    log.info('Before all test suits: setting up database...');
    log.debug(`Database info config: PG_USER:${PG_USER}, PG_PASS:${PG_PASS}, PG_HOST:${PG_HOST}, PG_DB:${PG_DB}`);
    await migrator.up();
    await seedData();
    log.info('Successfully set up database.');
  } catch (error) {
    log.error(`Error when setting up database: ${error}`);
  }
};

/**
 * The function to teardown gloabally to run after ALL test suits in jest.
 */
const teardown = async () => {
  try {
    log.info('After all test suits: Tearing down database...');
    await migrator.down('0');
    await slonik.end();
    log.info('Successfully teared down database.');
  } catch (error) {
    log.error(`Error when tearing down database: ${error}`);
  }
};

// Export
export {
  DatabaseConnectionType,
  sql,
  slonik,
  setup,
  teardown
}
