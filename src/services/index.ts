// Library
import { createPool } from 'slonik';

// Typescript
import { config } from '@src/config';

// Database service
const dbService = () => {
  const { PG_HOST, PG_USER, PG_PASS, PG_DB } = config.DATABASE;
  const slonik = createPool(`postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}/${PG_DB}`);
  return slonik;
}

// Export
export const services = {
  dbService: dbService()
};
