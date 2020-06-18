// Library
import 'module-alias/register';
import { SlonikMigrator } from '@slonik/migrator';
import { createPool } from 'slonik';

// App
import { config } from '@src/config';

const { PG_HOST, PG_USER, PG_PASS, PG_DB } = config.DATABASE;
const slonik = createPool(`postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`);

const migrator = new SlonikMigrator({
  migrationsPath: __dirname + '/migrations',
  migrationTableName: 'migration',
  logger: console,
  slonik,
});

migrator.runAsCLI();
