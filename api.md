# API Documentation

All responses will have the following object with these properties.

```js
{
  ok: Booleab Value, // Indicates if the response was success or failure.
  message: Request Status, // Explains the status of the request.
  body: Required/Requested Data // Contains any data of requested/required.
}
```

## Authentication

### `POST /api/auth/register-user`

Description: Register a new user. Successful response contains the status code 201.

Request Body: username and password

Response Body: Unique id for the registered user.

### `POST /api/auth/validate-user`

Description: Validate an existing user. Successful response contains the status code 200.

Request Body: username and password

## User Information

### `PATCH /api/user/:id`

Description: Update existing user's username. Successful response contains the status code 200.

Request Body: username

### `PATCH /api/user/password/:id`

Description: Update existing user's passwqord. Successful response contains the status code 200.

Request Body: oldPassword and newPassword

### `DELETE /api/user/:id`

Description: Delete existing user. Successful response contains the status code 200.
