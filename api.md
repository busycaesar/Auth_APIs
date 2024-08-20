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

**Description**: Register a new user. Successful response contains the status code 201.

**Request Body**:
```js
{
  "username": "string",
  "password": "string"
}
```

**Response Body**:
```js
{
  "userId": "string",
  "jwt": "string"
}
```

### `POST /api/auth/validate-user`

**Description**: Validate an existing user. Successful response contains the status code 200.

**Request Body**:
```js
{
  "username": "string",
  "password": "string"
}
```

**Response Body**:
```js
{
  "userId": "string",
  "jwt": "string"
}
```

### `POST /api/auth/validate-jwt`

**Description**: Validate the jwt token of an existing user.

**Request Headers**:
```js
{
  "Authorization": "jwt <jwt token>"
}
```

**Response Body**:
```js
{
  "id": number,
  "username": string
}
```

## User Information

### `PATCH /api/user/:id`

**Description**: Update existing user's username. Successful response contains the status code 200.

**Request Body**:
```js
{
  "username": "string"
}
```

### `PATCH /api/user/password/:id`

**Description**: Update existing user's passwqord. Successful response contains the status code 200.

**Request Body**:
```js
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### `DELETE /api/user/:id`

**Description**: Delete existing user. Successful response contains the status code 200.
