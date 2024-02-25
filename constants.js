require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: process.env.GMAIL_ACCOUNT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "mary@numerade.com",
  to: "mary@numerade.com",
  subject: "Gmail API NodeJS",
};
module.exports = {
  auth,
  mailoptions,
};
