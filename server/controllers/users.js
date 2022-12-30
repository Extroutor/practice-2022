"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.putUser = exports.getIdentifier = exports.getAddress = void 0;
const user_1 = __importDefault(require("../models/user"));
const getAddress = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params.identifier;
    try {
      const user = yield user_1.default.findAll({
        where: { identifier },
        limit: 1,
      });
      if (user[0]) {
        res.json({ address: user[0].address });
      } else {
        res.json({ message: "user not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "database error" });
    }
  });
exports.getAddress = getAddress;
const getIdentifier = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    try {
      const user = yield user_1.default.findAll({
        where: { address },
        limit: 1,
      });
      if (user[0]) {
        res.json({ id: user[0].identifier });
      } else {
        res.json({ message: "user not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "database error" });
    }
  });
exports.getIdentifier = getIdentifier;
const putUser = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { address, identifier, token } = req.body;
    if (address !== token) {
      return res.status(403).json({ message: "unauthorized" });
    } else {
      const parsedIdentifier = String(identifier).split(" ").join("");
      try {
        const user = yield user_1.default.findAll({ where: { address }, limit: 1 });
        if (user[0]) {
          user[0].identifier = parsedIdentifier;
          yield user[0].save();
          res.status(200).json({ message: "user updated" });
        } else {
          res.status(400).json({ message: "user not found" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
      }
    }
  });
exports.putUser = putUser;
