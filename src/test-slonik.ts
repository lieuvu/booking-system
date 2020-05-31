import { sql, createPool, DatabaseConnectionType } from 'slonik';

interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
}

// posgresql uri syntax 'postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST/POSTGRES_DB
const pool = createPool('postgresql://lieu:lieu4test@localhost/lieutest')

const createTable = async () => await pool.connect(async (connection) => {
  try {
    const test = await connection.query(
      sql`
        CREATE TABLE IF NOT EXISTS "user"
        (
          id          SERIAL PRIMARY KEY,
          username    VARCHAR (50) NOT NULL,
          password    VARCHAR (50) NOT NULL,
          email       VARCHAR (355) UNIQUE NOT NULL,
          created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    );
    console.log(test);
  } catch (error) {
    console.log("Error in creating table: ", error);
  }
});

const seedData = async () => await pool.connect(async (connection) => {
  try {
    const test = await connection.query(
      sql`
        INSERT INTO "user" (username, password, email)
        VALUES
        ('test1', 'pass1', 'test1@abc.com'),
        ('test2', 'pass2', 'test2@abc.com');
      `
    );
    console.log(test);
  } catch (error) {
    console.log("Error in seeding data: ", error);
  }
})

const queryData = async (): Promise<User[]> => await pool.connect(async (connection: DatabaseConnectionType) => {
  try {
    const result: User[] = await connection.many(sql`SELECT id, username, email FROM "user";`);
    return result;
  } catch (error) {
    console.log("Error in querying result: ", error);
  }
});

const main = async () => {
  await createTable();
  await seedData();
  //const users = await queryData();
  //console.log(users[0].id, users[0].username, users[0].password);
}

main();
