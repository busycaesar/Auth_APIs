CREATE TABLE IF NOT EXISTS "auth-api_user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);