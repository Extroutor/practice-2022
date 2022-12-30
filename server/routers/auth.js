"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.get("/user/:address", auth_1.getAddress);
router.put("/user/signature", auth_1.getSignature);
module.exports = router;
