// Library
import { setupSlonikMigrator, SlonikMigratorOptions } from '@slonik/migrator';

// Export
export const createMigrator = (options: SlonikMigratorOptions) => {
  return setupSlonikMigrator(options);
};
