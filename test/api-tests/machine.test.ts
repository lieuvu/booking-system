// Library
import suppertest from 'supertest';

// App
import { app } from '@src/app';

// Hook app to supertest
const server = suppertest(app);

// Interfaces
interface MachineReqBody {
  machine_type_id: number;
  brand: string;
  model: string;
  description?: string;
}

/**
 * User API test
 */
describe('Machine API', () => {
  // --------------
  /** Happy Path */
  // --------------
  describe('Happy Path', () => {

    // POST Request
    describe('POST Request', () => {
      test('should create a machine', () => server
        .post('/api/v1/machine')
        .send({
          machine_type_id: 1,
          brand: 'Taplet',
          model: 'T131',
          description: 'Taplet washing machine T131',
        })
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).not.toBeNull();
          expect(id).toBeGreaterThan(7); // Since seven machines were seeded in the database
        })
      );
    });

    // GET Request
    describe('GET Request', () => {
      test('should get a machine', () => server
        .get('/api/v1/machine/3')
        .expect(200)
        .then(response => {
          const { id, machine_type_id, brand, model } = response.body;

          expect(id).toEqual(3);
          expect(machine_type_id).toEqual(2);
          expect(brand).toEqual('Taplet');
          expect(model).toEqual('T320');
        })
      );
    });

    // PUT Request
    describe('PUT Request', () => {
      test('should update a machine with full data', () => server
        .put('/api/v1/machine/2')
        .send({
          machine_type_id: 2,
          brand: 'Electrolux',
          model: 'E789',
          description: 'Electrolux washing machine E789',
        })
        .expect(200)
        .then(response => {
          const { id, machine_type_id, brand, model, description } = response.body;

          expect(id).toBe(2);
          expect(machine_type_id).toBe(2);
          expect(brand).toBe('Electrolux');
          expect(model).toBe('E789');
          expect(description).toBe('Electrolux washing machine E789');
        })
      );

      test('should update a machine with partial data', () => server
        .put('/api/v1/machine/2')
        .send({
          brand: 'Bosh',
          model: 'B770',
          description: 'Bosh washing machine B770',
        })
        .expect(200)
        .then(response => {
          const { id, machine_type_id, brand, model, description } = response.body;

          expect(id).toBe(2);
          expect(machine_type_id).toBe(2);
          expect(brand).toBe('Bosh');
          expect(model).toBe('B770');
          expect(description).toBe('Bosh washing machine B770');
        })
      );
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should delete a machine', () => server
        .delete('/api/v1/machine/8')
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).toBe(8);
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
      const validMachine: MachineReqBody = {
        machine_type_id: 1,
        brand: 'Taplet',
        model: 'T230',
        description: 'Taplet Washing Machine T230',
      };

      describe('Invalid Data', () => {
        test('should not create a machine when data having no properties', () => {
          const invalidMachine = {};

          return server
            .post('/api/v1/machine')
            .send(invalidMachine)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a machine when data having additional properties', () => {
          const invalidMachine = {
            ...validMachine,
            foo: 'baz',
          };

          return server
            .post('/api/v1/machine')
            .send(invalidMachine)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not create a machine when missing a required property', async () => {
          const requiredProps = ['machine_type_id', 'brand', 'model'];

          for (const toBeRemovedProp of requiredProps) {
            const invalidMachine: MachineReqBody = JSON.parse(JSON.stringify(validMachine));
            delete invalidMachine[toBeRemovedProp];

            await server
              .post('/api/v1/machine')
              .send(invalidMachine)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a machine when a machine type id does not exist', () => {
          const invalidMachine = {
            ...validMachine,
            machine_type_id: 99,
          };

          return server
            .post('/api/v1/machine')
            .send(invalidMachine)
            .expect(422, { message: 'Machine could not be created!' });
        });

        test('should not create a machine when a machine type id is invalid', async () => {
          const invalidValues = ['', 'abc'];

          for (const invalidValue of invalidValues) {
            const invalidMachine = {
              ...validMachine,
              machine_type_id: invalidValue,
            };

            await server
              .post('/api/v1/machine')
              .send(invalidMachine)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a machine when one of properties is invalid', async () => {
          const testingProps = ['brand', 'model', 'description'];

          for (const toBeInvalidProp of testingProps) {
            const invalidMachine = {
              ...validMachine,
              [toBeInvalidProp]: '',
            };

            await server
              .post('/api/v1/machine')
              .send(invalidMachine)
              .expect(400, { message: 'Invalid request body!' });
          }
        });
      });
    });

    // GET Request
    describe('GET Request', () => {
      test('should not get a machine when it does not exist', () => server
        .get('/api/v1/machine/999')
        .expect(422, { message: 'Machine with id 999 could not be found!' })
      );

      test('should not get a machine when an id is an empty string', () => server
        .get('/api/v1/machine/')
        .expect(404)
      );

      test('should not get a machine when an id is invalid', async () => {
        const invalidParams = ['abc', -1, 0];

        for (const invalidParam of invalidParams) {
          await server
            .get(`/api/v1/machine/${invalidParam}`)
            .expect(
              400,
              { message: `The param id [${invalidParam}] is not strictly positive integer!` }
            );
        }
      });
    });

    // PUT Request
    describe('PUT Request', () => {
      const validMachine: MachineReqBody = {
        machine_type_id: 1,
        brand: 'Electrolux',
        model: 'E578',
        description: 'Electrolux Washing Machine E578',
      };

      describe('Invalid Id', () => {
        test('should not update a machine when it does not exist', () => server
          .put('/api/v1/machine/999')
          .send(validMachine)
          .expect(422, { message: 'Machine with id 999 could not be updated!' })
        );

        test('should not update a machine when an id is invalid', async () => {
          const invalidParams = ['abc', -1, 0];

          for (const invalidParam of invalidParams) {
            await server
              .put(`/api/v1/machine/${invalidParam}`)
              .send(validMachine)
              .expect(
                400,
                { message: `The param id [${invalidParam}] is not strictly positive integer!` }
              );
          }
        });
      });

      describe('Invalid Data', () => {
        test('should not update a machine when data having no properties', () => {
          const invalidMachine = {};

          return server
            .put('/api/v1/machine/1')
            .send(invalidMachine)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a machine when data having additional properties', () => {
          const invalidMachine = {
            ...validMachine,
            foo: 'baz',
          };

          return server
            .put('/api/v1/machine/1')
            .send(invalidMachine)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not update a machine when a machine type id does not exist', () => {
          const invalidMachine = {
            ...validMachine,
            machine_type_id: 99,
          };

          return server
            .put('/api/v1/machine/1')
            .send(invalidMachine)
            .expect(422, { message: 'Machine with id 1 could not be updated!' });
        });

        test('should not update a machine when a machine type id is invalid', async () => {
          const invalidValues = ['', 'abc'];

          for (const invalidValue of invalidValues) {
            const invalidMachine = {
              ...validMachine,
              machine_type_id: invalidValue,
            };

            await server
              .put('/api/v1/machine/1')
              .send(invalidMachine)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not update a machine when one of properties is invalid', () => {
          const testingProps = ['brand', 'model'];

          for (const toBeInvalidProp of testingProps) {
            const invalidMachine = {
              ...validMachine,
              [toBeInvalidProp]: '',
            };

            return server
              .put('/api/v1/machine/1')
              .send(invalidMachine)
              .expect(400, { message: 'Invalid request body!' });
          }
        });
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should not deleted a machine when it does not exist', () => server
        .delete('/api/v1/machine/999')
        .expect(422, { message: 'Machine with id 999 could not be deleted!' })
      );

      test('should not deleted a machine when it is located at somewhere', () => server
        .delete('/api/v1/machine/1')
        .expect(422, { message: 'Machine with id 1 could not be deleted!' })
      );

      test('should not deleted a machine when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .delete(`/api/v1/machine/${invalidId}`)
            .expect(
              400,
              { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });
    });
  });
});
