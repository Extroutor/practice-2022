"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const sequelize_1 = __importDefault(require("sequelize"));
const streams_1 = __importDefault(require("./streams"));
const withdrawnModel = index_1.default.define("withdrawn", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: sequelize_1.default.DOUBLE,
}, { timestamps: true });
streams_1.default.hasMany(withdrawnModel);
exports.default = withdrawnModel;
