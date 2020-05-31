// Library
import { setupSlonikMigrator, SlonikMigratorOptions } from '@slonik/migrator';

const createMigrator = (options: SlonikMigratorOptions) => {
  return setupSlonikMigrator(options);
};

export { createMigrator };
