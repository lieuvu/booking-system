// Library
import suppertest from 'supertest';

// App
import { app } from '@src/app';

// Hook app to supertest
const server = suppertest(app);

// Interfaces
interface UserReqBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

/**
 * User API test
 */
describe('User API', () => {
  // --------------
  /** Happy Path */
  // --------------
  describe('Happy Path', () => {

    // POST Request
    describe('POST Request', () => {
      test('should create a user', () => server
        .post('/api/v1/user')
        .send({
          first_name: 'Linda',
          last_name: 'Dalton',
          email: 'linda.dalton@test.com',
          password: 'ld12%34#',
        })
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).not.toBeNull();
          expect(id).toBeGreaterThan(3); // Since two users were seeded in the database
        })
      );
    });

    // GET Request
    describe('GET Request', () => {
      test('should get a user', () => server
        .get('/api/v1/user/1')
        .expect(200)
        .then(response => {
          const { id, first_name, last_name, email } = response.body;

          expect(id).toEqual(1);
          expect(first_name).toEqual('John');
          expect(last_name).toEqual('Doe');
          expect(email).toEqual('john.doe@test.com');
        })
      );
    });

    // PUT Request
    describe('PUT Request', () => {
      test('should update a user with full data', () => server
        .put('/api/v1/user/2')
        .send({
          first_name: 'Lassi',
          last_name: 'Veikkonen',
          email: 'lassi.veikkonen@test.com',
          password: 'ls#45891',
        })
        .expect(200)
        .then(response => {
          const { id, first_name, last_name, email } = response.body;

          expect(id).toBe(2);
          expect(first_name).toBe('Lassi');
          expect(last_name).toBe('Veikkonen');
          expect(email).toBe('lassi.veikkonen@test.com');
        })
      );

      test('should update a user with partial data', () => server
        .put('/api/v1/user/2')
        .send({
          email: 'lassi.veikkonen@test1.com',
        })
        .expect(200)
        .then(response => {
          const { id, email } = response.body;

          expect(id).toBe(2);
          expect(email).toBe('lassi.veikkonen@test1.com');
        })
      );
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should delete a user and its related data', () => server
        .delete('/api/v1/user/5')
        .expect(200)
        .then(response => {
          const { id } = response.body;

          expect(id).toBe(5);
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
      const validUser: UserReqBody = {
        first_name: 'Minko',
        last_name: 'Peterson',
        email: 'minko.peterson@test.com',
        password: 'mk56!ab',
      };

      describe('Invalid Data', () => {
        test('should not create a user when data having no properties', () => {
          const invalidUser = {};

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a user when data having additional properties', () => {
          const invalidUser = {
            ...validUser,
            foo: 'baz',
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not create a user when missing a required property', async () => {
          const testTimes = 10;
          const requiredProps = ['first_name', 'last_name', 'email', 'password'];
          const randomRemovedProps = requiredProps[Math.floor(Math.random() * requiredProps.length)];
          const invalidUser: UserReqBody = JSON.parse(JSON.stringify(validUser));
          delete invalidUser[randomRemovedProps];

          for (let i = 0; i < testTimes; i++) {
            await server
              .post('/api/v1/user')
              .send(invalidUser)
              .expect(400, { message: 'Invalid request body!' });
          }
        });

        test('should not create a user when an email is malformed', () => {
          const invalidUser = {
            ...validUser,
            email: '123@@gmail.com',
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a user when a first name is malformed', () => {
          const invalidUser = {
            ...validUser,
            first_name: 'a',
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a user when a last name is malformed', () => {
          const invalidUser = {
            ...validUser,
            last_name: 'b',
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not create a user when a password is malformed', () => {
          const invalidUser = {
            ...validUser,
            password: '?d',
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('User Existed', () => {
        test('should not create a user when email is in lowercase', () => {
          const email = 'john.doe@test.com';
          const invalidUser = {
            ...validUser,
            email,
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(422, { message: `User with email ${email} could not be created!` });
        });

        test('should not create a user when email is in mixed-case', () => {
          const email = 'joHn.dOe@teSt.cOm';
          const invalidUser = {
            ...validUser,
            email,
          };

          return server
            .post('/api/v1/user')
            .send(invalidUser)
            .expect(422, { message: `User with email ${email} could not be created!` });
        });
      });

    });

    // GET Request
    describe('GET Request', () => {
      test('should not get a user when he does not exist', () => server
        .get('/api/v1/user/999')
        .expect(422, { message: 'User with id 999 could not be found!' })
      );

      test('should not get a user when an id is an empty string', () => server
        .get('/api/v1/user/')
        .expect(404)
      );

      test('should not get a user when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .get(`/api/v1/user/${invalidId}`)
            .expect(
              400,
              { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });
    });

    // PUT Request
    describe('PUT Request', () => {
      const validUser: UserReqBody = {
        first_name: 'Taha',
        last_name: 'Gandi',
        email: 'taha.gandi@test.com',
        password: 'tg@56321',
      };

      describe('Invalid Id', () => {
        test('should not update a user when he does not exist', () => server
          .put('/api/v1/user/999')
          .send(validUser)
          .expect(422, { message: 'User with id 999 could not be updated!' })
        );

        test('should not update a user when an id is invalid', async () => {
          const invalidIds = ['abc', -1, 0];

          for (const invalidId of invalidIds) {
            await server
              .put(`/api/v1/user/${invalidId}`)
              .send(validUser)
              .expect(
                400,
                { message: `The param id [${invalidId}] is not strictly positive integer!` }
              );
          }
        });

      });

      describe('Invalid Data', () => {
        test('should not update a user when data having no properties', () => {
          const invalidUser = {};

          return server
            .put('/api/v1/user/1')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a user when data having additional properties', () => {
          const invalidUser = {
            ...validUser,
            foo: 'baz',
          };

          return server
            .put('/api/v1/user/1')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });
      });

      describe('Invalid Properties', () => {
        test('should not update a user when a first name is malformed', () => {
          const invalidUser = {
            ...validUser,
            first_name: 'a',
          };

          return server
            .put('/api/v1/user/1')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a user when a last name is malformed', () => {
          const invalidUser = {
            ...validUser,
            last_name: 'b',
          };

          return server
            .put('/api/v1/user/1')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });

        test('should not update a user when a password is malformed', () => {
          const invalidUser = {
            ...validUser,
            password: '#45',
          };

          return server
            .put('/api/v1/user/1')
            .send(invalidUser)
            .expect(400, { message: 'Invalid request body!' });
        });
      });
    });

    // DELETE Request
    describe('DELETE Request', () => {
      test('should not deleted a user when an id is invalid', async () => {
        const invalidIds = ['abc', -1, 0];

        for (const invalidId of invalidIds) {
          await server
            .delete(`/api/v1/user/${invalidId}`)
            .expect(
              400,
              { message: `The param id [${invalidId}] is not strictly positive integer!` }
            );
        }
      });

      test('should not deleted a user when he does not exist', () => server
        .delete('/api/v1/user/999')
        .expect(422, { message: 'User with id 999 could not be deleted!' })
      );
    });
  });
});
