const request = require("supertest");
const app = require("../../src/app");
const { pool, cleanTable } = require("../../src/db");

let userId;
// Sample user's information.
const sampleUser = {
  username: "busycaesar",
  password: "1234",
};

// End the pool once the test is completed.
afterAll(() => {
  pool.end();
});

// Clean all the users and create a sample user before starting any test.
beforeAll(async () => {
  try {
    await cleanTable();
    const result = await request(app)
      .post("/api/auth/register-user")
      .send(sampleUser);
    userId = result.body.body;
  } catch (error) {
    console.log(error);
  }
});

describe("PATCH /api/user/:id", () => {
  test("Cannot update the user if insufficient information is provided.", async () => {
    // Pass insufficient information.
    const response = await request(app).patch(`/api/user/${userId}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("Cannot update the user if the user id is invalid.", async () => {
    // Pass invalid userid.
    const response = await request(app)
      .patch(`/api/user/${userId + "invalid"}`)
      .send({ username: "change" });
    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
  });

  test("Update the user", async () => {
    const updatedUsername = "nodejs";
    // Update the user information.
    const updateUser = await request(app).patch(`/api/user/${userId}`).send({
      username: updatedUsername,
    });
    expect(updateUser.statusCode).toBe(200);
    expect(updateUser.body.ok).toBe(true);

    const checkUpdatedUsername = await request(app)
      .post(`/api/auth/validate-user`)
      .send({
        username: updatedUsername,
        password: sampleUser.password,
      });
    expect(checkUpdatedUsername.statusCode).toBe(200);
    expect(checkUpdatedUsername.body.ok).toBe(true);
  });
});

describe("PATCH /api/user/password/:id", () => {
  test("Cannot update the password if insufficient information is provided.", async () => {
    // Pass insufficient information.
    const response = await request(app).patch(`/api/user/password/${userId}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("Cannot update the password if invalid id is passed.", async () => {
    // Pass invalid id.
    const response = await request(app)
      .patch(`/api/user/password/${userId + "invalid"}`)
      .send({
        oldPassword: sampleUser.password,
        newPassword: "temp",
      });
    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
  });

  test("Cannot update the password if the old password passed is invalid.", async () => {
    // Pass invalid old password.
    const response = await request(app)
      .patch(`/api/user/password/${userId}`)
      .send({
        oldPassword: sampleUser.password + "invalid",
        newPassword: "temp",
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.ok).toBe(false);
  });

  test("Update the password if the old password is valid.", async () => {
    // Update the password.
    const newPassword = "This is my new password";
    const updatePassword = await request(app)
      .patch(`/api/user/password/${userId}`)
      .send({
        oldPassword: sampleUser.password,
        newPassword: newPassword,
      });
    expect(updatePassword.statusCode).toBe(200);
    expect(updatePassword.body.ok).toBe(true);
  });
});

describe("DELETE /api/user/:id", () => {
  test("Cannot delete the user if the id is invalid.", async () => {
    // Pass invalid user id.
    const response = await request(app).delete(
      `/api/user/${userId + "invalid"}`
    );
    expect(response.statusCode).toBe(500);
    expect(response.body.ok).toBe(false);
  });

  test("Delete the user if the id is valid.", async () => {
    // Delete the user.
    const deleteUser = await request(app).delete(`/api/user/${userId}`);
    expect(deleteUser.statusCode).toBe(200);
    expect(deleteUser.body.ok).toBe(true);

    // Make sure that the user is deleted.
    const result = await request(app).post(`/api/auth/validate-user`).send({
      username: sampleUser.username,
      password: sampleUser.password,
    });
    expect(result.statusCode).toBe(500);
    expect(result.body.ok).toBe(false);
  });
});
