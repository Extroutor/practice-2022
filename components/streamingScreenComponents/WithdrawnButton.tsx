import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Button, Spinner, Modal, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { Withdraw as WithdrawIcon } from "../../components/icons/StreamingControls";

import withdrawStream from "../../blockChain/withdraw";

import getBalance from "../../blockChain/getBalance";

type props = {
  progress: number;
  withdrawn: number;
  id: number;
  address: string;
  addressTo: string;
  disabled: boolean;
  isCanceled: boolean;
  cancelDate: Date;
  currency: string;
  endDate: Date;
  amount: number;
  start: Date;
};

const WithdrawalButton = ({
  progress,
  withdrawn,
  id,
  address,
  disabled,
  cancelDate,
  isCanceled,
  currency,
  endDate,
  amount,
  start,
  addressTo,
}: props) => {
  const rangeInputRef = useRef(null);
  const [val, setVal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<string>("0");

  const { address: address_to } = useSelector(
    (state: { user: any }) => state.user
  );
  const { socket } = useSelector((state: { socket: any }) => state.socket);
  const { fee } = useSelector((state: any) => state.balance);

  useEffect(() => {
    if (showModal) {
      getBalance(id, address_to, amount, setLimit);
    }
  }, [showModal, address, id, amount]);

  const dispatch = useDispatch();
  const clickHandler = async () => {
    if (limit !== "0") {
      await withdrawStream(
        id,
        val,
        setLoading,
        socket,
        address,
        address_to,
        amount,
        dispatch,
        setShowModal,
        setVal,
        limit,
        setLimit,
        fee
      );
    }
  };

  const convertDate = (date: Date) =>
    date
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
      .replace(",", " at");

  const maxValue = isCanceled
    ? ((Number(cancelDate) - Number(start)) /
        (Number(endDate) - Number(start))) *
        amount -
      withdrawn * amount
    : (amount * progress) / 100 - amount * withdrawn;
  if (rangeInputRef.current) {
    const value = (val / maxValue) * 100;
    //@ts-ignore
    rangeInputRef.current.style.background = `linear-gradient(to right, #af49ff 0%, #af49ff ${value}%, #fff ${value}%, white 100%)`;
    //@ts-ignore
    rangeInputRef.current.style.background = `-o-linear-gradient(to right, #af49ff 0%, #af49ff ${value}%, #fff ${value}%, white 100%)`;
    //@ts-ignore
    rangeInputRef.current.style.background = `-moz-linear-gradient(to right, #af49ff 0%, #af49ff ${value}%, #fff ${value}%, white 100%)`;
    //@ts-ignore
    rangeInputRef.current.style.background = `-ms-linear-gradient(to right, #af49ff 0%, #af49ff ${value}%, #fff ${value}%, white 100%)`;
    //@ts-ignore
    rangeInputRef.current.style.background = `-webkit-linear-gradient(to right, #af49ff 0%, #af49ff ${value}%, #fff ${value}%, white 100%)`;
  }

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let inputVal =
      Number(e.target.value) > maxValue ? maxValue : Number(e.target.value);
    inputVal = inputVal < 0 ? 0 : inputVal;
    setVal(inputVal);
  };

  return (
    <>
      <div className="controller-button mx-1 text-center h-100">
        <button
          // variant="transparent"
          onClick={() => setShowModal(true)}
          className="d-inline w-auto px-3 py-1 m-0 cancelButton"
          disabled={disabled}
        >
          {loading ? (
            <div className="px-2 mx-2">
              <Spinner
                animation="border"
                variant="white"
                style={{ height: "46px", width: "46px" }}
              />
            </div>
          ) : (
            <WithdrawIcon
              width={35}
              height={48}
              fill="white"
              className="mb-3 detailsIcon"
            />
          )}
          <br />
          Withdraw
        </button>
      </div>

      <Modal
        className="modal"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setVal(0);
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <Row className="my-3 mx-2 justify-content-first align-items-center align-content-center">
            <Col xs={10}>
              <h3 className="m-0 p-0">
                <strong>Withdraw</strong>
              </h3>
            </Col>
            <Col xs={2} className="px-3">
              <Button
                variant="transparent"
                className="p-0"
                onClick={() => {
                  setShowModal(false);
                  setVal(0);
                }}
              >
                <i className="fas fa-times opacity-time" />
              </Button>
            </Col>
          </Row>
          <Row className="mx-2 my-3 py-1">
            <Col>
              <span className="text-gray-opacity">
                This stream{" "}
                {progress === 100
                  ? "has ended"
                  : isCanceled
                  ? "was canceled"
                  : "will end"}{" "}
                on {isCanceled ? convertDate(cancelDate) : convertDate(endDate)}{" "}
                and streamed{" "}
              </span>
              <br/>
              <span className="text-black-opacity">
                <strong>{`${
                  (amount * progress) / 100
                } ${currency}`}</strong>
              </span>{" "}
              <br/>
              <span>
                from total of {`${amount} ${currency}`}. Withdrawn
                to this moment{" "}
                <br/>
                <strong>{` ${amount * withdrawn} ${currency}`}</strong>.<br/>The stream
                started by{" "}
                {`${address.substring(0, 6)}....${address.substring(
                  address.length - 7,
                  address.length
                )}`}
              </span>
              <br/>
              <br/>
              <span>There is a <strong>fee</strong> for the withdraw equates to{" "}
                <strong>{fee * 100}%</strong>
                <br/>
                Total amount with the fee is:
                <br/>
                <strong>{` ${val * (1-fee)} ${currency}`}</strong>
              </span>
            </Col>
          </Row>

          <Row className="mx-2 my-3 py-1 align-content-center align-items-center">
            <Col xs={8}>
              <input
                type="range"
                id="withdrawnInput"
                onChange={changeHandler}
                ref={rangeInputRef}
                min={0}
                max={maxValue}
                value={val}
                step="0.00000000000000001"
              />
            </Col>
            <Col xs={4}>
              <>
                <div className="input-group">
                  <input
                    max={maxValue}
                    type="number"
                    className="form-control"
                    value={val}
                    step="0.00000000000000001"
                    onChange={changeHandler}
                  />
                  <div className="input-group-append p-0">
                    <span className="input-group-text px-1">{currency}</span>
                  </div>
                </div>
              </>
            </Col>
          </Row>
          <Button
            type="submit"
            className="mt-3 w-100 p-2 py-3 transfer-button-modal withdraw-button-modal"
            onClick={clickHandler}
            disabled={loading || val === 0}
          >
            <strong>Withdraw </strong>
            {loading ? (
              <Spinner
                animation="border"
                className="mx-2"
                style={{ width: "20px", height: "20px", color: "white" }}
              />
            ) : (
              <WithdrawIcon
                width={14}
                height={18}
                fill="white"
                className="mx-3 mb-1"
              />
            )}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WithdrawalButton;
