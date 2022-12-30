if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const http = require("http");

const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
app
  .prepare()
  .then(() => {
    const streamsRouter = require("./routers/streams");
    const userRouter = require("./routers/users");
    const authRouter = require("./routers/auth");

    const appServer = express();
    appServer.use(express.json());
    appServer.use(express.urlencoded({ extended: true }));
    // appServer.use(cors());
    appServer.use((err, req, res, next) => {
      res.status(err.status).json({ message: err.message });
    });

    appServer.use("/api", streamsRouter);
    appServer.use("/api", userRouter);
    appServer.use("/api/auth", authRouter);

    appServer.all("*", (req, res) => {
      return handle(req, res);
    });

    const server = http.createServer(appServer);

    const socketio = require("socket.io");
    const io = socketio(server, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
      const streamsModel = require("./models/streams").default;
      socket.on("newStream", (address) => {
        streamsModel
          .findAll({
            where: { address_to: address },
            limit: 1,
            order: [["createdAt", "desc"]],
          })
          .then((stream) => {
            io.emit(`newReceive:${address}`, stream[0]);
          })
          .catch((err) => {});
      });

      socket.on("withdraw", (data) => {
        streamsModel
          .findAll({ where: { id: data.id, address_from: data.address } })
          .then((streams) => {
            if (streams[0]) {
              io.emit(`newWithdrawal:${data.address}`, {
                id: data.id,
                withdrawn: streams[0].withdrawn,
              });
            }
          })
          .catch((err) => {});
      });

      socket.on("canceled", (data) => {
        streamsModel
          .findAll({ where: { id: data }, limit: 1 })
          .then((streams) => {
            io.emit(`newCanceled:${streams[0].address_to}`, {
              id: streams[0].id,
              cancelDate: streams[0].cancel_date,
              withdrawn: streams[0].withdrawn,
            });
            io.emit(`newCanceled:${streams[0].address_from}`, {
              id: streams[0].id,
              cancelDate: streams[0].cancel_date,
              withdrawn: streams[0].withdrawn,
            });
          })
          .catch((err) => {});
      });
    });

    //@ts-ignore
    server.listen(process.env.PORT || 3000, (err) => {
      if (err) throw err;
      console.log(`> listening on ${process.env.PORT || 3000}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
