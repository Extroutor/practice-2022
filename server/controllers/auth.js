"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignature = exports.getAddress = void 0;
const user_1 = __importDefault(require("../models/user"));
const ethers_1 = require("ethers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.params;
    const user = yield user_1.default.findAll({ where: { address }, limit: 1 });
    if (user[0]) {
        return res.json({ nonce: user[0].nonce });
    }
    else {
        const newUser = yield user_1.default.create({ address });
        return res.json({ nonce: newUser.nonce });
    }
});
exports.getAddress = getAddress;
const getSignature = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, signature } = req.body;
    const user = yield user_1.default.findAll({ where: { address }, limit: 1 });
    if (user[0]) {
        const nonce = user[0].nonce;
        const addressSigned = ethers_1.ethers.utils.verifyMessage(`signing message with one time nonce: ${nonce}`, signature);
        if (addressSigned === address) {
            const tokenAddress = jsonwebtoken_1.default.sign({ address }, String(process.env.JSON_WEB_TOKEN_SECERT));
            user[0].nonce = Math.floor(Math.random() * 100000000);
            user[0].save();
            return res.status(200).json({ token: tokenAddress });
        }
        else {
            return res.status(401).json({ message: "unauthorized" });
        }
    }
    else {
        return res.status(401).json({ message: "unauthorized" });
    }
});
exports.getSignature = getSignature;
