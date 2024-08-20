const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_KEY) process.exit(1);

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: `${process.env.JWT_KEY}`,
};

let strategy = new Strategy(jwtOptions, (jwt_payload, next) => {
  if (jwt_payload) {
    next(null, {
      id: jwt_payload._id,
      username: jwt_payload._username,
    });
  } else next(null, false);
});

passport.use(strategy);

// This function generates JWT token using id and username.
const generateJWTToken = (id, username) => {
  const payLoad = {
    _id: id,
    _username: username,
  };

  return jwt.sign(payLoad, jwtOptions.secretOrKey);
};

const jwtDecoder = (jwtToken) => {
  return jwt.decode(jwtToken);
};

module.exports = {
  jwtOptions,
  passport,
  generateJWTToken,
  jwtDecoder,
};
