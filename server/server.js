// "use strict";
// var __importDefault =
//   (this && this.__importDefault) ||
//   function (mod) {
//     return mod && mod.__esModule ? mod : { default: mod };
//   };
// Object.defineProperty(exports, "__esModule", { value: true });
// require("dotenv").config();
// const express_1 = __importDefault(require("express"));
// const http_1 = __importDefault(require("http"));
// const cors_1 = __importDefault(require("cors"));
// const streams_1 = __importDefault(require("./models/streams"));
// // create the server
// const app = (0, express_1.default)();
// app.use(express_1.default.json());
// app.use(express_1.default.urlencoded({ extended: true }));
// app.use((0, cors_1.default)());
// const server = http_1.default.createServer(app);
// // routers importing and using in api
// const streamsRouter = require("./routers/streams");
// const userRouter = require("./routers/users");
// const authRouter = require("./routers/auth");
// app.use("/api", streamsRouter);
// app.use("/api", userRouter);
// app.use("/api/auth", authRouter);
// // error route
// app.use((err, req, res, next) => {
//   res.status(err.status).json({ message: err.message });
// });
// // applying sockets.io server side
// const socketio = require("socket.io");
// // const io = socketio(server, { cors: { origin: "*" } });
// const io = socketio(server, { cors: { origin: "*" } });
// io.on("connection", (socket) => {
//   socket.on("newStream", (address) => {
//     streams_1.default
//       .findAll({
//         where: { address_to: address },
//         limit: 1,
//         order: [["createdAt", "desc"]],
//       })
//       .then((stream) => {
//         io.emit(`newReceive:${address}`, stream[0]);
//       })
//       .catch((err) => {});
//   });
//   socket.on("withdraw", (data) => {
//     streams_1.default
//       .findAll({ where: { id: data.id, address_from: data.address } })
//       .then((streams) => {
//         if (streams[0]) {
//           io.emit(`newWithdrawal:${data.address}`, {
//             id: data.id,
//             withdrawn: Number(streams[0].withdrawn),
//           });
//         }
//       })
//       .catch((err) => {});
//   });
//   socket.on("canceled", (data) => {
//     streams_1.default
//       .findAll({ where: { id: data }, limit: 1 })
//       .then((streams) => {
//         io.emit(`newCanceled:${streams[0].address_to}`, {
//           id: streams[0].id,
//           cancelDate: streams[0].cancel_date,
//         });
//       })
//       .catch((err) => {});
//   });
// });
// // deploying the server
// server.listen(process.env.PORT || 5000, () => {
//   console.log("listening on port 5000");
//   // db.sync({ force: true, alter: true });
// });
