module.exports = {
  development: {
    username: process.env.DB_USER || "bloodconnect",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "bloodconnect",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres"
  }
};
