export default {
  origin: process.env.FRONT_END_BASE_URL,
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  redisCacheExpiresIn: 60,
  emailFrom: process.env.EMAIL_FROM,
};
