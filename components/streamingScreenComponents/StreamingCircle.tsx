import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Alert } from "react-bootstrap";
import { CircularProgressbar } from "react-circular-progressbar";

import StreamingCircleControls from "./StreamingCircleControls";

import "react-circular-progressbar/dist/styles.css";

import { convertDateTime } from "../../helper/timeFunctions";

type props = {
  start: Date;
  end: Date;
  amount: number;
  receiving: boolean;
  address_from: string;
  address_to: string;
  withdrawn: number;
  id: number;
  isCanceled: boolean;
  cancelDate: Date;
  isMax: boolean;
  currency: string;
  newCancel?: boolean;
  cancelable: boolean;
  cancelable2: { sender: boolean; receiver: boolean };
  blockTime: Date;
  tx: string;
};

const dateDiff = (time: number) => {
  var delta = time / 1000;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = Math.floor(delta % 60);

  return {
    days,
    hours: hours.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    minutes: minutes.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    seconds: seconds.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
  };
};

const StreamingCircle = ({
  start,
  end,
  amount,
  receiving,
  address_from,
  address_to,
  withdrawn,
  id,
  isCanceled,
  cancelDate,
  isMax,
  currency,
  newCancel,
  cancelable,
  cancelable2,
  blockTime,
  tx,
}: props) => {
  const [time, setTime] = useState(new Date(Date.now()));

  useEffect(() => {
    if (!isCanceled && !isMax && new Date(Date.now()) < end) {
      const interval = setInterval(() => setTime(new Date(Date.now())), 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isCanceled, isMax, end]);
  let progress: number | bigint | string = 0;
  if (!isCanceled && new Date(Date.now()) < end) {
    //@ts-ignore
    progress = 100 - ((end - time) / (end - start)) * 100;
    progress = progress > 100 ? 100 : progress.toFixed(2);
    progress = progress < 0 ? 0 : progress;
  } else if (isCanceled) {
    //@ts-ignore
    // progress = Number((((cancel - start) / (end - start)) * 100).toFixed(2));
    if (cancelDate.getFullYear > 1980 && cancel < start) {
      progress = 0;
    } else {
      progress = withdrawn * 100;
    }
  } else {
    progress = 100;
  }

  const now = new Date(Date.now());

  const timeRemained =
    start?.getTime() > now?.getTime()
      ? start?.getTime() - now?.getTime()
      : end?.getTime() - now?.getTime() < 0
      ? 0
      : end?.getTime() - now?.getTime();
  const timeDiff = dateDiff(timeRemained);

  const { fee } = useSelector((state: any) => state.balance);

  return (
    <div className="bg-transparent">
      <Row className="my-3">
        {newCancel && (
          <Alert className="px-4" variant="danger">
            The Stream Has Been Canceled
          </Alert>
        )}
      </Row>
      <Row className="mt-2">
        <div className="text-center text-money">
          <strong className="text-white">
            {Number(progress) * (amount - fee * amount) * 0.01}
          </strong>{" "}
          {currency || "DAI"}
          <br />
          from {`${amount * (1 - fee)} ${currency || "DAI"}`}
          {blockTime && Number(blockTime) > Date.now() && (
            <>
              <br />
              {`Canceling is blocked until ${convertDateTime(blockTime)}`}
              <br />
              {`or until ${
                (amount * (1 - fee) * (Number(blockTime) - Number(start))) /
                (Number(end) - Number(start))
              } is transfered`}
            </>
          )}
          {progress !== 100 && !isCanceled ? (
            <>
              <br />
              {`${
                cancelable2.sender && cancelable2.receiver
                  ? "Both sender and receiver are "
                  : cancelable2.sender && !cancelable2.receiver
                  ? "Only the sender is "
                  : !cancelable2.sender && cancelable2.receiver
                  ? "Only the receiver is "
                  : "Neither the sender nor the receiver are "
              } able to cancel the stream ${
                blockTime.getFullYear() > 1980
                  ? "(when block time is passed)"
                  : ""
              }`}
            </>
          ) : null}
        </div>
      </Row>
      <Row>
        <div className="circular-progress">
          <div className="circular-progress-container">
            <div
              className={receiving ? "circle-receiving" : "circle-streaming"}
            >
              <CircularProgressbar value={Number(progress)} strokeWidth={3} />
            </div>
            <div className="circle-withdrawn">
              <CircularProgressbar value={withdrawn * 100} strokeWidth={3} />
            </div>
            <div className="circle-info">
              <div className="text-center time-circle-info">
                <p id="day-info" className="p-0 m-0">
                  {start > now && "Stream starts in:"}
                  {timeDiff.days > 0 ? (
                    <span>
                      {timeDiff.days} Days{" "}
                      <span style={{ fontSize: "1.2rem" }}>{"&"}</span>
                    </span>
                  ) : (
                    <br />
                  )}
                </p>
                <p
                  id="time-info"
                  className="p-0 m-0"
                >{`${timeDiff.hours}:${timeDiff.minutes}:${timeDiff.seconds}`}</p>
                <p id="desc-info" className="p-0 m-0">
                  {isCanceled
                    ? "Canceled"
                    : progress === 100
                    ? "Finished"
                    : start > now
                    ? ""
                    : "time remained"}
                </p>
              </div>
            </div>
            <div className="circle-line">
              <hr />
            </div>
            <div className="circle-money">
              <p id="streamed">
                <span>
                  <strong>Streamed</strong>
                </span>{" "}
                {progress > 0 && progress < 100
                  ? Number(progress).toFixed(1)
                  : progress}
                %
              </p>
              <p id="withdrawn">
                <span>
                  <strong>Withdrawn</strong>
                </span>{" "}
                {withdrawn > 0 && withdrawn < 1
                  ? (100 * withdrawn).toFixed(1)
                  : withdrawn * 100}
                %
              </p>
            </div>
          </div>
        </div>
      </Row>
      <StreamingCircleControls
        start={start}
        end={end}
        amount={amount}
        receiving={receiving}
        address_from={address_from}
        address_to={address_to}
        withdrawn={withdrawn}
        id={id}
        isCanceled={isCanceled}
        cancelDate={cancelDate}
        isMax={isMax}
        currency={currency}
        progress={Number(progress)}
        dateDiff={timeDiff}
        cancelable={cancelable}
        tx={tx}
        blockDate={blockTime}
      />
    </div>
  );
};

export default StreamingCircle;
