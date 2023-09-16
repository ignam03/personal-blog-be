/* eslint-disable prettier/prettier */
export default () => ({
  app: {
    port: parseInt(process.env.PORT) || 3000,
    urlResetPassword: process.env.URL_RESET_PASSWORD,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  jwt: {},
});
