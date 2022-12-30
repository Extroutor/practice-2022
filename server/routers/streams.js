"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stream_1 = require("../controllers/stream");
const jwtAuth_1 = require("../middleware/jwtAuth");
const router = (0, express_1.Router)();
router.post("/new_stream", jwtAuth_1.addressAuth, stream_1.postNewStream);
router.get("/streaming/:address", jwtAuth_1.addressAuth, stream_1.getStreaming);
router.get("/receiving/:address", jwtAuth_1.addressAuth, stream_1.getReceiving);
router.post("/withdrawl", jwtAuth_1.addressAuth, stream_1.withdrawl);
router.get("/withdrawl/:id", jwtAuth_1.addressAuth, stream_1.getWithdrawns);
router.put("/cancel_stream", jwtAuth_1.addressAuth, stream_1.cancelStream);
module.exports = router;
