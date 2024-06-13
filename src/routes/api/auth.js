const express = require("express");
const router = express.Router();
const resMessage = require("../responseFormat");
const {
  addNewUser,
  isUniqueUser,
  getUserPassword,
  getUserId,
} = require("../../db");
const { hashPassword, checkPassword } = require("./password");

router.post("/register-user", async (req, res) => {
  // Get the user data.
  const { username, password } = req.body;

  console.log("Request to register a new user.");

  // Make sure the username and password are present.
  if (!username || !password)
    return res
      .status(400)
      .json(
        resMessage(
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

    res
      .status(200)
      .json(
        resMessage(
          true,
          `${_username} is registered. Make sure to store this id for future requests.`,
          _id
        )
      );
  } catch (error) {
    res.status(500).json(resMessage(false, error.message));
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
        resMessage(
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
        .json(resMessage(false, `The password for ${username} is incorrect.`));

    // Get the user id.
    const userId = await getUserId(username);

    res.status(200).json(resMessage(true, `${username} is validated.`, userId));
  } catch (error) {
    res.status(500).json(resMessage(false, error.message));
  }
});

module.exports = router;
