"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
//@ts-ignore
const db = new sequelize_1.default({
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_SERVER,
  port: Number(process.env.DATABASE_PORT),
  dialect: "postgres",
  protocol: 'postgres',
  dialectOptions: {},
  // dialectOptions: {
  //   ssl: true,
  //   native:true
  // },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});
db.authenticate()
  .then()
  .catch((err) => {console.log(1);console.log(err)});
exports.default = db;
