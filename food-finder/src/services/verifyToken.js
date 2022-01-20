const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);
const verify = async token => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
};

module.exports = { verify };
