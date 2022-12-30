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
exports.cancelStream =
  exports.getWithdrawns =
  exports.withdrawl =
  exports.postNewStream =
  exports.getReceiving =
  exports.getStreaming =
    void 0;
const streams_1 = __importDefault(require("../models/streams"));
const withdrawn_1 = __importDefault(require("../models/withdrawn"));
const index_1 = __importDefault(require("../models/index"));
const throwError = (status, message, next) => {
  const err = new Error(message);
  //@ts-ignore
  err.status = status;
  next(err);
};
const getStreaming = (req, res, next) => {
  const address = req.params.address;
  if (address !== req.body.token) {
    return res.status(403).json({ message: "unauthorized" });
  } else {
    index_1.default
      .query(
        `SELECT streams.*, users.identifier as nickname FROM streams LEFT JOIN users ON streams.address_to= users.address WHERE address_from = '${address}' AND (withdrawn < 1 OR end_date > NOW()::DATE -  14) ORDER BY start_date DESC;`
      )
      .then((results) => {
        res.json({ data: results[0] });
      })
      .catch((err) => {
        console.log(err);
        throwError(500, "database connection error", next);
      });
  }
};
exports.getStreaming = getStreaming;
const getReceiving = (req, res, next) => {
  const address = req.params.address;
  if (address !== req.body.token) {
    return res.status(403).json({ message: "unauthorized" });
  } else {
    index_1.default
      .query(
        `SELECT streams.*, users.identifier as nickname FROM streams LEFT JOIN users ON streams.address_from= users.address WHERE address_to = '${address}' AND (withdrawn < 1 OR  end_date > NOW()::DATE -  14) ORDER BY start_date DESC;`
      )
      .then((results) => {
        res.json({ data: results[0] });
      })
      .catch((err) => throwError(500, "database connection error", next));
  }
};
exports.getReceiving = getReceiving;
const postNewStream = (req, res, next) => {
  const {
    id,
    start,
    end,
    address_from,
    address_to,
    amount,
    currency,
    block,
    sender_cancel,
    receiver_cancel,
    tx,
  } = req.body;
  if (address_from !== req.body.token) {
    return res.status(403).json({ message: "unauthorized" });
  } else {
    const start_date = new Date(Number(start));
    const end_date = new Date(Number(end));
    const block_date = new Date(Number(block));
    streams_1.default
      .create({
        id,
        start_date,
        end_date,
        address_from,
        address_to,
        amount,
        currency,
        block_date,
        sender_cancel,
        receiver_cancel,
        tx,
      })
      .then(() => {
        return res.status(201).json({ message: "done" });
      })
      .catch((err) => {
        console.log(err);
        return throwError(500, "unable to write to database", next);
      });
  }
};
exports.postNewStream = postNewStream;
const withdrawl = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id, address_from, address_to, amount } = req.body;
    if (address_to !== req.body.token) {
      return res.status(403).json({ message: "unauthorized" });
    } else {
      if (Number(amount) <= 0) return throwError(400, "invalid amount", next);
      try {
        const data = yield streams_1.default.findAll({
          where: { id: id, address_from, address_to },
          limit: 1,
        });
        if (!data[0]) {
          return throwError(400, "invalid input", next);
        } else {
          const stream = data[0];
          const withdrawn = Number(stream.withdrawn);
          const withdrawnRequested = Number(amount) / Number(stream.amount);
          const withdrawnOverallAvailble = stream.is_canceled
            ? (Date.now() - stream.start_date) / (stream.end_date - stream.start_date)
            : 1;
          const withdrawnCancelation = stream.is_canceled
            ? (Date.now() - stream.start_date) / (stream.end_date - stream.start_date)
            : 1;
          if (
            withdrawnRequested + withdrawn > 1 ||
            withdrawnRequested + withdrawn > withdrawnOverallAvailble ||
            withdrawnRequested + withdrawn > withdrawnCancelation
          ) {
            return throwError(400, "bad request", next);
          } else {
            //@ts-ignore
            yield index_1.default.transaction((t) =>
              __awaiter(void 0, void 0, void 0, function* () {
                stream.withdrawn = Number(stream.withdrawn) + Number(withdrawnRequested);
                //@ts-ignore
                const updatedData = yield stream.save({ transaction: t });
                //@ts-ignore
                yield withdrawn_1.default.create(
                  {
                    stream_id: id,
                    amount: Number(withdrawnRequested),
                    streamId: stream.id,
                  },
                  { transaction: t }
                );
              })
            );
            return res.status(200).json({ message: "done" });
          }
        }
      } catch (err) {
        return throwError(500, "invalid amount", next);
      }
    }
  });
exports.withdrawl = withdrawl;
const getWithdrawns = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { from, to } = req.query;
    if (from === req.body.token || to === req.body.token) {
      if (!id && !from && !to) {
        throwError(400, "bad request", next);
      } else {
        const data = yield streams_1.default.findAll({
          where: { id: Number(id), address_from: from, address_to: to },
          limit: 1,
        });
        if (!data[0]) {
          throwError(404, "not found", next);
        } else {
          const results = yield withdrawn_1.default.findAll({
            where: { streamId: id },
            order: [["createdAt", "asc"]],
          });
          res.status(200).json(results);
        }
      }
    } else {
      return res.status(403).json({ message: "unauthorized" });
    }
  });
exports.getWithdrawns = getWithdrawns;
const cancelStream = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id, address_from, address_to, cancelationValue } = req.body;
    if (address_from === req.body.token || address_to === req.body.token) {
      try {
        const stream = yield streams_1.default.findAll({
          where: { id, address_from, address_to },
          limit: 1,
        });
        if (stream[0].is_canceled) {
          throwError(400, "canceled already", next);
        } else {
          stream[0].is_canceled = true;
          stream[0].cancel_date = Date.now();
          stream[0].withdrawn = cancelationValue;
          yield stream[0].save();
          res.status(201).json({ message: "updated " });
        }
        next();
      } catch (err) {
        throwError(500, "server error", next);
      }
    } else {
      return res.status(403).json({ message: "unauthorized" });
    }
  });
exports.cancelStream = cancelStream;
