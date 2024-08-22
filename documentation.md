# Application Documentation

This document provides a step-by-step guide for setting up and running the Auth APIs service using Docker and PostgreSQL.

## Prerequisites

Ensure that you have Docker and Docker Compose installed on your machine. These tools are necessary for creating containerized environments for your applications.

## Step 1: Create a Docker Compose File

First, create a `docker-compose.yml` file in your project directory. This file will define two services:

1. **auth-api**: The service responsible for handling authentication.
2. **db**: The PostgreSQL database service.

The `docker-compose.yml` file should look as follows:

```yaml
# docker-compose.yml

services:
  auth-api:
    image: busycaesar/auth-api:latest
    env_file:
      - ./auth.env
    ports:
      - "7000:7000"
    depends_on:
      - db

  db:
    image: postgres:13
    env_file:
      - ./auth.env
    ports:
      - "5432:5432"
    volumes:
      - postgres_website-api:/var/lib/postgresql/data

volumes:
  postgres_website-api:
```

### Explanation:
- **auth-api**: This service uses the `busycaesar/auth-api:latest` image. The service also loads environment variables from the `auth.env` file and binds to port 7000.
- **db**: This service uses the `postgres:13` image. It uses the same `auth.env` file for environment variables and binds to port 5432. A Docker volume is created to persist PostgreSQL data.

## Step 2: Create an Environment Variables File

Next, create an `auth.env` file to store all the environment variables required for the services. This file should be located in the same directory as your `docker-compose.yml` file.

```bash
# auth.env

APP_PORT=7000
POSTGRES_USER=website_user
POSTGRES_HOST=db
POSTGRES_DB=website_db
POSTGRES_PASSWORD=website_passwd
POSTGRES_PORT=5432
JWT_KEY=564564sdffffsfsfcxvxvd
```

### Explanation:
- **APP_PORT**: The port number on which the `auth-api` service will run.
- **POSTGRES_USER**: The username for the PostgreSQL database.
- **POSTGRES_HOST**: The hostname for the PostgreSQL service. In this setup, it's named `db` because Docker Compose creates a network that allows services to communicate using their service names.
- **POSTGRES_DB**: The name of the database.
- **POSTGRES_PASSWORD**: The password for accessing the PostgreSQL database.
- **POSTGRES_PORT**: The port number on which the PostgreSQL service will run.
- **JWT_KEY**: A secure string used to sign JWT tokens for authentication.

### Important Note:
If you are using the same PostgreSQL image for storing your application data, ensure that the same credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.) are used in your application’s environment file. 

- For the application to access the PostgreSQL database, use `localhost` as the `POSTGRES_HOST` when running the application on the local machine. 
- The `auth-api` service, however, will use the name of the postgres service as the `POSTGRES_HOST` since Docker Compose creates a network that allows the services to communicate with each other by their service names.

## Step 3: Setting Up the API Endpoints

All the API endpoints provided by the `auth-api` service can be accessed from the following link:
[API Endpoints Documentation](./api.md).

## Step 4: Protecting Routes with JWT Middleware

For handling JWT tokens, including validation and protecting routes, please refer to the API Documentation where detailed instructions are provided.

## Conclusion

By following this guide, you can successfully set up the authentication service using Docker and protect your routes using JWT tokens. Make sure to customize the environment variables and adjust the settings according to your project’s needs.
