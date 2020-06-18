// Library
import suppertest from 'supertest';

// App
import type { UserAddressRes } from '@models/UserAddress';
import { app } from '@src/app';

// Hook app to supertest
const server = suppertest(app);

// Interfaces
interface UserReqBody {
  user_id?: number;
  building_id: number;
  building_block_number?: string;
  apartment_number: string;
}

/**
 * Building Address API test
 */
describe('User Address API', () => {
  // --------------
  /** Happy Path */
  // --------------
  describe('Happy Path', () => {

    // POST Request
    describe('POST Request', () => {
      test('should create a user address', () => server
        .post('/api/v1/user-address')
        .send({
          user_id: 2,
          building_id: 2,
          apartment_number: '8',
        })
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).not.toBeNull();
          expect(id).toBeGreaterThan(3); // Since 3 user address was seeded in the database
        })
      );
    });

    // GET Request
    describe('GET Request', () => {
      test('should get a user address', () => server
        .get('/api/v1/user-address/2')
        .expect(200)
        .then(response => {
          const { id, user, address }: UserAddressRes = response.body;

          expect(id).toEqual(2);
          expect(user.id).toEqual(4);
          expect(user.first_name).toEqual('Taha');
          expect(user.last_name).toEqual('Kachwala');
          expect(user.email).toEqual('taha.kachwala@test.com');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.apartment_number).toEqual('12');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );

      test('should get a user address by a query param user id', () => server
        .get('/api/v1/user-address?user_id=4')
        .expect(200)
        .then(response => {
          const { id, user, address }: UserAddressRes = response.body;

          expect(id).toEqual(2);
          expect(user.id).toEqual(4);
          expect(user.first_name).toEqual('Taha');
          expect(user.last_name).toEqual('Kachwala');
          expect(user.email).toEqual('taha.kachwala@test.com');
          expect(address.id).toEqual(1);
          expect(address.street).toEqual('Siltakuja');
          expect(address.number).toEqual('2');
          expect(address.building_block_number).toEqual('A');
          expect(address.apartment_number).toEqual('12');
          expect(address.postal_code).toEqual('02330');
          expect(address.city).toEqual('Espoo');
        })
      );
    });

    // PUT Request
    describe('PUT Request', () => {
      test('should update a user address with full data', () => server
        .put('/api/v1/user-address?user_id=4')
        .send({
          building_id: 3,
          apartment_number: '7',
        })
        .expect(200)
        .then(response => {
          const { id, user, address }: UserAddressRes = response.body;

          expect(id).toEqual(2);
          expect(user.id).toEqual(4);
          expect(user.first_name).toEqual('Taha');
          expect(user.last_name).toEqual('Kachwala');
          expect(user.email).toEqual('taha.kachwala@test.com');
          expect(address.id).toEqual(3);
          expect(address.street).toEqual('Juusintie');
          expect(address.number).toEqual('5');
          expect(address.building_block_number).toEqual('D');
          expect(address.apartment_number).toEqual('7');
          expect(address.postal_code).toEqual('02700');
          expect(address.city).toEqual('Kauniainen');
        })
      );

      test('should update a user address with partial data', () => server
        .put('/api/v1/user-address?user_id=4')
        .send({
          apartment_number: '24',
        })
        .expect(200)
        .then(response => {
          const { id, user, address }: UserAddressRes = response.body;

          expect(id).toEqual(2);
          expect(user.id).toEqual(4);
          expect(user.first_name).toEqual('Taha');
          expect(user.last_name).toEqual('Kachwala');
          expect(user.email).toEqual('taha.kachwala@test.com');
          expect(address.id).toEqual(3);
          expect(address.street).toEqual('Juusintie');
          expect(address.number).toEqual('5');
          expect(address.building_block_number).toEqual('D');
          expect(address.apartment_number).toEqual('24');
          expect(address.postal_code).toEqual('02700');
          expect(address.city).toEqual('Kauniainen');
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
      const validUserAddress: UserReqBody = {
        user_id: 4,
        building_id: 3,
        apartment_number: '25',
      };

      describe('Invalid Data', () => {
        test('should not create a user address when data having no properties', () => {
          const invalidUserAddress = {};

          return server
            .post('/api/v1/user-address?user_id=4')
            .send(invalidUserAddress)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a user address when data having additional properties', () => {
          const invalidUserAddress = {
            ...validUserAddress,
            foo: 'baz',
          };

          return server
            .post('/api/v1/user-address?user_id=4')
            .send(invalidUserAddress)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not create a user address when missing a required property', async () => {
          const requiredProps = ['user_id', 'building_id', 'apartment_number'];

          for (const toBeRemovedProp of requiredProps) {
            const invalidBuildingAddress: UserReqBody = JSON.parse(JSON.stringify(validUserAddress));
            delete invalidBuildingAddress[toBeRemovedProp];

            await server
              .post('/api/v1/user-address')
              .send(invalidBuildingAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a user address when a user id is invalid', async () => {
          const invalidValues = ['', 'abc', -1, 0];

          for (const invalidValue of invalidValues) {
            const invalidUserAddress = {
              ...validUserAddress,
              user_id: invalidValue,
            };

            await server
              .post('/api/v1/user-address')
              .send(invalidUserAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a user address when a building id is invalid', async () => {
          const invalidValues = ['', 'abc', -1, 0];

          for (const invalidValue of invalidValues) {
            const invalidUserAddress = {
              ...validUserAddress,
              building_id: invalidValue,
            };

            await server
              .post('/api/v1/user-address')
              .send(invalidUserAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a building address when an apartment number is malform', () => {
          const invalidUserAddress = {
            ...validUserAddress,
            apartment_number: '',
          };

          return server
            .post('/api/v1/user-address')
            .send(invalidUserAddress)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('User Address Existed', () => {
        test('Should not create a user address if existed', () => {
          const invalidUserAddress: UserReqBody = {
            user_id: 1,
            building_id: 1,
            apartment_number: '8',
          };

          return server
            .post('/api/v1/user-address')
            .send(invalidUserAddress)
            .expect(422, { message: 'User address (user_id 1, building_id 1) could not be created!' });
        });
      });
    });

    // GET Request
    describe('GET Request', () => {
      describe('By User Address Id', () => {
        test('should not get a user address when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .get(`/api/v1/user-address/${invalidId}`)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });
      });

      describe('By Query Param', () => {
        test('should not get a user address when a query param user id is missing', () => server
          .get('/api/v1/user-address')
          .expect(400, { message: 'Invalid request query params!' })
        );

        test('should not get a user address when having invalid query param', async () => {
          const invalidQueryParams = ['user_id=', 'user_id=abc', 'user_id=-1', 'user_id=0'];

          for (const invalidQueryParam of invalidQueryParams) {
            await server
              .get(`/api/v1/user-address?${invalidQueryParam}`)
              .expect(400, { message: 'Invalid request query params!' });
          }
        });

        test('should not get a user address when a user does not exist', () => server
          .get('/api/v1/user-address?user_id=999')
          .expect(422, { message: 'User address with user_id 999 could not be found!' })
        );
      });
    });

    // PUT Request
    describe('PUT Request', () => {
      const validUserAddress: UserReqBody = {
        building_id: 3,
        apartment_number: '25',
      };

      describe('Invalid Query Param', () => {
        test('should not update a user address when a query param user id is missing', () => server
          .put('/api/v1/user-address/')
          .send(validUserAddress)
          .expect(400, { message: 'Invalid request query params!' })
        );

        test('should not update a user address when having invalid query param', async () => {
          const invalidQueryParams = ['user_id=', 'user_id=abc', 'user_id=-1', 'user_id=0'];

          for (const invalidQueryParam of invalidQueryParams) {
            await server
              .put(`/api/v1/user-address?${invalidQueryParam}`)
              .send(validUserAddress)
              .expect(400, { message: 'Invalid request query params!' });
          }
        });

        test('should not update a user address when a query param user id does not exist', () => server
          .put('/api/v1/user-address?user_id=999')
          .send(validUserAddress)
          .expect(422, { message: 'User address with user_id 999 could not be updated!' })
        );
      });

      describe('Invalid Data', () => {
        test('should not update a user address when data having no properties', () => {
          const invalidUserAddress = {};

          return server
            .put('/api/v1/user-address?user_id=4')
            .send(invalidUserAddress)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a user address when data having additional properties', () => {
          const invalidUserAddress = {
            ...validUserAddress,
            foo: 'baz',
          };

          return server
            .put('/api/v1/user-address?user_id=4')
            .send(invalidUserAddress)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not update a user address when a building id does not exist', () => {
          const invalidUserAddress = {
            ...validUserAddress,
            building_id: 99,
          };

          return server
            .put('/api/v1/user-address?user_id=4')
            .send(invalidUserAddress)
            .expect(422, { message: 'User address with user_id 4 could not be updated!' });
        });

        test('should not update a user address when a building id is invalid', async () => {
          const invalidValues = ['', '-1', '0', -1, 0];

          for (const invalidValue of invalidValues) {
            const invalidUserAddress = {
              ...validUserAddress,
              building_id: invalidValue,
            };

            await server
              .put('/api/v1/user-address?user_id=4')
              .send(invalidUserAddress)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not update a user address when an apartment number is empty string', () => {
          const invalidUserAddress = {
            ...validUserAddress,
            apartment_number: '',
          };

          return server
            .put('/api/v1/user-address?user_id=4')
            .send(invalidUserAddress)
            .expect(400, { message: 'Invalid request body!' });
        });
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should not find route for delete request of a user address', () => server
        .delete('/api/v1/user-address/1')
        .expect(404)
      );
    });
  });
});
