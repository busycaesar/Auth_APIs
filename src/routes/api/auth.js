const router = require("../router");
const response = require("../response");
const {
  addNewUser,
  isUniqueUser,
  getUserPassword,
  getUserId,
} = require("../../db");
const { hashPassword, checkPassword } = require("./password");
const { generateJWTToken, passport } = require("../../jwt");

router.post("/register-user", async (req, res) => {
  // Get the user data.
  const { username, password } = req.body;

  console.log("Request to register a new user.");

  // Make sure the username and password are present.
  if (!username || !password)
    return res
      .status(400)
      .json(
        response(
          false,
          `Insufficient information received. Please check the requirements of this api.`
        )
      );

  try {
    // Make sure the username is unique.
    await isUniqueUser(username);

    // Hash the password.
    const hashedPassword = await hashPassword(password);

    // Add new user.
    const { _id, _username } = await addNewUser(username, hashedPassword);

    // Get JWT token for the user.
    const jwtToken = generateJWTToken(_id, _username);

    res
      .status(201)
      .json(
        response(
          true,
          `${_username} is registered. Make sure to store this id for future requests.`,
          { userId: _id, jwt: jwtToken }
        )
      );
  } catch (error) {
    res.status(500).json(response(false, error.message));
  }
});

router.post("/validate-user", async (req, res) => {
  // Get the user data.
  const { username, password } = req.body;

  console.log("Request to validate the user");

  // Make sure the username and password are included.
  if (!username || !password)
    return res
      .status(400)
      .json(
        response(
          false,
          `Insufficient information received. Please check the requirements of this api.`
        )
      );

  try {
    // Get the stored password.
    const storedPassword = await getUserPassword(username);

    // Try to match the stored password with the received password.
    const isSamePassword = await checkPassword(password, storedPassword);

    if (!isSamePassword)
      return res
        .status(403)
        .json(response(false, `The password for ${username} is incorrect.`));

    // Get the user id.
    const userId = await getUserId(username);

    // Get JWT token for the user.
    const jwtToken = generateJWTToken(userId, username);

    res.status(200).json(
      response(true, `${username} is validated.`, {
        userId: userId,
        jwt: jwtToken,
      })
    );
  } catch (error) {
    res.status(500).json(response(false, error.message));
  }
});

router.post("/validate-jwt", async (req, res) => {
  console.log("Request to validate the jwt.");

  try {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err)
        return res.status(500).json(response(false, "Internal server error"));

      if (!user)
        return res.status(401).json(response(false, "Invalid JWT Token"));

      res.json(response(true, "Valid JWT Token", { user: user }));
    })(req, res);
  } catch (error) {
    res.status(500).json(response(false, error.message));
  }
});

module.exports = router;
