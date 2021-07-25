require('dotenv').config();

module.exports = {
  AUTHORIZATION: process.env.AUTHORIZATION,
  TOKEN: process.env.TOKEN,
  X_CUSTOM_HEADER: process.env['X-CUSTOM-HEADER'],

  HOST: process.env.HOST,
};
