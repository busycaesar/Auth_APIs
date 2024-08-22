# API Documentation

This document provides an overview of the API endpoints provided by the Auth APIs service. Each endpoint includes a description, request format, and expected response format.

## Index

1. Authentication
   - [Register User](#post-apiauthregister-user) - Register a new user.
   - [Validate User](#post-apiauthvalidate-user) - Validate an existing user.
   - [Validate JWT](#post-apiauthvalidate-jwt) - Validate the JWT token of a user.

2. User Information
   - [Update Username](#patch-apiuserid) - Update an existing user's username.
   - [Update Password](#patch-apiuserpasswordid) - Update an existing user's password.
   - [Delete User](#delete-apiuserid) - Delete an existing user.

3. [Protecting Routes with JWT Middleware](#protecting-routes-with-jwt-middleware) - How to secure routes with JWT validation.

## Response Structure

All responses will include the following structure:

```json
{
  "ok": boolean, // Indicates if the response was successful (true) or a failure (false).
  "message": string, // Describes the status of the request.
  "body": object // Contains any data requested or required by the response.
}
```

## Authentication

### `POST /api/auth/register-user`

**Description**: Registers a new user in the system. On success, the response will have a status code of 201.

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Body**:
```json
{
  "userId": number,
  "jwt": "string"
}
```

### `POST /api/auth/validate-user`

**Description**: Validates an existing user's credentials. On success, the response will have a status code of 200.

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Body**:
```json
{
  "userId": number,
  "jwt": "string"
}
```

### `POST /api/auth/validate-jwt`

**Description**: Validates the JWT token of an existing user to ensure its authenticity.

**Request Headers**:
```json
{
  "Authorization": "jwt <jwt token>"
}
```

**Response Body**:
```json
{
  "id": number,
  "username": "string"
}
```

## User Information

### `PATCH /api/user/:id`

**Description**: Updates the username of an existing user. On success, the response will have a status code of 200.

**Request Body**:
```json
{
  "username": "string"
}
```

### `PATCH /api/user/password/:id`

**Description**: Updates the password of an existing user. On success, the response will have a status code of 200.

**Request Body**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### `DELETE /api/user/:id`

**Description**: Deletes an existing user from the system. On success, the response will have a status code of 200.

## Protecting Routes with JWT Middleware

To protect certain routes in your application, you can use a middleware function that validates the JWT token provided in the request headers. Here’s how you can create and use this middleware:

```javascript
// middleware.js

const middleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json("Token not provided.");
    }

    const response = await fetch(
      `${process.env.AUTH_API}/api/auth/validate-jwt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const { ok, message, body } = await response.json();

    if (!ok) {
      return res.status(401).json("Invalid JWT Token.");
    }

    req.user = body.user;
    next();
  } catch (error) {
    res.status(500).json("Failed to validate JWT");
  }
};

module.exports = { middleware };
```

### Explanation:
- The middleware checks if a JWT token is provided in the request headers.
- It sends a request to the `auth-api` service to validate the token.
- If the token is valid, the user information is added to the request object and the request proceeds.
- If the token is invalid or not provided, an error response is returned.

### Using the Middleware in Routes

To protect specific routes, simply use the middleware in your route definitions:

```javascript
const { middleware } = require("./middleware");

router.use("/apikeys", middleware, require("./apiKey"));
```

This example shows how to protect the `/apikeys` route, requiring a valid JWT token for access.
