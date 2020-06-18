// Library
import suppertest from 'supertest';

// App
import { app } from '@src/app';

// Hook app to supertest
const server = suppertest(app);

// Interfaces
interface MachineTypeReqBody {
  type: string;
}

/**
 * Machine Type API test
 */
describe('Machine Type API', () => {
  // --------------
  /** Happy Path */
  // --------------
  describe('Happy Path', () => {

    // POST Request
    describe('POST Request', () => {
      test('should create a machine type', () => server
        .post('/api/v1/machine-type')
        .send({
          type: 'Rotary Ironer',
        })
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).not.toBeNull();
          expect(id).toBeGreaterThan(3); // Since 3 machines were seeded in the database
        })
      );
    });

    // GET Request
    describe('GET Request', () => {
      test('should get a machine type', () => server
        .get('/api/v1/machine-type/1')
        .expect(200)
        .then(response => {
          const { id, type } = response.body;

          expect(id).toEqual(1);
          expect(type).toEqual('Washing Machine');
        })
      );
    });

    // PUT Request
    describe('PUT Request', () => {
      test('should update a machine type', () => server
        .put('/api/v1/machine-type/4')
        .send({
          type: 'Tumble Dryer',
        })
        .expect(200)
        .then(response => {
          const { id, type } = response.body;

          expect(id).toBe(4);
          expect(type).toBe('Tumble Dryer');
        })
      );
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should delete a machine type', () => server
        .delete('/api/v1/machine-type/3')
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).toBe(3);
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
      const validMachineType: MachineTypeReqBody = {
        type: 'Press',
      };

      describe('Invalid Data', () => {
        test('should not create a machine type when data having no properties', () => {
          const invalidMachineType = {};

          return server
            .put('/api/v1/machine-type/1')
            .send(invalidMachineType)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a machine type when data having additional properties', () => {
          const invalidMachineType = {
            ...validMachineType,
            foo: 'baz',
          };

          return server
            .put('/api/v1/machine-type/1')
            .send(invalidMachineType)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not create a machine type when missing a required property', async () => {
          const invalidMachineType: MachineTypeReqBody = JSON.parse(JSON.stringify(validMachineType));
          delete invalidMachineType['type'];

          return server
            .post('/api/v1/machine-type')
            .send(invalidMachineType)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a machine type when a type is malformed', () => {
          const invalidMachineType = {
            ...validMachineType,
            type: '',
          };

          return server
            .post('/api/v1/machine-type')
            .send(invalidMachineType)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Machine Type Existed', () => {
        test('Should not create a machine type if existed', () => {
          const invalidMachineType = {
            type: 'Washing Machine',
          };

          return server
            .post('/api/v1/machine-type')
            .send(invalidMachineType)
            .expect(422, { message: 'Machine type (Washing Machine) could not be created!' });
        });
      });
    });

    // GET Request
    describe('GET Request', () => {
      test('should not get a machine type when it does not exist', () => server
        .get('/api/v1/machine-type/999')
        .expect(422, { message: 'Machine type with id 999 could not be found!' })
      );

      test('should not get a machine type when an id is an empty string', () => server
        .get('/api/v1/machine-type/')
        .expect(404)
      );

      test('should not get a machine type when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .get(`/api/v1/machine-type/${invalidId}`)
            .expect(
              400,
              { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });
    });

    // PUT Request
    describe('PUT Request', () => {
      const validMachineType: MachineTypeReqBody = {
        type: 'Iron',
      };

      describe('Invalid Id', () => {
        test('should not update a machine type when it does not exist', () => server
          .put('/api/v1/machine-type/999')
          .send(validMachineType)
          .expect(422, { message: 'Machine type with id 999 could not be updated!' })
        );

        test('should not update a machine type when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .put(`/api/v1/machine-type/${invalidId}`)
              .send(validMachineType)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });
      });

      describe('Invalid Data', () => {
        test('should not update a machine type when data having no properties', () => {
          const invalidMachineType = {};

          return server
            .put('/api/v1/machine-type/1')
            .send(invalidMachineType)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a machine type when data having additional properties', () => {
          const invalidMachineType = {
            ...validMachineType,
            foo: 'baz',
          };

          return server
            .put('/api/v1/machine-type/1')
            .send(invalidMachineType)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not update a machine type when a machine type is invalid', async () => {
          const invalidMachineTypes = ['', null];

          for (const invalidType of invalidMachineTypes) {
            const invalidMachineType = {
              ...validMachineType,
              type: invalidType,
            };

            await server
              .put('/api/v1/machine-type/1')
              .send(invalidMachineType)
              .expect(400, { message: 'Invalid request body!' });
          }
        });
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should not deleted a machine type when it does not exist', () => server
        .delete('/api/v1/machine-type/999')
        .expect(422, { message: 'Machine type with id 999 could not be deleted!' })
      );

      test('should not deleted a machine type when it is assigned to a machine', () => server
        .delete('/api/v1/machine-type/1')
        .expect(422, { message: 'Machine type with id 1 could not be deleted!' })
      );

      test('should not deleted a machine type when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .delete(`/api/v1/machine-type/${invalidId}`)
            .expect(
              400,
              { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });
    });
  });
});
