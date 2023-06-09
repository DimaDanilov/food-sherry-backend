const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: "postgres",
    dialectModule: require("pg"),
    host: process.env.HOST,
    port: process.env.DB_PORT,
    ssl: true,
    define: { charset: "utf8", dialectOptions: { collate: "utf8_general_ci" } },
    dialectOptions: {
      charset: "utf8",
      collate: "utf8_general_ci",
      ssl: {
        require: true,
      },
    },
  }
);
