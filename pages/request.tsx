//@ts-nocheck

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";

import {
  Container,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  Spinner,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";

import Header from "../components/Header";

import { useRouter } from "next/router";
import { sendFormInformation } from "../store/actions/userInfo";
import { StartStreamSymbol } from "../components/icons/StartStream";
import { startStream } from "../blockChain/streamStart";
import { convertDateTime } from "../helper/timeFunctions";
import { SHOW_BUY_CURRANCY_MODAL } from "../store/constrains/currancyModal";
import CurrancyBuyModal from "../components/streamingListComponents/CurrancyBuyModal";
import {useProvider} from "wagmi";

const Request = () => {
  const router = useRouter();
  const { address, sender, receiver, amount, start, block, years, minutes, hours, days, currency } =
    router.query;

  const rangeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (rangeInputRef.current) {
      const value = (Number(block) / Number(amount)) * 100;
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
  }, [rangeInputRef.current]);

  const endDate = (years: number, minutes: number, hours: number, days: number) => {
    const newDate =
      (Number(startDate) > Date.now()
        ? Math.floor(Number(startDate) / 1000)
        : Math.floor(Date.now() / 1000)) +
      60 * minutes +
      3600 * hours +
      86400 * days +
      31556926 * years;
    //@ts-ignore
    return new Date(newDate * 1000)
      .toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
      .replace(", ", " ");
  };
  const { loading, balance, error, fee } = useSelector((state: { balance: any }) => state.balance);

  const [linkError, setLinkError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [blockDate, setBlockDate] = useState<Date>(new Date());

  const dispatch = useDispatch();

  const startPoint = Number(start) === 0 ? Date.now() : Number(start);

  useEffect(() => {
    setLinkError(false);
    if (address) {
      try {
        ethers.utils.getAddress(String(address));
      } catch (err) {
        setLinkError(true);
      }
    } else {
      setLinkError(true);
    }
    if (amount && Number(amount)) {
      if (Number(amount) > balance) {
        setAmountError("you don't have enough in your acount");
      } else {
        setAmountError("");
      }
    } else {
      setLinkError(true);
    }

    if (start && (Number(start) || start === "0")) {
      setStartDate(new Date(Number(start)));
    } else {
      setLinkError(true);
    }

    if (block && (Number(block) || block === "0")) {
      setBlockDate(new Date(Number(block)));
    } else {
      setLinkError(true);
    }

    if (!(receiver === "0" || receiver === "1")) {
      setLinkError(true);
    }

    if (!(sender === "0" || sender === "1")) {
      setLinkError(true);
    }
    if (!currency) {
      setLinkError(true);
    }
  }, [address, amount, balance, start, block, sender, receiver, currency]);

  const { socket } = useSelector((state: { socket: any }) => state.socket);
  const { address: userAddress } = useSelector((state: { user: any }) => state.user);
  const provider = useProvider()

  useEffect(() => {
    dispatch(sendFormInformation(String(currency, address, provider)));
  }, [dispatch, sendFormInformation, currency, userAddress]);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    //@ts-ignore
    await startStream(
      String(address),
      userAddress,
      Number(amount),
      String(currency),
      Number(minutes),
      Number(hours),
      Number(days),
      Number(years),
      Number(startDate) <= Date.now() ? 0 : startDate,
      Number(startDate) <= Date.now() ? false : true,
      Number(block),
      Number(block) === 0 ? false : true,
      Boolean(Number(sender)),
      Boolean(Number(receiver)),
      socket,
      dispatch,
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      setUploading,
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      router
    );
  };

  const loader = <Spinner animation="border" style={{ height: "20px", width: "20px" }} />;
  return (
    <>
      <Head>
        <title>ctrlX | Sending Money</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="max-container px-0 mb-lg-2 w-100">
        <Header />
      </Container>
      <Container style={{ maxWidth: "800px" }} className="px-2 mb-lg-2 m-auto">
        <Form onSubmit={(e) => submitHandler(e)}>
          {balance.ETH === 0 && (
            <FormGroup controlId="alert" className="py-2 px-4 mt-2">
              <Alert variant="info" className="py-0 my-1">
                <Row className="align-items-center p-0">
                  <Col xs={8} className="py-2 pl-4 mt-2" style={{ fontSize: "0.85rem" }}>
                    You have 0 ETH. ETH are necessery in order to pay for gas. Conisder buying some
                    ETH before starting the stream.
                  </Col>
                  <Col xs={4}>
                    <Button
                      className="px-3 py-0 w-100 buy-coin-btn"
                      onClick={() => dispatch({ type: SHOW_BUY_CURRANCY_MODAL, payload: "ETH" })}
                    >
                      Buy ETH
                    </Button>
                  </Col>
                </Row>
              </Alert>
            </FormGroup>
          )}

          <FormGroup controlId="AddressForm" className="py-2 px-4 mt-2">
            <FormLabel className="requesting-text">Receiving Address:</FormLabel>
            <FormControl type="text" defaultValue={address} disabled />
          </FormGroup>

          <FormGroup controlId="BalanceForm" className="py-2 px-4 mt-2 requesting-text">
            <Row className="py-2 align-items-center">
              <Col xs={8}>
                <FormLabel className="m-0">Select token type:</FormLabel>
              </Col>
              <Col xs={4} style={{ textAlign: "right" }}>
                <Button
                  className="px-3 py-0 w-100 buy-coin-btn"
                  onClick={() => dispatch({ type: SHOW_BUY_CURRANCY_MODAL, payload: currency })}
                >
                  Buy {currency}
                </Button>
              </Col>
            </Row>

            <FormControl
              type="number"
              isInvalid={amountError || error}
              defaultValue={Number(amount)}
              disabled
            />
            <FormControl.Feedback type="invalid">
              {amountError || "error can't get balance please try again later"}
            </FormControl.Feedback>
            <FormText className="text-white">
              your account has: {loading && loader}
              {!loading && balance && (balance[String(currency)] || balance[String(currency)] === 0)
                ? balance[String(currency)].toFixed(2)
                : null}{" "}
              {currency}
            </FormText>
            <br />
            <FormText className="text-white text-form">
              <br />
              There are a <strong>fee</strong> on the stream equates to{" "}
              <strong>{fee * 100}%</strong>
              <br />
              {Number(amount) > 0 && (
                <>
                  <strong>Total amount</strong> to be transfered after the fees is{" "}
                  <strong>{Number(amount) * (1 - fee)}</strong>
                </>
              )}
            </FormText>
          </FormGroup>

          <FormGroup controlId="startTime" className="py-2 px-4 mt-3 requesting-text">
            <Row>
              <Col>
                <FormLabel>Start Time:</FormLabel>
              </Col>
            </Row>
            {Number(start) > 0 && (
              <Row>
                <Col xs={7}>
                  <FormControl
                    type="date"
                    disabled
                    defaultValue={`${startDate.getFullYear()}-${(
                      "0" +
                      (startDate.getMonth() + 1)
                    ).match(/\d{2}$/)}-${("0" + startDate.getDate()).match(/\d{2}$/)}`}
                  />
                </Col>
                <Col xs={5}>
                  <FormControl
                    type="time"
                    defaultValue={`${("0" + startDate.getHours()).match(/\d{2}$/)}:${(
                      "0" + startDate.getMinutes()
                    ).match(/\d{2}$/)}`}
                    disabled
                  />
                </Col>
              </Row>
            )}
            <Row>
              <FormLabel>
                {Number(start) < Date.now()
                  ? "Start point has passed. If you chose to continue the stream will start from the moment you click the button."
                  : Number(start) === 0
                  ? "Your stream will start immediatly"
                  : ""}
              </FormLabel>
            </Row>
          </FormGroup>

          <FormGroup controlId="blocktime" className="py-2 px-4 mt-3 requesting-text">
            <Row>
              <Col>
                <FormLabel>Block Time:</FormLabel>
              </Col>
            </Row>

            <Row>
              <Col xs={8}>
                <input
                  type="range"
                  id="withdrawnInput"
                  ref={rangeInputRef}
                  min={0}
                  max={Number(amount)}
                  defaultValue={Number(block)}
                  step="0.00000000000000001"
                />
              </Col>
              <Col xs={4}>
                <>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={Number(block)}
                      step="0.00000000000000001"
                    />
                    <div className="input-group-append p-0">
                      <span className="input-group-text px-1">{currency}</span>
                    </div>
                  </div>
                </>
              </Col>
            </Row>

            <Row className="text-white d-block px-3 my-2">
              {Number(block) > 0 && (
                <>
                  {`The stream will approximately be blocked untill: ${convertDateTime(
                    new Date(
                      startPoint +
                        (Number(
                          new Date(
                            endDate(Number(years), Number(minutes), Number(hours), Number(days))
                          )
                        ) -
                          startPoint) *
                          (Number(block) / Number(amount))
                    )
                  )}`}
                  <br />
                  The amount frozen after fee is {Number(block) * (1 - fee)} {currency}
                </>
              )}
            </Row>
          </FormGroup>

          <FormGroup controlId="cancelation" className="py-2 px-4 mt-2 requesting-text">
            <FormLabel>Who can cancel stream</FormLabel>

            <Row>
              <Col xs={6}>
                <Row>
                  <Col xs={1}>
                    <Form.Check type="checkbox" disabled checked={Boolean(Number(sender))} />
                  </Col>
                  <Col>Sender</Col>
                </Row>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col xs={1}>
                    <Form.Check type="checkbox" disabled checked={Boolean(Number(receiver))} />
                  </Col>
                  <Col>Receiver</Col>
                </Row>
              </Col>
            </Row>
          </FormGroup>

          <Row className="py-2 px-4 mt-2 requesting-text">
            <FormLabel>Insert stream duration:</FormLabel>
            <Col xs={6} className="py-2">
              <Form.Group controlId="year">
                <Row className="d-flex align-items-center">
                  <Col xs={5}>
                    <Form.Label className="m-0 p-0">Years:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control type="text" defaultValue={Number(years)} disabled />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col xs={6} className="py-2">
              <Form.Group controlId="days">
                <Row className="d-flex align-items-center">
                  <Col xs={5}>
                    <Form.Label className="m-0 p-0">Days:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control type="text" defaultValue={Number(days)} disabled />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col xs={6} className="py-2">
              <Form.Group controlId="hours">
                <Row className="d-flex align-items-center">
                  <Col xs={5} className="mx-0">
                    <Form.Label className="m-0 p-0">Hours:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      className="mx-0"
                      type="text"
                      defaultValue={Number(hours)}
                      disabled
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col xs={6} className="py-2">
              <Form.Group controlId="minutes">
                <Row className="d-flex align-items-center">
                  <Col xs={5} className="mx-0">
                    <Form.Label className="m-0 p-0">Minutes:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      className="mx-0"
                      type="text"
                      defaultValue={Number(minutes)}
                      disabled
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <FormText className="text-white">
              The duration is:{" "}
              {Number(years) + Number(minutes) + Number(hours) + Number(days) === 0 ? "--" : ""}
              {Number(years) ? `${Number(years)} years` : ""}{" "}
              {Number(days) ? `${Number(days)} days` : ""}{" "}
              {Number(hours) ? `${Number(hours)} hours` : ""}{" "}
              {Number(minutes) ? `${Number(minutes)} minutes` : ""}.
              <br />
              {Number(years) + Number(minutes) + Number(hours) + Number(days) > 0
                ? `The stream will approximately finish on: ${endDate(
                    Number(years),
                    Number(minutes),
                    Number(hours),
                    Number(days)
                  )}`
                : ""}
            </FormText>
          </Row>
          <Row className="justify-content-center">
            <Button
              type="submit"
              disabled={uploading || linkError || Boolean(amountError)}
              className="mt-3 w-auto m-auto px-5 rounded-2 py-3 transfer-button-modal"
            >
              <strong>Start Stream</strong>
              {uploading ? (
                <Spinner
                  className="mx-2"
                  animation="border"
                  style={{ color: "white", width: "14px", height: "14px" }}
                />
              ) : (
                <StartStreamSymbol width={18} height={18} fill='#af49ff' className="mx-2 mb-1" />
              )}
            </Button>
          </Row>
        </Form>

        <CurrancyBuyModal />
      </Container>
    </>
  );
};

export default Request;
