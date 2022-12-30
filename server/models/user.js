"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const sequelize_1 = __importDefault(require("sequelize"));
const sequelize_2 = __importDefault(require("sequelize"));
const userModel = index_1.default.define("users", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    address: { type: sequelize_1.default.STRING, unique: true },
    identifier: { type: sequelize_1.default.STRING, unique: true },
    nonce: { type: sequelize_2.default.NUMBER, defaultValue: () => Math.floor(Math.random() * 100000000) },
}, { timestamps: true });
exports.default = userModel;
