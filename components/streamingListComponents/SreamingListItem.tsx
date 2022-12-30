import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Link from "next/link";

import StreamingProgress from "./SreamingListProgress";

import RepeatModal from "./SendMoneyFormModal";

import { convertDate, convertTime } from "../../helper/timeFunctions";

import {
  NEW_STREAM_COLOR,
  CANCEL_STREAM_COLOR,
  WITHDRAW_STREAM_COLOR,
} from "../../store/constrains/userInfo";

type props = {
  id: number;
  start: Date;
  end: Date;
  receiving: boolean;
  address: string;
  withdrawn: number;
  isCanceled: boolean;
  cancelDate: Date;
  isMax: boolean;
  amount: number;
  currency: string;
  newWithdrawn: number | null;
  newCancel: boolean | null;
  newStream: boolean | null;
  senderCancel: boolean;
  receiverCancel: boolean;
  blockDate: Date;
  nickname: string;
};

const StreamingListItem = ({
  id,
  start,
  end,
  receiving,
  address,
  withdrawn,
  isCanceled,
  cancelDate,
  isMax,
  amount,
  currency,
  newWithdrawn,
  newCancel,
  newStream,
  senderCancel,
  receiverCancel,
  blockDate,
  nickname,
}: props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const { fee } = useSelector((state: any) => state.balance);
  useEffect(() => {
    if (newStream) {
      if (ref && ref.current) {
        if (ref.current)
          ref.current.style.background = "rgb(69, 129, 199, 0.5)";

        setTimeout(() => {
          if (ref.current) ref.current.style.background = "none";
          dispatch({ type: NEW_STREAM_COLOR, payload: { id } });
        }, 3000);
      }
    }

    if (newWithdrawn) {
      if (ref && ref.current) {
        ref.current.style.background = "#88ad48aa";

        setTimeout(() => {
          if (ref.current) ref.current.style.background = "none";
          dispatch({ type: WITHDRAW_STREAM_COLOR, payload: { id } });
        }, 3000);
      }
    }

    if (newCancel) {
      if (ref && ref.current) {
        ref.current.style.background = "#dc3545aa";

        setTimeout(() => {
          if (ref.current) ref.current.style.background = "none";
          dispatch({ type: CANCEL_STREAM_COLOR, payload: { id } });
        }, 3000);
      }
    }
  }, [newWithdrawn, newCancel, newStream, dispatch, id]);

  const clickHandler = () => {
    setShowModal(true);
  };

  var delta = (Number(end) - Number(start)) / 1000;

  const daysInit = Math.floor(delta / 86400);
  delta -= daysInit * 86400;

  const hoursInit = Math.floor(delta / 3600) % 24;
  delta -= hoursInit * 3600;

  const minutesInit = Math.floor(delta / 60) % 60;
  delta -= minutesInit * 60;

  return (
    <Row
      className="align-items-center jusifty-content-center mx-auto my-0 streaming-item-list"
      ref={ref}
    >
      <StreamingProgress
        start={start}
        end={end}
        receiving={receiving}
        address={address}
        withdrawn={withdrawn}
        isCanceled={isCanceled}
        cancelDate={cancelDate}
        isMax={isMax}
        amount={amount}
        currency={currency}
        nickname={nickname}
      />

      <Col md={2} className="pr-0 pl-1">
        <strong className="d-md-none">Steaming start: </strong>{" "}
        {convertDate(start)}{" "}
        <span className="opacity-time">{convertTime(start)}</span>
      </Col>
      <Col md={2} className="pr-0 pl-1">
        <strong className="d-md-none">Streaming end: </strong>
        {convertDate(end)}{" "}
        <span className="opacity-time">{convertTime(end)}</span>
      </Col>
      <Col
        md={1}
        className="d-flex justify-content-md-around mt-3 mt-md-0 flex-column flex-md-row align-item-center"
      >
        <div className="link-item" title="details">
          <Link href={receiving ? `/receiving/${id}` : `/streaming/${id}`}>
            <a>
              <i className="fas fa-info mb-1 list-icons" />
              {/* <ShareIcon width={18} height={18} fill="#ffffffaa" className="mb-1" /> */}{" "}
              <span className="d-md-none">Details</span>
            </a>
          </Link>
        </div>
        <div className="link-item" title={receiving ? "" : "repeat"}>
          {" "}
          {!receiving && (
            <button className="p-0 border-0 mb-0 mx-0" onClick={clickHandler}>
              <i className="fas fa-redo-alt list-icons" />
              {/* <StartStreamSymbol width={18} height={18} fill="#ffffffaa" className="mb-1" /> */}{" "}
              <span className="d-md-none">Repeat stream</span>
            </button>
          )}
        </div>
      </Col>
      {!receiving && (
        <RepeatModal
          show={showModal}
          setShow={setShowModal}
          addressTo={address}
          amount={amount}
          currencyRepeat={currency}
          yearInit={Number(end.getFullYear()) - Number(start.getFullYear())}
          dayInit={daysInit % 365}
          hourInit={hoursInit}
          minuteInit={minutesInit}
          senderCancelInit={senderCancel}
          receiverCancelInit={receiverCancel}
          blockDateInit={new Date(blockDate)}
          startDateInit={new Date(start)}
          endDateInit={new Date(end)}
        />
      )}
    </Row>
  );
};

export default StreamingListItem;
