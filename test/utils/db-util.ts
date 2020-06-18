// Library
import fs from 'fs';
import { createPool, sql } from 'slonik';
import { raw } from 'slonik-sql-tag-raw';

// App
import { config } from '@src/config';
import { createMigrator } from '@src/db/migrator';
import { log } from '@src/utils';

// Global variables
const { PG_HOST, PG_USER, PG_PASS, PG_DB } = config.DATABASE;

class DBUtil {
  private static slonik = createPool(`postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`);
  private static migrator = createMigrator({
    migrationsPath: 'src/db/migrations',
    migrationTableName: 'migration',
    logger: undefined,
    slonik: DBUtil.slonik,
  });

  /**
   * The function to seed some data globally to run before ALL test suits in jest
   */
  private static async seedData() {
    await this.slonik.connect(async connection => {
      try {
        log.info('Seeding data to database...');
        const query = fs.readFileSync(`${__dirname}/seed.sql`, 'utf-8');
        await connection.query(sql`${raw(query)}`);
        log.info('Successfullly seeded data to database.');
      } catch (error) {
        log.error(`Error when seeding data: ${error}`);
        throw error;
      }
    });
  }

  /**
   * The function to setup globally to run before ALL test suits in jest
   */
  public static async setup(): Promise<void> {
    try {
      log.info('Before all test suits: setting up database...');
      log.debug(`Database info config: PG_USER:${PG_USER}, PG_PASS:${PG_PASS}, PG_HOST:${PG_HOST}, PG_DB:${PG_DB}`);
      await this.migrator.down({ to: 0 as any });
      await this.migrator.up();
      await this.seedData();
      log.info('Successfully set up database.');
    } catch (error) {
      log.error(`Error when setting up database: ${error}`);
    }
  }

  /**
   * The function to teardown gloabally to run after ALL test suits in jest.
   */
  public static async teardown(): Promise<void> {
    try {
      log.info('After all test suits: Tearing down database...');
      await this.migrator.down({ to: 0 as any });
      await this.slonik.end();
      log.info('Successfully teared down database.');
    } catch (error) {
      log.error(`Error when tearing down database: ${error}`);
    }
  }
}

// Export
export { DBUtil };
