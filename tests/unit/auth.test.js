const request = require("supertest");
const app = require("../../src/app");
const { pool, cleanTable } = require("../../src/db");

// End the pool once the test is completed.
afterAll(() => {
  pool.end();
});

describe("POST /api/auth/register-user", () => {
  // Clean all the users before starting any test.
  beforeAll(async () => {
    try {
      await cleanTable();
    } catch (error) {
      console.log(error);
    }
  });

  test("Cannot register with insufficient information", async () => {
    // Pass insufficient information in the body of the request.
    const response = await request(app).post("/api/auth/register-user").send({
      username: "Dev",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("Register the user with all the information", async () => {
    const username = "busycaesar";
    const password = "1234";
    const storeUser = await request(app).post("/api/auth/register-user").send({
      username: username,
      password: password,
    });
    expect(storeUser.statusCode).toBe(200);
    expect(storeUser.body.ok).toBe(true);
    const checkStoreUser = await request(app)
      .post(`/api/auth/validate-user`)
      .send({
        username: username,
        password: password,
      });
    expect(checkStoreUser.statusCode).toBe(200);
    expect(checkStoreUser.body.ok).toBe(true);
  });

  test("Cannot register with existing username", async () => {
    const username = "busycaesar";
    // Store a new user.
    await request(app).post("/api/auth/register-user").send({
      username: username,
      password: "1234",
    });
    // Try storing a new user with already used username.
    const sameUsername = await request(app)
      .post("/api/auth/register-user")
      .send({
        username: username,
        password: "1234",
      });
    expect(sameUsername.statusCode).toBe(500);
    expect(sameUsername.body.ok).toBe(false);
  });
});

describe("POST /api/auth/validate-user", () => {
  const username = "busycaesar",
    password = "1234";
  // Clean all the users and create a sample user before starting any test.
  beforeAll(async () => {
    try {
      await cleanTable();
      await request(app).post("/api/auth/register-user").send({
        username: username,
        password: password,
      });
    } catch (error) {
      console.log(error);
    }
  });

  test("cannot validate with insufficient information", async () => {
    // Pass insufficient information in the body of the request.
    const response = await request(app).post("/api/auth/validate-user").send({
      username: username,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  test("cannot validate with invalid username and/password", async () => {
    const invalidUsername = await request(app)
      .post("/api/auth/validate-user")
      .send({
        username: username + "invalid",
        password: password,
      });
    expect(invalidUsername.statusCode).toBe(500);
    expect(invalidUsername.body.ok).toBe(false);

    const invalidPassword = await request(app)
      .post("/api/auth/validate-user")
      .send({
        username: username,
        password: password + "invalid",
      });
    expect(invalidPassword.statusCode).toBe(403);
    expect(invalidPassword.body.ok).toBe(false);

    const invalidCredentials = await request(app)
      .post("/api/auth/validate-user")
      .send({
        username: username + "invalid",
        password: password + "invalid",
      });
    expect(invalidCredentials.statusCode).toBe(500);
    expect(invalidCredentials.body.ok).toBe(false);
  });

  test("validate with valid username andpassword", async () => {
    const result = await request(app).post(`/api/auth/validate-user`).send({
      username: username,
      password: password,
    });
    expect(result.statusCode).toBe(200);
    expect(result.body.ok).toBe(true);
  });
});
