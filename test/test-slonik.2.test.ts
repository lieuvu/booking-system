// Library
import { raw } from 'slonik-sql-tag-raw';

// Typescript
import { slonik, sql, DatabaseConnectionType } from './global_test/global-test';
import { Machine } from '@src/model/machine';
import { log } from '@src/util/logger';


const addData = async () => await slonik.connect(async (connection) => {
  try {
    log.info('Adding data to database...')

    const query = `
      INSERT INTO machine (building_id, brand, model, description, number, type)
      VALUES
      (1, 'Taplet', 'A80', 'Taplet washing machine model A80 5kg max', 1, 'Washing machine'),
      (1, 'Taplet', 'A80', 'Taplet washing machine model A80 5kg max', 2, 'Washing machine'),
      (1, 'Taplet', 'A90', 'Taplet drying machine model A90 10kg max', 3, 'Drying machine'),
      (2, 'Taplet', 'A82', 'Taplet washing machine model A80 5kg max', 1, 'Washing machine'),
      (2, 'Taplet', 'A90', 'Taplet drying machine model A90 10kg max', 2, 'Drying machine');
    `;
    await connection.query(sql`${raw(query)}`);

    log.info('Successfullly added data to database.');
  } catch (error) {
    log.error(`Error when adding data: $${error}`);
  }
})

// Setup and teardown
beforeAll(async () => {
  await addData();
});

test('Should return data', async () => {
  await slonik.connect(async (connection: DatabaseConnectionType) => {
    const result: Machine[] = await connection.many(sql`SELECT * FROM machine;`);

    expect(result.length).toBe(5);
  });
});
