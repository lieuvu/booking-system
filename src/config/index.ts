// Environment
const env = process.env;

// Export
export const config = {
  DATABASE: {
    PG_HOST: env.POSTGRES_HOST,
    PG_USER: env.POSTGRES_USER,
    PG_PASS: env.POSTGRES_PASSWORD,
    PG_DB: env.POSTGRES_DB
  },
  LOG: {
    LOG_ENABLED: env.LOG_ENABLED ? env.LOG_ENABLED : true,
    LEVEL: env.LOG_LEVEL || 'info',
    COLOURIZED: env.LOG_COLORS ? env.LOG_COLORS : false
  },
  MORGAN_LOG_REQUEST_ENABLED: env.MORGAN_LOG_REQUEST_ENABLED ? env.MORGAN_LOG_REQUEST_ENABLED : true,
  NODE_ENV: env.NODE_ENV,
  NODE_PATH: env.NODE_PATH,
  PORT: env.PORT || 3000,
  QUOTA_LIMIT: env.QUOTA_LIMIT ? Number.parseInt(env.QUOTA_LIMIT) : 2,
};
