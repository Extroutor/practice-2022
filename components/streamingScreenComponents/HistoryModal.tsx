//@ts-nocheck
import { useEffect, useState } from "react";
import { Row, Col, Modal, Button, Spinner, Alert } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { historyDetails } from "../../store/actions/userInfo";

import { Withdraw, Deposit } from "../icons/StreamingControls";

type props = {
  show: boolean;
  setShow: Function;
  startDate: Date;
  endDate: Date;
  cancelDate: Date;
  id: number;
  address_from: string;
  address_to: string;
  currency: string;
  amount: number;
  isCanceled: boolean;
};

const HistoryModal = ({
  show,
  setShow,
  startDate,
  amount,
  currency,
  endDate,
  cancelDate,
  id,
  isCanceled,
  address_from,
  address_to,
}: props) => {
  const [details, setDetails] = useState([]);

  const dispatch = useDispatch();
  const withdrawn = useSelector((state: any) => state.withdrawn);
  const { fee } = useSelector((state: any) => state.balance);

  function convertUTCDateToLocalDate(date: Date) {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return date;
  }

  function unconvertUTCDateToLocalDate(date: Date) {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );
    return date;
  }

  const convertDate = (date: Date) =>
    date
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
      .replace(",", "");

  useEffect(() => {
    if (show && id) {
      if (!withdrawn[id])
        dispatch(historyDetails(id, address_from, address_to));
    }
  }, [id, show, withdrawn, address_from, address_to, dispatch]);

  useEffect(() => {
    const detailsData = withdrawn[id] ? withdrawn[id].data : [];
    if (isCanceled && detailsData)
      detailsData.push({
        createdAt: unconvertUTCDateToLocalDate(cancelDate),
        id: -99,
      });
    if (detailsData && !isCanceled && new Date(Date.now()) >= endDate) {
      detailsData.push({
        createdAt: unconvertUTCDateToLocalDate(endDate),
        id: -98,
      });
    }
    if (detailsData) {
      detailsData.forEach((elem: any) => {
        elem.createdAt = new Date(elem.createdAt);
      });
      detailsData.sort((a: any, b: any) =>
        a.createdAt > b.createdAt ? 1 : -1
      );
      setDetails(detailsData);
    }
  }, [withdrawn, cancelDate, endDate, id, isCanceled]);

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
          <Col xs={10}>
            <h2 className="m-0 p-0">History</h2>
          </Col>
          <Col xs={2} className="px-3">
            <Button
              variant="transparent"
              className="p-0"
              onClick={() => setShow(false)}
            >
              <i className="fas fa-times opacity-time" />
            </Button>
          </Col>
        </Row>
        <Row className="px-2">
          {withdrawn[id] && withdrawn[id].loading ? (
            <Spinner
              animation="border"
              className="m-auto my-2"
              style={{ color: "black", height: "150px", width: "150px" }}
            />
          ) : withdrawn[id] && withdrawn[id].err ? (
            <Alert variant="danger">
              Error when loading try refreshing the page
            </Alert>
          ) : (
            <>
              <Row className="align-items-center px-2">
                <Col className="px-2 text-right" xs={1}>
                  <Deposit width={17} height={24} fill="black" />
                </Col>
                <Col className="px-0" xs={6}>
                  <strong>Deposit</strong>
                  <br /> {convertDate(startDate)}
                </Col>
                <Col
                  xs={5}
                  className="px-0 text-right"
                  style={{ fontSize: "1.3rem" }}
                >
                  <strong>{amount}</strong>{" "}
                  <span className="text-gray-opacity">{currency}</span>
                </Col>
              </Row>

              {details &&
                Array.from(new Set(details.map((s: any) => s.id)))
                  .map((id) => {
                    //@ts-nocheck
                    return {
                      id,
                      //@ts-ignore
                      createdAt: details.find((s: any) => s.id === id)
                        .createdAt,
                      //@ts-ignore
                      amount:
                        details.find((s: any) => s.id === id).amount *
                        (1 - fee),
                    };
                  })
                  .map((item: any) => (
                    <Row className="align-items-center py-1 px-2" key={item.id}>
                      <Col className="px-2 text-right" xs={1}>
                        {item.id === -99 ? (
                          <i className="fas fa-times" />
                        ) : item.id === -98 ? (
                          <i className="fas fa-check" />
                        ) : (
                          <Withdraw width={15} height={24} fill="black" />
                        )}
                      </Col>
                      <Col className="px-0" xs={6}>
                        <strong>
                          {item.id === -99
                            ? "Canceled"
                            : item.id === -98
                            ? "Stream ended"
                            : "Withdraw"}
                        </strong>
                        <br /> {convertDate(item.createdAt)}
                      </Col>
                      <Col
                        xs={5}
                        className="px-0 text-right"
                        style={{ fontSize: "1.3rem" }}
                      >
                        {item.id >= 0 && (
                          <>
                            <strong>
                              {(amount * item.amount * (1 - fee)).toFixed(6)}
                            </strong>{" "}
                            <span className="text-gray-opacity">
                              {currency}
                            </span>
                          </>
                        )}
                      </Col>
                    </Row>
                  ))}
            </>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default HistoryModal;
