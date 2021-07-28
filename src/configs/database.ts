export const database = () => ({
  dbHost: process.env.DATABASE_HOST,
  dbPort: +process.env.DATABASE_PORT,
  dbUser: process.env.DATABASE_USER,
  dbPass: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
});
