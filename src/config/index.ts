// Environment
const env = process.env;

// Export
export const config = {
  NODE_PATH: env.NODE_PATH,
  PORT: env.PORT || 3000,
  DATABASE: {
    PG_HOST: env.POSTGRES_HOST,
    PG_USER: env.POSTGRES_USER,
    PG_PASS: env.POSTGRES_PASSWORD,
    PG_DB: env.POSTGRES_DB
  },
  LOG: {
    LEVEL: env.LOG_LEVEL || 'info',
    COLOURIZED: env.LOG_COLORS ? env.LOG_COLORS : false
  }
}
