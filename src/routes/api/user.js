const router = require("../router");
const response = require("../response");
const {
  updateUser,
  deleteUser,
  getUserPassword,
  updateUserPassword,
} = require("../../db");
const { checkPassword, hashPassword } = require("./password");

router.patch("/:id", async (req, res) => {
  // Get the user data.
  const { username } = req.body;
  // Get the user id.
  const { id } = req.params;

  // Make sure the username is passed.
  if (!username)
    return res
      .status(400)
      .json(
        response(
          false,
          `Insufficient information received. Please check the requirements of this api.`
        )
      );

  console.log("Request to update an existing user's username.");

  try {
    const result = await updateUser(id, username);
    res.status(200).json(response(true, result));
  } catch (error) {
    res.status(500).json(response(false, error.message));
  }
});

router.patch("/password/:id", async (req, res) => {
  // Get the user data.
  const { oldPassword, newPassword } = req.body;
  // Get the user id.
  const { id } = req.params;

  if (!id || !oldPassword || !newPassword)
    return res
      .status(400)
      .json(
        response(
          false,
          `Insufficient information received. Please check the requirements of this api.`
        )
      );

  console.log("Request to update an existing user's password.");

  try {
    // Make sure the old password is valid.
    const storedPassword = await getUserPassword(id);
    const isSamePassword = await checkPassword(oldPassword, storedPassword);

    if (!isSamePassword)
      return res
        .status(403)
        .json(response(false, `The old password passed is incorrect.`));

    // Hash the new password.
    const hashedPassword = await hashPassword(newPassword);

    const result = await updateUserPassword(id, hashedPassword);
    res.status(200).json(response(true, result));
  } catch (error) {
    res.status(500).json(response(false, error.message));
  }
});

router.delete("/:id", async (req, res) => {
  // Get the user id.
  const { id } = req.params;

  if (!id)
    return res
      .status(400)
      .json(
        response(
          false,
          `Insufficient information received. Please check the requirements of this api.`
        )
      );

  console.log("Request to delete the user");

  try {
    const result = await deleteUser(id);
    res.status(200).json(response(true, result));
  } catch (error) {
    res.status(500).json(response(false, error.message));
  }
});

module.exports = router;
