// Library
import { SlonikMigrator, SlonikMigratorOptions } from '@slonik/migrator';

// Export
export function createMigrator(options: SlonikMigratorOptions): SlonikMigrator {
  return new SlonikMigrator(options);
}
