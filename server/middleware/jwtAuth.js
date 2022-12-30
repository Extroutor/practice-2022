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
exports.addressAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addressAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    const jwtToken = auth && auth.split("bearer ")[1];
    if (!jwtToken) {
        res.status(401).json({ message: "no token send" });
    }
    else {
        const token = jsonwebtoken_1.default.verify(String(jwtToken), String(process.env.JSON_WEB_TOKEN_SECERT), (err, user) => {
            if (err) {
                return res.status(403).json({ message: "unauthorized" });
            }
            else {
                if (user.address) {
                    req.body.token = String(user.address);
                    next();
                }
                else {
                    return res.status(403).json({ message: "unauthorized" });
                }
            }
        });
    }
});
exports.addressAuth = addressAuth;
