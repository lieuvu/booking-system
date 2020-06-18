// Library
import suppertest from 'supertest';

// App
import { app } from '@src/app';

// Hook app to supertest
const server = suppertest(app);

// Interfaces
interface BuildingReqBody {
  street: string;
  number?: string | null;
  block_number?: string | null;
  postal_code: string;
  city: string;
}

/**
 * Building Address API test
 */
describe('Building Address API', () => {
  // --------------
  /** Happy Path */
  // --------------
  describe('Happy Path', () => {

    // POST Request
    describe('POST Request', () => {
      test('should create a building address', () => server
        .post('/api/v1/building-address')
        .send({
          street: 'Siltakuja',
          number: '2',
          block_number: 'B',
          postal_code: '02330',
          city: 'Espoo'
        })
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).not.toBeNull();
          expect(id).toBeGreaterThan(5); // Since 5 buildings were seeded in the database
        })
      );
    });

    // GET Request
    describe('GET Request', () => {
      test('should get a building address', () => server
        .get('/api/v1/building-address/1')
        .expect(200)
        .then(response => {
          const { id, street, number, block_number, postal_code, city } = response.body;

          expect(id).toEqual(1);
          expect(street).toEqual('Siltakuja');
          expect(number).toEqual('2');
          expect(block_number).toEqual('A');
          expect(postal_code).toEqual('02330');
          expect(city).toEqual('Espoo');
        })
      );
    });

    // PUT Request
    describe('PUT Request', () => {
      test('should update a building address with full data', () => server
        .put('/api/v1/building-address/2')
        .send({
          street: 'Hakaniemenranta',
          number: '12',
          block_number: 'F',
          postal_code: '00530',
          city: 'Helsinki',
        })
        .expect(200)
        .then(response => {
          const { id, street, number, block_number, postal_code, city } = response.body;

          expect(id).toBe(2);
          expect(street).toBe('Hakaniemenranta');
          expect(number).toBe('12');
          expect(block_number).toBe('F');
          expect(postal_code).toBe('00530');
          expect(city).toBe('Helsinki');
        })
      );

      test('should update a building address with full data with null fields', () => server
        .put('/api/v1/building-address/2')
        .send({
          street: 'Hakaniemenranta',
          number: null,
          block_number: null,
          postal_code: '00530',
          city: 'Helsinki',
        })
        .expect(200)
        .then(response => {
          const { id, street, number, block_number, postal_code, city } = response.body;

          expect(id).toBe(2);
          expect(street).toBe('Hakaniemenranta');
          expect(number).toBe(null);
          expect(block_number).toBe(null);
          expect(postal_code).toBe('00530');
          expect(city).toBe('Helsinki');
        })
      );

      test('should update a building address with partial data', async () => {
        const validBuildingAddress = {
          street: 'Pohjoinen Rautatiekatu',
          number: '29',
          block_number: 'C',
          postal_code: '00100',
          city: 'Helsinki',
        };

        for (const [key, value] of Object.entries(validBuildingAddress)) {
          const data = { [key]: value };

          await server
            .put('/api/v1/building-address/2')
            .send(data)
            .expect(200)
            .then(response => {
              const { id } = response.body;
              const updatedValue = response.body[key];

              expect(id).toBe(2);
              expect(updatedValue).toBe(value);
            });
        }
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should delete a building address', () => server
        .delete('/api/v1/building-address/4')
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).toBe(4);
        })
      );
    });

  });

  // ------------
  /** Sad Path */
  // ------------
  describe('SAD PATH', () => {

    // POST Request
    describe('POST Request', () => {
      const validBuildingAddress: BuildingReqBody = {
        street: 'Haukilahdenkuja',
        number: '15',
        block_number: 'A',
        postal_code: '00580',
        city: 'Helsinki',
      };

      describe('Invalid Data', () => {
        test('should not create a building address when data having no properties', () => {
          const invalidBuildingAddress = {};

          return server
            .post('/api/v1/building-address')
            .send(invalidBuildingAddress)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a building address when data having additional properties', () => {
          const invalidBuildingAddress = {
            ...validBuildingAddress,
            foo: 'baz',
          };

          return server
            .post('/api/v1/building-address')
            .send(invalidBuildingAddress)
            .expect(400, { message: 'Invalid request body!' });
        });
      });


      describe('Invalid Properties', () => {
        test('should not create a building address when missing a required property', async () => {
          const requiredProps = ['street', 'postal_code', 'city'];

          for (const toBeRemovedProp of requiredProps) {
            const invalidBuildingAddress: BuildingReqBody = JSON.parse(JSON.stringify(validBuildingAddress));
            delete invalidBuildingAddress[toBeRemovedProp];

            await server
              .post('/api/v1/building-address')
              .send(invalidBuildingAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a building address when one of properties is invalid', async () => {
          const testingProps = ['street', 'number', 'block_number', 'postal_code', 'city'];

          for (const toBeInvalidProp of testingProps) {
            const invalidBuildingAddress = {
              ...validBuildingAddress,
              [toBeInvalidProp]: '',
            };

            return server
              .post('/api/v1/building-address')
              .send(invalidBuildingAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });
      });

      describe('Building Address Existed', () => {
        test('Should not create a building address when street and city are in lowercase', () => {
          const invalidBuildingAddress: BuildingReqBody = {
            street: 'siltakuja',
            number: '2',
            block_number: 'a',
            postal_code: '02330',
            city: 'espoo',
          };

          return server
            .post('/api/v1/building-address')
            .send(invalidBuildingAddress)
            .expect(422, { message: 'Building address (siltakuja, 02330, espoo) could not be created!' });
        });

        test('Should not create a building address when street and city are in mixed-case', () => {
          const invalidBuildingAddress = {
            street: 'SiLTakUja',
            number: '2',
            block_number: 'a',
            postal_code: '02330',
            city: 'ESpOo',
          };

          return server
            .post('/api/v1/building-address')
            .send(invalidBuildingAddress)
            .expect(422, { message: 'Building address (SiLTakUja, 02330, ESpOo) could not be created!' });
        });


      });

    });

    // GET Request
    describe('GET Request', () => {
      test('should not get a building address when id does not exist', () => server
        .get('/api/v1/building-address/999')
        .expect(422, { message: 'Building address with id 999 could not be found!' })
      );

      test('should not get a building address when an id is an empty string', () => server
        .get('/api/v1/building-address/')
        .expect(404)
      );

      test('should not get a building address when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .get(`/api/v1/building-address/${invalidId}`)
            .expect(
              400,
              { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });
    });

    // PUT Request
    describe('PUT Request', () => {
      const validBuildingAddress: BuildingReqBody = {
        street: 'Intiankatu',
        number: '20',
        block_number: 'C',
        postal_code: '00560',
        city: 'Helsinki',
      };

      describe('Invalid Id', () => {
        test('should not update a building address when it does not exist', () => server
          .put('/api/v1/building-address/999')
          .send(validBuildingAddress)
          .expect(422, { message: 'Building address with id 999 could not be updated!' })
        );

        test('should not update a building address when an id is an empty string', () => server
          .put('/api/v1/building-address/')
          .send(validBuildingAddress)
          .expect(404)
        );

        test('should not update a building address when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .put(`/api/v1/building-address/${invalidId}`)
              .send(validBuildingAddress)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });
      });

      describe('Invalid Data', () => {
        test('should not update a building address when data having no properties', () => {
          const invalidBuildingAddress = {};

          return server
            .put('/api/v1/building-address/1')
            .send(invalidBuildingAddress)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a building address when data having additional properties', () => {
          const invalidBuildingAddress = {
            ...validBuildingAddress,
            foo: 'baz',
          };

          return server
            .put('/api/v1/building-address/1')
            .send(invalidBuildingAddress)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not update one of properties is invalid', async () => {
          const testingProps = ['street', 'number', 'block_number', 'postal_code', 'city'];

          for (const toBeInvalidProp of testingProps) {
            const invalidBuildingAddress = {
              ...validBuildingAddress,
              [toBeInvalidProp]: '',
            };

            return server
              .put('/api/v1/building-address/1')
              .send(invalidBuildingAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      describe('Invalid Id', () => {
        test('should not deleted a building address when an id is a string', () => server
          .delete('/api/v1/building-address/abc')
          .expect(400, { message: 'The param id [abc] is not strictly positive integer!' })
        );

        test('should not deleted a building address when an id is an empty string', () => server
          .delete('/api/v1/building-address/')
          .expect(404)
        );

        test('should not deleted a building address when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .delete(`/api/v1/building-address/${invalidId}`)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });

        test('should not deleted a building address when it does not exist', () => server
          .delete('/api/v1/building-address/999')
          .expect(422, { message: 'Building address with id 999 could not be deleted!' })
        );

        test('should not deleted a building address when it is is assigned to a user', () => server
          .delete('/api/v1/building-address/3')
          .expect(422, { message: 'Building address with id 3 could not be deleted!' })
        );
      });
    });
  });
});
