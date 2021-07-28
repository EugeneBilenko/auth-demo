export const app = () => ({
  appPort: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
});
