// Library
import { raw } from 'slonik-sql-tag-raw';

// Typescript
import { slonik, sql, DatabaseConnectionType } from './global_test/global-test';
import { BuildingAddress } from '@src/model/building-address';


test('Should return data', async () => {
  await slonik.connect(async (connection: DatabaseConnectionType) => {
    const query = 'SELECT street, number, city, postal_code FROM building_address;';
    const result: BuildingAddress[] = await connection.many(sql`${raw(query)}`);

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result).toContainEqual({ street: 'Siltakuja', number: '2', city: 'Espoo', postal_code: '02330' });
    expect(result).toContainEqual({ street: 'Sepetlahdentie', number: '6', city: 'Espoo', postal_code: '02230' });
  })
})
