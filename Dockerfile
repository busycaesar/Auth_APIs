# Stage 1: Install all the dependencies.
FROM node:20.10.0 AS dependencies

WORKDIR /backend

COPY package* ./

RUN npm install

# Stage 2: Copy the src directory.
FROM node:20.10.0 AS development

WORKDIR /backend

COPY --from=dependencies /backend /backend

COPY ./src ./src

# Stage 3: Start the backend server.
FROM node:20.10.0

WORKDIR /backend

COPY --from=development /backend /backend

CMD [ "node", "src/server.js" ]

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
 CMD curl --fail localhost:${PORT} || exit 1