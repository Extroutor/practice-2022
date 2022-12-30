//@ts-nocheck
import React, {useState, useEffect, useRef, MouseEvent} from "react";
import {Modal} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {sendFormInformation} from "../../store/actions/userInfo";
import {StartStreamSymbol} from "../icons/StartStream";
import {convertDateTime} from "../../helper/timeFunctions";
import {coins} from "../../constants/coins";
import {SHOW_BUY_CURRANCY_MODAL} from "../../store/constrains/currancyModal";
import {
    FormGroup,
    FormLabel,
    FormText,
    FormControl,
    Spinner,
    Form,
    Button,
    Row,
    Col,
    Alert,
} from "react-bootstrap";
import {startStream} from "../../blockChain/streamStart";
import {useConnect, useProvider} from "wagmi";
import {getAddressByNickname, getNicknameByAddress} from "../../blockChain/nickname";


type props = {
    show: boolean;
    setShow: Function;
    amount?: number;
    addressTo?: string;
    currencyRepeat?: string;
    yearInit?: number;
    minuteInit?: number;
    dayInit?: number;
    hourInit?: number;
    senderCancelInit?: boolean;
    receiverCancelInit?: boolean;
    blockDateInit?: Date;
    startDateInit?: Date;
    requesting?: boolean;
    endDateInit?: Date;
};

const SendMoneyForm = ({
                           show,
                           setShow,
                           amount,
                           addressTo,
                           currencyRepeat,
                           yearInit,
                           minuteInit,
                           dayInit,
                           hourInit,
                           senderCancelInit,
                           receiverCancelInit,
                           blockDateInit,
                           startDateInit,
                           requesting,
                           endDateInit,
                       }: props) => {
        const selectInit = Number(startDateInit) > Date.now();

        //
        const [uploading, setUploading] = useState(false);

        const [amountVal, setAmountVal] = useState(amount ? amount : 0);
        const [errAmount, setErrorAmount] = useState<string | null>(null);

        const [addressVal, setAddressVal] = useState(addressTo ? addressTo : "");
        const [addressHex, setAddressHex] = useState(addressTo ? addressTo : "");
        const [copied, setCopied] = useState(false);

        const [errAddress, setErrorAddress] = useState<string | null>(null);

        const [years, setYears] = useState(Number(yearInit) ? Number(yearInit) : 0);
        const [days, setDays] = useState(dayInit ? dayInit : 0);
        const [hours, setHours] = useState(hourInit ? hourInit : 0);
        const [minutes, setMinutes] = useState(minuteInit ? minuteInit : 0);

        const [currency, setCurrnecy] = useState(currencyRepeat || "DAI");

        const [formError, setFromError] = useState<string | null>(null);

        const [startDate, setStartDate] = useState<string | null>(
            selectInit
                ? `${startDateInit.getFullYear()}-${(
                    "0" +
                    (startDateInit.getMonth() + 1)
                ).match(/\d{2}$/)}-${("0" + startDateInit.getDate()).match(/\d{2}$/)}`
                : null
        );
        const [startTime, setStartTime] = useState<string | null>(
            selectInit
                ? `${("0" + startDateInit.getHours()).match(/\d{2}$/)}:${(
                    "0" + startDateInit.getMinutes()
                ).match(/\d{2}$/)}`
                : null
        );
        const [startDateTime, setStartDateTime] = useState<string | Date | null>(
            selectInit ? startDateInit : null
        );
        const [startDateTimeErr, setStartDateTimeErr] = useState<string | null>(null);
        const [selectStart, setSelectStart] = useState(selectInit);

        const rangeInputRef = useRef(null);
        const [blockRange, setBlockRange] = useState(
            blockDateInit && startDateInit && endDateInit
                ? ((blockDateInit - startDateInit) / (endDateInit - startDateInit)) *
                amount
                : 0
        );

        const [requestInput, setRequestInput] = useState("");
        const [blockDateTime, setBlockDateTime] = useState<string | Date | null>(
            selectInit ? blockDateInit : null
        );

        const [selectBlock, setSelectBlock] = useState(selectInit);

        const [selectCancelSender, setSelectCancelSender] = useState(
            typeof senderCancelInit !== "undefined" ? senderCancelInit : true
        );
        const [selectCancelReceiver, setSelectCancelReceiver] = useState(
            typeof receiverCancelInit !== "undefined" ? receiverCancelInit : true
        );

        const {loading, balance, error, fee} = useSelector(
            (state: { balance: any }) => state.balance
        );
        const [nickLoading, setNickLoading] = useState()
        const [err, setErr] = useState()
        const [nickOrAddress, setNickOrAddress] = useState()
        const {address} = useSelector((state: { user: any }) => state.user);
        const {socket} = useSelector((state: { socket: any }) => state.socket);
        const dispatch = useDispatch();
        const provider = useProvider()

        useEffect(() => {
            dispatch(sendFormInformation(currency, address, provider));
        }, [dispatch, address]);

        const endDate = (
            years: number,
            minutes: number,
            hours: number,
            days: number
        ) => {
            const newDate =
                (selectStart && startDateTime
                    ? Math.floor(Number(startDateTime) / 1000)
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

        const changeDateHandler = (e: any) => {
            setRequestInput('')
            dateTimeHandler(e.target.value, startTime);
            setStartDate(e.target.value);
        };

        const changeTimeHandler = (e: any) => {
            setRequestInput('')
            dateTimeHandler(startDate, e.target.value);
            setStartTime(e.target.value);
        };

        const dateTimeHandler = (date: string, time: string) => {
            setRequestInput('')
            if (date && time) {
                const startDateInput = new Date(`${date} ${time}`);
                if (Number(startDateInput) <= Date.now()) {
                    setStartDateTimeErr("Selected date should be in the future");
                    setStartDateTime(null);
                } else {
                    setStartDateTime(startDateInput);
                    setStartDateTimeErr(null);
                }
            } else {
                setStartDateTime(null);
                setStartDateTimeErr("Please fill both date and time");
            }
        };

        const blockTimeChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setRequestInput('')
            let inputVal =
                Number(e.target.value) > amountVal ? amountVal : Number(e.target.value);
            inputVal = inputVal < 0 ? 0 : inputVal;
            setBlockRange(inputVal);

            if (rangeInputRef.current) {
                const value = (inputVal / amountVal) * 100;
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
        };

        useEffect(() => {
            if (rangeInputRef.current && show) {
                if (blockRange > amountVal) {
                    setBlockRange(amountVal);
                }
                if (!Number(amountVal)) {
                    setBlockRange(0);
                }
                const value = (blockRange / amountVal) * 100;
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
        }, [show, amountVal]);

        useEffect(() => {
            const end = new Date(endDate(years, minutes, hours, days));

            setBlockDateTime(
                new Date(
                    Number(startDateTime) +
                    (Number(end) - Number(startDateTime)) *
                    (Number(blockRange) / Number(amountVal))
                )
            );
        }, [
            startDateTime,
            selectStart,
            hours,
            minutes,
            years,
            days,
            blockRange,
            amountVal,
        ]);

        const submitHandler = async (e: any) => {
            e.preventDefault();

            if (!errAmount && !errAddress) {
                if (requesting || (amountVal !== 0 && addressVal !== "")) {
                    if (days !== 0 || years !== 0 || hours !== 0 || minutes !== 0) {
                        if ((!startDateTimeErr && startDate && startTime) || !selectStart) {
                            if (blockDateTime || !selectBlock) {
                                setFromError(null);
                                if (requesting) {
                                    setRequestInput(
                                        `${
                                            process.env.NODE_ENV === "production"
                                                ? "https://ctrlx.net"
                                                : "http://localhost:3000"
                                        }/requesting?address=${address}&amount=${Number(
                                            amountVal
                                        )}&currency=${currency}&sender=${Number(
                                            selectCancelSender
                                        )}&receiver=${Number(selectCancelReceiver)}&start=${
                                            selectStart ? Number(startDateTime) : 0
                                        }&block=${blockRange}&hours=${hours}&years=${years}&minutes=${minutes}&days=${days}`
                                    );
                                } else {
                                    await startStream(
                                        addressHex,
                                        address,
                                        amountVal,
                                        currency,
                                        minutes,
                                        hours,
                                        days,
                                        years,
                                        startDateTime,
                                        selectStart,
                                        blockRange,
                                        selectBlock,
                                        selectCancelSender,
                                        selectCancelReceiver,
                                        socket,
                                        fee,
                                        dispatch,
                                        setShow,
                                        setAmountVal,
                                        setAddressHex,
                                        setHours,
                                        setYears,
                                        setDays,
                                        setMinutes,
                                        setUploading,
                                        setStartDate,
                                        setStartTime,
                                        setStartDateTime,
                                        setSelectCancelSender,
                                        setSelectCancelReceiver,
                                        setBlockDateTime,
                                        setSelectBlock,
                                        setSelectStart,
                                        {},
                                    );
                                }
                            } else {
                                setFromError("Please choose a valid block date");
                            }
                        } else {
                            setFromError("Please choose a valid start date");
                        }
                    } else {
                        setFromError("Please choose a duration");
                    }
                } else {
                    setFromError("Please choose vaild address or amount");
                }
            } else {
                setFromError("Please choose vaild address or amount");
            }
        };

        const changeBalanceHandler = (e: any) => {
            setRequestInput('')
            const inputValue = e.target.value;
            setAmountVal(inputValue);

            if (error) dispatch(sendFormInformation());
            if (!Number(inputValue) && inputValue !== "0") {
                setErrorAmount("please choose a number");
            } else if (Number(inputValue) > balance && !requesting) {
                setErrorAmount(`maximum amount you can transfer is ${balance}`);
            } else if (Number(inputValue) < 0) {
                setErrorAmount(`you cant send negative numbers`);
            } else if (inputValue === "0") {
                setErrorAmount(`you can't send 0 units`);
            } else {
                setErrorAmount(null);
            }
        };

        const changeCoinHandler = async (e: any) => {
            setRequestInput('')
            setCurrnecy(e.target.value);
        };

        const changeAddressHandler = async (e: any) => {
            setNickLoading(true)
            setAddressVal(e.target.value.replaceAll(" ", ""));
            const substr = e.target.value.replaceAll(" ", "").substring(0, 2)
            if (substr === '0x') {
                setAddressHex(e.target.value.replaceAll(" ", ""));
                // address input
                const data = await getNicknameByAddress(e.target.value.replaceAll(" ", ""), setNickLoading, setErr);
                if (data !== "" && data !== 1 && data !== 2) {
                    setErr(null);
                    setErrorAddress(null);
                    setAddressHex(e.target.value.replaceAll(" ", ""))
                } else {
                    if (data === 1) {
                        setNickOrAddress();
                        setErrorAddress("invalid address/nickname");
                        setAddressHex()
                    } else if (data === 2) {
                        setNickOrAddress();
                        setErr('User doesn\'t have a nickname :(')
                        setErrorAddress(null);
                    }
                }
            } else {
                // nickname input
                const data = await getAddressByNickname(e.target.value.replaceAll(" ", ""))
                if (data === '0x0000000000000000000000000000000000000000') {
                    setNickOrAddress();
                    setErr('There is no address with this nickname :(')
                    setErrorAddress(null);
                } else {
                    setNickOrAddress(data);
                    setAddressHex(data)
                    setErr(null);
                    setErrorAddress(null);
                }
            }
            setNickLoading(false)


        };

        const ref = useRef<HTMLDivElement>(null);

        const copyHandler = (text: string, e: MouseEvent) => {
            window.navigator.clipboard.writeText(text);
            if (ref.current) {
                ref.current.style.opacity = "1";

                setTimeout(() => {
                    //@ts-ignore
                    if (ref.current) ref.current.style.opacity = "0";
                }, 3000);
            }
            setCopied(true)
        };

        const loader = (
            <Spinner animation="border" style={{height: "20px", width: "20px"}}/>
        );


        return (
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Body className="p-0">
                    <Row className="align-items-center">
                        <Col xs={10} className="py-2 px-4 mt-2">
                            <h2>{requesting ? "Request a stream" : "Start a Stream"}</h2>
                        </Col>
                        <Col>
                            <Button variant="transparent" onClick={() => setShow(false)}>
                                <i
                                    className="fas fa-times opacity-time"
                                    style={{fontSize: "1.3rem"}}
                                />
                            </Button>
                        </Col>
                    </Row>
                    {!requesting && balance && balance.ETH === 0 && (
                        <Alert variant="info" className="py-0 my-1">
                            <Row className="align-items-center p-0">
                                <Col
                                    xs={8}
                                    className="py-2 pl-4 mt-2"
                                    style={{fontSize: "0.85rem"}}
                                >
                                    You have 0 ETH. ETH are necessery in order to pay for gas.
                                    Conisder buying some ETH before starting the stream.
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        className="px-3 py-0 w-100 buy-coin-btn"
                                        onClick={() =>
                                            dispatch({type: SHOW_BUY_CURRANCY_MODAL, payload: "ETH"})
                                        }
                                    >
                                        Buy ETH
                                    </Button>
                                </Col>
                            </Row>
                        </Alert>
                    )}
                    <div className="m-auto">
                        <Form onSubmit={(e) => submitHandler(e)}>
                            {formError && <Alert variant="danger">{formError}</Alert>}
                            {!requesting && (
                                <FormGroup
                                    controlId="AddressForm"
                                    className="py-2 px-4 mt-2">
                                    <FormLabel>Select the person{"'"}s address:</FormLabel>
                                    <FormControl
                                        type="text"
                                        maxLength={42}
                                        placeholder="Enter address or nickname"
                                        isInvalid={!!errAddress}
                                        value={addressVal}
                                        onChange={changeAddressHandler}
                                        disabled={uploading}
                                        style={{fontSize: "0.9rem"}}
                                    />
                                    {
                                        errAddress || !addressVal
                                            ?
                                            <FormControl.Feedback type="invalid">
                                                {errAddress}
                                            </FormControl.Feedback>
                                            :
                                            <p style={{color: "#313131", marginTop: '5px'}}>
                                                {nickLoading
                                                    ?
                                                    <Spinner
                                                        animation="border"
                                                        variant="black"
                                                        role="status"
                                                        className="mx-3 mb-2"
                                                    />
                                                    :
                                                    <div>{nickOrAddress
                                                        ?
                                                        <p style={{fontSize: '16px', color: '#127501'}}>{nickOrAddress}</p>
                                                        :
                                                        <p style={{fontSize: '14px', color: '#000000'}}>{err}</p>}</div>

                                                }
                                            </p>
                                    }
                                </FormGroup>
                            )}

                            <FormGroup controlId="currency" className="py-2 px-4 mt-2">
                                <Row className="py-1 align-items-center">
                                    <Col xs={8}>
                                        <FormLabel className="m-0">Select token type:</FormLabel>
                                    </Col>
                                    <Col xs={4} style={{textAlign: "right"}}>
                                        {!requesting && (
                                            <Button
                                                className="px-3 py-0 w-100 buy-coin-btn"
                                                onClick={() => {
                                                    dispatch({
                                                        type: SHOW_BUY_CURRANCY_MODAL,
                                                        payload: currency,
                                                    })
                                                    setRequestInput('')
                                                }}
                                            >
                                                Buy {currency}
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                <FormControl
                                    as="select"
                                    maxLength={42}
                                    value={currency}
                                    onChange={changeCoinHandler}
                                    disabled={uploading}
                                >
                                    {coins.map((coin) => (
                                        <option key={coin.name}>{coin.name}</option>
                                    ))}
                                </FormControl>
                            </FormGroup>

                            <FormGroup controlId="BalanceForm" className="py-2 px-4 mt-2">
                                <FormLabel>Insert stream amount:</FormLabel>
                                <FormControl
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter transfer amount"
                                    isInvalid={errAmount || error}
                                    value={amountVal}
                                    onChange={changeBalanceHandler}
                                    disabled={uploading}
                                />
                                <FormControl.Feedback type="invalid">
                                    {errAmount || "error can't get balance please try again later"}
                                </FormControl.Feedback>

                                {!requesting && (
                                    <FormText className="text-muted">
                                        your account has: {loading && loader}
                                        {!loading &&
                                        balance &&
                                        (balance[currency] || balance[currency] === 0)
                                            ? balance[currency].toFixed(2)
                                            : null}{" "}
                                        {currency}
                                    </FormText>
                                )}
                                <br/>
                                <FormText className="text-dark text-form">
                                    <br/>
                                    There is a <strong>fee</strong> on the stream equates to{" "}
                                    <strong>{fee * 100}%</strong>
                                    <br/>
                                    {Number(amountVal) > 0 && (
                                        <>
                                            <strong>Total amount</strong> together with the
                                            fees is <strong>{amountVal * (1 + fee)}</strong>
                                        </>
                                    )}
                                </FormText>
                            </FormGroup>

                            <FormGroup controlId="startTime" className="py-2 px-4 mt-2">
                                <Row>
                                    <Col xs={1}>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectStart}
                                            disabled={uploading}
                                            onChange={() => setSelectStart(!selectStart)}
                                        />
                                    </Col>
                                    <Col>
                                        <FormLabel>Select when to start</FormLabel>
                                    </Col>
                                </Row>
                                {selectStart ? (
                                    <>
                                        <Row>
                                            <Col xs={7}>
                                                <FormControl
                                                    type="date"
                                                    isInvalid={!!startDateTimeErr}
                                                    disabled={uploading}
                                                    value={startDate}
                                                    onChange={changeDateHandler}
                                                />
                                            </Col>
                                            <Col xs={5}>
                                                <FormControl
                                                    type="time"
                                                    isInvalid={!!startDateTimeErr}
                                                    disabled={uploading}
                                                    value={startTime}
                                                    onChange={changeTimeHandler}
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <Row>
                                        <FormLabel>your stream will start immediately</FormLabel>
                                    </Row>
                                )}
                            </FormGroup>

                            <FormGroup controlId="blockTime" className="py-2 px-4 mt-2">
                                <Row>
                                    <Col xs={1}>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectBlock}
                                            disabled={uploading}
                                            onChange={() => setSelectBlock(!selectBlock)}
                                        />
                                    </Col>
                                    <Col>
                                        <FormLabel>
                                            Do you want to block stream from cancelation for a certain
                                            duration
                                        </FormLabel>
                                    </Col>
                                </Row>
                                {selectBlock && (
                                    <>
                                        <Row className="my-1 py-1 align-content-center align-items-center">
                                            <Col xs={8}>
                                                <input
                                                    type="range"
                                                    id="withdrawnInput"
                                                    onChange={blockTimeChangeHandler}
                                                    ref={rangeInputRef}
                                                    min={0}
                                                    max={amountVal}
                                                    value={blockRange}
                                                    step="0.00000000000000001"
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <>
                                                    <div className="input-group">
                                                        <input
                                                            max={amountVal}
                                                            type="number"
                                                            className="form-control"
                                                            value={blockRange}
                                                            step="0.00000000000000001"
                                                            onChange={blockTimeChangeHandler}
                                                        />
                                                        <div className="input-group-append p-0">
                            <span className="input-group-text px-1">
                              {currency}
                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            </Col>
                                        </Row>
                                        <Row className="text-muted d-block px-3">
                                            {blockDateTime &&
                                                `This stream will be approximately blocked util ${convertDateTime(
                                                    blockDateTime
                                                )}`}
                                        </Row>
                                    </>
                                )}
                            </FormGroup>

                            <FormGroup controlId="startTime" className="py-2 px-4 mt-2">
                                <FormLabel>Select who can cancel stream</FormLabel>

                                <Row>
                                    <Col xs={6}>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Check
                                                    type="checkbox"
                                                    disabled={uploading}
                                                    checked={selectCancelSender}
                                                    onChange={() => {
                                                        setRequestInput('')
                                                        setSelectCancelSender(!selectCancelSender)
                                                    }}
                                                />
                                            </Col>
                                            <Col>Sender</Col>
                                        </Row>
                                    </Col>
                                    <Col xs={6}>
                                        <Row>
                                            <Col xs={1}>
                                                <Form.Check
                                                    type="checkbox"
                                                    disabled={uploading}
                                                    checked={selectCancelReceiver}
                                                    onChange={() => {
                                                        setRequestInput('')
                                                        setSelectCancelReceiver(!selectCancelReceiver)
                                                    }}
                                                />
                                            </Col>
                                            <Col>Receiver</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <Row className="py-2 px-4 mt-2">
                                <FormLabel>Insert stream duration:</FormLabel>
                                <Col xs={6} className="py-2">
                                    <Form.Group controlId="year">
                                        <Row className="d-flex align-items-center">
                                            <Col xs={5}>
                                                <Form.Label className="m-0 p-0">Years:</Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    value={years}
                                                    onChange={(e: any) => {
                                                        setRequestInput('')
                                                        setYears(e.target.value);
                                                    }}
                                                    disabled={uploading}
                                                >
                                                    <option>0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Form.Control>
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
                                                <Form.Control
                                                    as="select"
                                                    value={days}
                                                    onChange={(e: any) => {
                                                        setRequestInput('')
                                                        setDays(e.target.value);
                                                    }}
                                                    disabled={uploading}
                                                >
                                                    {Array.from({length: 366}, (el, index) => index).map(
                                                        (i) => (
                                                            <option key={i}>{i}</option>
                                                        )
                                                    )}
                                                </Form.Control>
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
                                                    as="select"
                                                    value={hours}
                                                    onChange={(e: any) => {
                                                        setRequestInput('')
                                                        setHours(Number(e.target.value));
                                                    }}
                                                    disabled={uploading}
                                                >
                                                    {Array.from({length: 24}, (el, index) => index).map(
                                                        (i) => (
                                                            <option key={i}>{i}</option>
                                                        )
                                                    )}
                                                </Form.Control>
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
                                                    as="select"
                                                    value={minutes}
                                                    onChange={(e: any) => {
                                                        setRequestInput('')
                                                        setMinutes(Number(e.target.value));
                                                    }}
                                                    disabled={uploading}
                                                >
                                                    {Array.from({length: 60}, (el, index) => index).map(
                                                        (i) => (
                                                            <option key={i}>{i}</option>
                                                        )
                                                    )}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <FormText className="text-muted">
                                    The duration is:{" "}
                                    {years + minutes + hours + days === 0 ? "--" : ""}
                                    {years ? `${years} years` : ""} {days ? `${days} days` : ""}{" "}
                                    {hours ? `${hours} hours` : ""}{" "}
                                    {minutes ? `${minutes} minutes` : ""}.
                                    <br/>
                                    {years + minutes + hours + days > 0
                                        ? `The stream will approximately finish on: ${endDate(
                                            years,
                                            minutes,
                                            hours,
                                            days
                                        )}`
                                        : ""}
                                </FormText>
                            </Row>

                            {requesting && (
                                <div>
                                    {requestInput
                                        ?
                                        <div className='req_block'>
                                            <div className='req_block_title'>Copy this link and send it:</div>
                                            <div className='req_block_link'>{requestInput}</div>
                                            {
                                                !copied
                                                    ?
                                                    <div className='req_block_button'
                                                         onClick={(e) => copyHandler(requestInput, e)}
                                                    >CLick to copy link
                                                    </div>
                                                    :
                                                    <div className='req_block_button_disabled'>Link copied</div>
                                            }
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
                            )}
                            {requesting ? (
                                <Button
                                    type="submit"
                                    className="transfer-button-modal"
                                >
                                    <strong>Generate Link</strong>
                                    <StartStreamSymbol
                                        width={18}
                                        height={18}
                                        className="mx-2 mb-1 start_svg"
                                    />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={uploading}
                                    className="transfer-button-modal"
                                >
                                    <strong>Start Stream</strong>
                                    {uploading ? (
                                        <Spinner
                                            className="mx-2"
                                            animation="border"
                                            style={{color: "white", width: "14px", height: "14px"}}
                                        />
                                    ) : (
                                        <StartStreamSymbol
                                            width={18}
                                            height={18}
                                            className="mx-2 mb-1 start_svg"
                                        />
                                    )}
                                </Button>
                            )}
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
;

export default SendMoneyForm;
