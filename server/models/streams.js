"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const sequelize_1 = __importDefault(require("sequelize"));
const streamsModel = index_1.default.define("streams", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    address_from: sequelize_1.default.STRING,
    address_to: sequelize_1.default.STRING,
    start_date: sequelize_1.default.DATE,
    end_date: sequelize_1.default.DATE,
    block_date: sequelize_1.default.DATE,
    amount: sequelize_1.default.DOUBLE,
    tx: sequelize_1.default.STRING,
    currency: { type: sequelize_1.default.STRING, defaultValue: "DAI" },
    withdrawn: { type: sequelize_1.default.DOUBLE, defaultValue: 0 },
    is_canceled: { type: sequelize_1.default.BOOLEAN, defaultValue: false },
    cancel_date: { type: sequelize_1.default.DATE, defaultValue: null },
    sender_cancel: { type: sequelize_1.default.BOOLEAN, defaultValue: true },
    receiver_cancel: { type: sequelize_1.default.BOOLEAN, defaultValue: true },
}, { timestamps: true });
exports.default = streamsModel;
