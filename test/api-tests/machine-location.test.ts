// Library
import suppertest from 'supertest';

// App
import { app } from '@src/app';
import { MachineLocationStatus } from '@models/MachineLocation';

// Hook app to supertest
const server = suppertest(app);

// Interfaces
interface MachineLocationReqBody {
  machine_id?: number,
  building_id?: number,
  number?: number | null,
  status?: MachineLocationStatus | null,
}

/**
 * Building Address API test
 */
describe('Machine Location Address API', () => {
  // --------------
  /** Happy Path */
  // --------------
  describe('Happy Path', () => {

    // POST Request
    describe('POST Request', () => {
      test('should create a machine location', () => server
        .post('/api/v1/machine-location')
        .send({
          machine_id: 5,
          building_id: 3,
          number: 1,
          status: 'active',
        })
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).not.toBeNull();
          expect(id).toBeGreaterThan(4); // Since 4 machine locations were seeded in the database
        })
      );
    });

    // GET Request
    describe('GET Request', () => {
      test('should get a machine location by id', () => server
        .get('/api/v1/machine-location/1')
        .expect(200)
        .then(response => {
          const { id, machine, address } = response.body;

          expect(id).toEqual(1);
          expect(machine.id).toEqual(1);
          expect(machine.type).toEqual('Washing Machine');
          expect(machine.brand).toEqual('Taplet');
          expect(machine.model).toEqual('T130');
          expect(machine.description).toEqual('Taplet washing machine T130');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );

      test('should get a machine location by query param machine id', () => server
        .get('/api/v1/machine-location?machine_id=1')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);

          const { id, machine, address } = response.body[0];

          expect(id).toEqual(1);
          expect(machine.id).toEqual(1);
          expect(machine.type).toEqual('Washing Machine');
          expect(machine.brand).toEqual('Taplet');
          expect(machine.model).toEqual('T130');
          expect(machine.description).toEqual('Taplet washing machine T130');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );

      test('should get a machine location by query param building id', () => server
        .get('/api/v1/machine-location?building_id=1')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(3);

          const { id, machine, address } = response.body[0];

          expect(id).toEqual(1);
          expect(machine.id).toEqual(1);
          expect(machine.type).toEqual('Washing Machine');
          expect(machine.brand).toEqual('Taplet');
          expect(machine.model).toEqual('T130');
          expect(machine.description).toEqual('Taplet washing machine T130');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );

      test('should get a machine location by both query params machine id and building id', () => server
        .get('/api/v1/machine-location?machine_id=1&building_id=1')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);

          const { id, machine, address } = response.body[0];

          expect(id).toEqual(1);
          expect(machine.id).toEqual(1);
          expect(machine.type).toEqual('Washing Machine');
          expect(machine.brand).toEqual('Taplet');
          expect(machine.model).toEqual('T130');
          expect(machine.description).toEqual('Taplet washing machine T130');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );

      test('should get a machine location by both all query params', () => server
        .get('/api/v1/machine-location?machine_id=3&building_id=1&status=broken')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(1);

          const { id, machine, address } = response.body[0];

          expect(id).toEqual(3);
          expect(machine.id).toEqual(3);
          expect(machine.type).toEqual('Dryer');
          expect(machine.brand).toEqual('Taplet');
          expect(machine.model).toEqual('T320');
          expect(machine.description).toEqual('Taplet drying machine T320');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );
    });

    // PUT Request
    describe('PUT Request', () => {
      test('should update a machine location with full data', () => server
        .put('/api/v1/machine-location/2')
        .send({
          machine_id: 5,
          building_id: 1,
          number: 2,
          status: 'active',
        })
        .expect(200)
        .then(response => {
          const { id, machine_id, building_id, number, status } = response.body;

          expect(id).toEqual(2);
          expect(machine_id).toEqual(5);
          expect(building_id).toEqual(1);
          expect(number).toEqual(2);
          expect(status).toEqual('active');
        })
      );

      test('should update a building address with partial data', async () => {
        const validMachineLocation = {
          machine_id: 2,
          building_id: 3,
          number: 3,
          status: 'active',
        };

        for (const [key, value] of Object.entries(validMachineLocation)) {
          const data = { [key]: value };

          await server
            .put('/api/v1/machine-location/2')
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
        .delete('/api/v1/machine-location/4')
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
      const validMachineLocation: MachineLocationReqBody = {
        machine_id: 3,
        building_id: 2,
        number: 4,
        status: MachineLocationStatus.Active,
      };

      describe('Invalid Data', () => {
        test('should not create a machine location when data having no properties', () => {
          const invalidMachineLocation = {};

          return server
            .post('/api/v1/machine-location')
            .send(invalidMachineLocation)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a machine location when data having additional properties', () => {
          const invalidMachineLocation = {
            ...validMachineLocation,
            foo: 'baz',
          };

          return server
            .post('/api/v1/machine-location')
            .send(invalidMachineLocation)
            .expect(400, { message: 'Invalid request body!' });
        });
      });


      describe('Invalid Properties', () => {
        test('should not create a machine location when missing a required property', async () => {
          const requiredProps = ['machine_id', 'building_id'];

          for (const toBeRemovedProp of requiredProps) {
            const invalidMachineLocation: MachineLocationReqBody = JSON.parse(JSON.stringify(validMachineLocation));
            delete invalidMachineLocation[toBeRemovedProp];

            await server
              .post('/api/v1/machine-location')
              .send(invalidMachineLocation)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a machine location when one of id is invalid', async () => {
          const requiredProps = ['machine_id', 'building_id'];
          const invalidValues = ['', 'abc', -1, 0];

          for (const toBeInvalidProp of requiredProps) {
            for (const invalidValue of invalidValues) {
              const invalidMachineLocation = {
                ...validMachineLocation,
                [toBeInvalidProp]: invalidValue,
              };

              await server
                .post('/api/v1/machine-location')
                .send(invalidMachineLocation)
                .expect(400, { message: 'Invalid request body!' });
            }
          }
        });
      });

      describe('Machine Location Existed', () => {
        test('Should not create a machine location for a machine that is already located somewhere', () => {
          const invalidMachineLocation: MachineLocationReqBody = {
            machine_id: 1,
            building_id: 1,
          };

          return server
            .post('/api/v1/machine-location')
            .send(invalidMachineLocation)
            .expect(422, { message: 'Machine location of machine 1 at building 1 could not be created!' });
        });

        test('Should not create a machine location if a machine is assigned with invalid number in the building', () => {
          const invalidBuildingAddress = {
            machine_id: 5,
            building_id: 1,
            number: 1,
          };

          return server
            .post('/api/v1/machine-location')
            .send(invalidBuildingAddress)
            .expect(422, { message: 'Machine location of machine 5 at building 1 could not be created!' });
        });
      });
    });

    // GET Request
    describe('GET Request', () => {
      describe('By Machine Location Id', () => {
        test('should not get a machine location when id does not exist', () => server
          .get('/api/v1/machine-location/999')
          .expect(422, { message: 'Machine location with id 999 could not be found!' })
        );

        test('should not get a machine location when an id is an empty string', () => server
          .get('/api/v1/machine-location/')
          .expect(400)
        );

        test('should not get a machine location when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .get(`/api/v1/machine-location/${invalidId}`)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });
      });

      describe('By Query Param', () => {
        test('should not get a machine location when there is no query params', () => server
          .get('/api/v1/machine-location')
          .expect(400, { message: 'Invalid request query params!' })
        );

        test('should not get a machine location when having invalid machine_id query param',
          async () => {
            const queryParams = ['machine_id=', 'machine_id=abc', 'machine_id=-5', 'machine_id=0'];

            for (const invalidQueryParam of queryParams) {
              await server
                .get(`/api/v1/machine-location?${invalidQueryParam}&building_id=1`)
                .expect(400, { message: 'Invalid request query params!' });
            }
          }
        );

        test('should not get a machine location when having invalid building_id query param',
          async () => {
            const queryParams = [
              'building_id=', 'building_id=abc', 'building_id=-5', 'building_id=0'
            ];

            for (const invalidQueryParam of queryParams) {
              await server
                .get(`/api/v1/machine-location?${invalidQueryParam}&machine_id=1`)
                .expect(400, { message: 'Invalid request query params!' });
            }
          }
        );

        test('should not get a machine location when having non-existing id query param',
          async () => {
            const queryParams = ['machine_id', 'building_id'];

            for (const invalidQueryParam of queryParams) {
              await server
                .get(`/api/v1/machine-location?${invalidQueryParam}=999`)
                .expect(422);
            }
          }
        );
      });
    });

    // PUT Request
    describe('PUT Request', () => {
      const validMachineLocation: MachineLocationReqBody = {
        machine_id: 5,
        building_id: 1,
        number: 5,
        status: MachineLocationStatus.Active,
      };

      describe('Invalid Id', () => {
        test('should not update a machine location when it does not exist', () => server
          .put('/api/v1/machine-location/999')
          .send(validMachineLocation)
          .expect(422, { message: 'Machine location with id 999 could not be updated!' })
        );

        test('should not update a machine location when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .put(`/api/v1/machine-location/${invalidId}`)
              .send(validMachineLocation)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });
      });

      describe('Invalid Data', () => {
        test('should not update a machine location when data having no properties', () => {
          const invalidMachineLocation = {};

          return server
            .put('/api/v1/machine-location/1')
            .send(invalidMachineLocation)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a machine location when data having additional properties', () => {
          const invalidMachineLocation = {
            ...validMachineLocation,
            foo: 'baz',
          };

          return server
            .put('/api/v1/machine-location/1')
            .send(invalidMachineLocation)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not update a machine location when one of ids is invalid', async () => {
          const requiredProps = ['machine_id', 'building_id'];
          const invalidValues = ['', 'abc', -1, 0];

          for (const toBeInvalidProp of requiredProps) {
            for (const invalidValue of invalidValues) {
              const invalidMachineLocation = {
                ...validMachineLocation,
                [toBeInvalidProp]: invalidValue,
              };

              await server
                .put('/api/v1/machine-location/1')
                .send(invalidMachineLocation)
                .expect(400, { message: 'Invalid request body!' });
            }
          }
        });

        test('should not update a machine location when one of id is not found', async () => {
          const requiredProps = ['machine_id', 'building_id'];

          for (const toBeInvalidProp of requiredProps) {
            const invalidMachineLocation = {
              ...validMachineLocation,
              [toBeInvalidProp]: 999,
            };

            await server
              .put('/api/v1/machine-location/1')
              .send(invalidMachineLocation)
              .expect(422, { message: 'Machine location with id 1 could not be updated!' });
          }
        });
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should not deleted a machine location when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .delete(`/api/v1/machine-location/${invalidId}`)
            .expect(
              400, { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });

      test('should not deleted a machine location when it does not exist', () => server
        .delete('/api/v1/machine-location/999')
        .expect(422, { message: 'Machine location with id 999 could not be deleted!' })
      );
    });
  });
});
