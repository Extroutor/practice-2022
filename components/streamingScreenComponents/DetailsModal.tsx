import { useSelector } from "react-redux";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { CircularProgressbar } from "react-circular-progressbar";

type props = {
  start: Date;
  end: Date;
  amount: number;
  receiving: boolean;
  address_from: string;
  address_to: string;
  withdrawn: number;
  isCanceled: boolean;
  cancelDate: Date;
  currency: string;
  show: boolean;
  setShow: Function;
  progress: number;
  dateDiff: { days: number; minutes: string; hours: string; seconds: string };
};

const DetailsModal = ({
  start,
  end,
  amount,
  receiving,
  address_from,
  address_to,
  withdrawn,
  isCanceled,
  cancelDate,
  currency,
  show,
  setShow,
  progress,
  dateDiff,
}: props) => {
  const convertDate = (date: Date) =>
    date
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
      .replace(", ", " ");

  const shortenAddress = (longAddress: string) => {
    return `${longAddress.substr(0, 6)}...${longAddress.substr(
      longAddress.length - 6,
      longAddress.length
    )}`;
  };

  const timeDiff = (time: number) => {
    var delta = time / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${days > 0 ? `${days} Days ` : ""}${
      hours > 0 ? `${hours} Hours` : ""
    } ${minutes} Minutes`;
  };

  const { fee } = useSelector((state: any) => state.balance);
  return (
    <Modal
      className="modal"
      show={show}
      onHide={() => setShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Row className="mb-3 justify-content-first align-items-center align-content-center">
          <Col xs={3}>
            <h2 className="m-0 p-0">Details</h2>
          </Col>
          <Col xs={8}>
            <div className="modal-title d-inline px-3 py-1">
              <span>{isCanceled ? "Canceled" : progress === 100 ? "Completed" : "Streaming"}</span>
            </div>
          </Col>
          <Col xs={1}>
            <Button variant="transparent" className="p-0" onClick={() => setShow(false)}>
              <i className="fas fa-times opacity-time" />
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={6} className="row-titles">
            From
          </Col>
          <Col xs={6} className="row-titles">
            To
          </Col>
        </Row>

        <Row className="mb-3  align-items-center">
          <Col xs={5}>
            <div className="address-title px-3">{shortenAddress(address_from)}</div>
          </Col>
          <Col xs={1} className="row-titles">
            <i className="fas fa-arrow-right" />
          </Col>
          <Col xs={6}>
            <div className="address-title px-3">{shortenAddress(address_to)}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={7}>
            <span className="mx-1">Total value of the stream</span>
          </Col>
          <Col xs={5}>
            <div className="amount-value mx-3">
              {amount} <span className="row-titles">{currency || "DAI"}</span>
            </div>
          </Col>
        </Row>

        <Row className="my-2">
          <Col xs={6}>
            <div className="details-circles">
              <CircularProgressbar
                value={progress}
                className={receiving ? "details-circles-received" : "details-circles-streamed"}
              />
              <div className="details-circles-texts text-center">
                <span className="details-circles-values">
                  {progress === 100 || progress === 0 ? `${progress}%` : `${progress.toFixed(1)}%`}
                </span>
                <br />
                <span className="details-circles-titles">Streamed</span>
              </div>
            </div>
            <div className="text-center my-2">
              {(amount * progress) / 100}{" "}
              <span className="row-titles">{currency || "DAI"}</span>
            </div>
          </Col>
          <Col xs={6}>
            <div className="details-circles">
              <CircularProgressbar value={withdrawn * 100} className="details-circles-withdrawn" />
              <div className="details-circles-texts text-center">
                <span className="details-circles-values">
                  {withdrawn === 100 || withdrawn === 0
                    ? `${withdrawn * 100}%`
                    : `${(withdrawn * 100).toFixed(1)}%`}
                </span>
                <br />
                <span className="details-circles-titles">Withdrawn</span>
              </div>
            </div>
            <div className="text-center my-2">
              {amount * withdrawn}{" "}
              <span className="row-titles">{currency || "DAI"}</span>
            </div>
          </Col>
        </Row>
        <Row className="pt-2">
          <h4>Duration</h4>
        </Row>
        <Row className="time-details p-2">
          <Row className="align-items-center">
            <Col xs={9} className="d-flex align-items-center">
              {isCanceled ? (
                <>
                  <i className="fas fa-times" /> Canceled
                </>
              ) : new Date(Date.now()) > end ? (
                <>
                  <i className="fas fa-check" /> Finished
                </>
              ) : (
                <>
                  <i className="far fa-clock" />
                  <div className="d-inline-block">
                    <strong>
                      {dateDiff.days > 0 && `${dateDiff.days} Days `}
                      {Number(dateDiff.hours) > 0 && `${Number(dateDiff.hours)} Hours `}
                      {`${Number(dateDiff.minutes)} Minutes`}
                    </strong>
                  </div>
                </>
              )}
            </Col>
            <Col xs={3} className="px-0">
              {new Date(Date.now()) < end && !isCanceled && "Remaining"}
            </Col>
          </Row>
          <Row className="p-3">
            <Col>
              The stream {Number(start) < Date.now() ? "was started" : "will start"} on{" "}
              {convertDate(start)} and{" "}
              {!isCanceled
                ? progress !== 100
                  ? `has been active for ${timeDiff(
                      Date.now() - Number(start)
                    )}. If the sender does not cancel the stream, the full amount will be disbursed
              to ${shortenAddress(address_to)} on ${convertDate(end)}`
                  : `was active for ${timeDiff(
                      Number(end) - Number(start)
                    )}. The full amount was disbursed to ${shortenAddress(
                      address_to
                    )} on ${convertDate(end)}`
                : `was active for ${timeDiff(
                    Number(cancelDate) - Number(start)
                  )}. The sender has canceled the stream, the user ${shortenAddress(
                    address_to
                  )} can access the stream amount until the cancelation time on ${convertDate(
                    cancelDate
                  )}`}
            </Col>
          </Row>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default DetailsModal;
