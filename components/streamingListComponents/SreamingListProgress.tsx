import React, {useState, useEffect} from "react";
import {Col, Form, ProgressBar, Spinner} from "react-bootstrap";
import StreamingListIcon from "./StreamListIcon";
import {getNicknameByAddress} from "../../blockChain/nickname";

type props = {
    start: Date;
    end: Date;
    receiving: boolean;
    address: string;
    amount: number;
    currency: string;
    withdrawn: number;
    isCanceled: boolean;
    cancelDate: Date;
    isMax: boolean;
    nickname: string;
};
const StreamingListItem = ({
                               start,
                               end,
                               receiving,
                               address,
                               amount,
                               currency,
                               withdrawn,
                               isCanceled,
                               cancelDate,
                               isMax,
                               nickname,
                           }: props) => {
    // const {showNicknames} = useSelector((state: any) => state.user);
    let [showNickname, setShowNickname] = useState(false);
    let [loading, setLoading] = useState(false);
    let [nick, setNick] = useState('');
    let [err, setErr] = useState();
    const [time, setTime] = useState(new Date(Date.now()));
    useEffect(() => {
        if (showNickname) {
            nicknameHandler()
        }
    }, [showNickname]);

    // console.log('///////////////////////')
    // console.log('address', address)
    // console.log('amount', amount)
    // console.log('with', withdrawn)
    // console.log('///////////////////////')

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
        progress =
            100 -
            ((Number(end) - Number(time)) / (Number(end) - Number(start))) * 100;
        progress = progress > 100 ? 100 : progress.toFixed(2);
        progress = progress < 0 ? 0 : progress;
    } else if (isCanceled) {
        if (cancelDate && Number(cancelDate) < Number(start)) {
            progress = 0;
        } else {
            progress = withdrawn;
        }
    } else {
        progress = 100;
    }

    const nicknameHandler = async () => {
        const data = await getNicknameByAddress(address, setLoading, setErr)
        if (data !== "" && data !== 1 && data !== 2) {
            // @ts-ignore
            setNick(data);
            // @ts-ignore
            setErr(null);
        } else if (data === 1) {
            // @ts-ignore
            setErr('invalid address/nickname');
        } else if (data === 2) {
            // @ts-ignore
            setErr("User doesn't have a nickname :(")
        }
    }

    return (
        <React.Fragment>
            <Col md={1} className="mb-1 pr-0 pl-1 text-md-center">
                <strong className="d-md-none">Status: </strong>
                {
                    //@ts-ignore
                    <StreamingListIcon
                        isCanceled={isCanceled}
                        receiving={receiving}
                        progress={progress}
                    />
                }
            </Col>
            <Col md={2} className="mb-1 pr-0 pl-1">
        <span title={address}>
          <strong className="d-md-none">{receiving ? "From" : "To"}: </strong>
          <span className="d-sm-none d-md-inline">
            {!showNickname
                ?
                address.substr(0, 5) +
                "...." +
                address.substr(address.length - 5, address.length)
                :
                loading ? (
                    <Spinner
                        animation="border"
                        variant="white"
                        role="status"
                        className="mx-3 mb-2"
                    />
                ) : (
                    err
                        ?
                        <div>{err}</div>
                        :
                        <div>{nick}</div>
                )}

              <Form.Group className="mt-1">
                  <Form.Check
                      type="checkbox"
                      label="nickname"
                      onClick={() => {
                          setShowNickname(!showNickname)
                          if (showNickname) {
                              nicknameHandler()
                          }
                      }}
                  />
              </Form.Group>
          </span>
          <span className="d-md-none d-none d-sm-inline">{address}</span>
        </span>
            </Col>
            <Col md={1} className="mb-1 pr-0 pl-1">
        <span>
          <strong className="d-md-none">Value: </strong>
            {amount + " " + (currency || " ")}
        </span>
            </Col>

            <Col md={3} className="bg-transparent mb-1 pr-0 pl-1">
                {
                    //@ts-ignore
                    <ProgressBar
                        now={Number(progress)}
                        className={`progressbar-item ${
                            receiving ? "progressbar-receiving" : "progressbar-streaming"
                        }`}
                    />
                }
                <ProgressBar
                    now={withdrawn}
                    className="progressbar-item progressbar-withdrawn"
                />
            </Col>
        </React.Fragment>
    );
};

export default StreamingListItem;
