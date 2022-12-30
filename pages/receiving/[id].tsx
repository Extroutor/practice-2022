import {useEffect, useState} from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

import {receiveData} from "../../store/actions/userInfo";

import {Container} from "react-bootstrap";

import Header from "../../components/Header";
import SignInButton from "../../components/SignInButton";

const StreamingCircle = dynamic(
    () => import("../../components/streamingScreenComponents/StreamingCircle"),
    {ssr: false}
);

type item = {
    start_date: string;
    end_date: string;
    amount: number;
    receiving: boolean;
    address_from: string;
    address_to: string;
    id: number;
    is_canceled: boolean;
    cancel_date: string;
    isMax: boolean;
    withdrawn: number;
    currency: string;
    new_cancel?: boolean;
    block_date: string;
    tx: string;
    receiver_cancel: boolean;
    sender_cancel: boolean;
};

const StreamingDetailsScreen = () => {
    const [item, setItem] = useState<null | item>(null);
    const router = useRouter();
    const {id} = router.query;
    const [connecting, setConnecting] = useState()
    const {data} = useSelector((state: { receive: any }) => state.receive);
    const {address} = useSelector((state: { user: any }) => state.user);

    function convertUTCDateToLocalDate(date: Date) {
        return new Date(
            date.getTime() - date.getTimezoneOffset() * 60 * 1000
        );
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (data.length === 0 && address) {
            dispatch(receiveData());
        }
    }, [address, dispatch, data.length]);

    useEffect(() => {
        if (data.length > 0) {
            const filtered_data = data.filter((item: any) => String(item.id) === id);
            if (filtered_data.length > 0) {
                setItem(filtered_data[0]);
            } else {
                router.push("/404");
            }
        }
    }, [data, id, router]);

    return (
        <>
            <Head>
                <title>ctrlX | stream details</title>
            </Head>
            <Container className="max-container px-2">
                <Header/>
                {!address ? (
                    connecting
                        ?
                        <div className="text-center warning_page">
                            <div className="warning_text">To get connection and data you should sign message</div>
                            <br/>
                            <SignInButton isSign={connecting} setIsSign={setConnecting}/>
                        </div>
                        :
                        <div className="text-center warning_page">
                            <div className="warning_text">To use the application you should connect wallet</div>
                            <br/>
                            {/*@ts-ignore*/}
                            <SignInButton isSign={connecting} setIsSign={setConnecting}/>
                        </div>
                ) : item ? (
                    <>
                        <StreamingCircle
                            start={process.env.NODE_ENV !== "production"
                                ? convertUTCDateToLocalDate(new Date(item.start_date))
                                : new Date(item.start_date)}
                            end={process.env.NODE_ENV !== "production"
                                ? convertUTCDateToLocalDate(new Date(item.end_date))
                                : new Date(item.end_date)}
                            amount={item.amount}
                            receiving={true}
                            address_from={item.address_from}
                            address_to={item.address_to}
                            withdrawn={item.withdrawn}
                            id={item.id}
                            isCanceled={item.is_canceled}
                            cancelDate={convertUTCDateToLocalDate(new Date(item.cancel_date))}
                            isMax={item.isMax}
                            currency={item.currency}
                            newCancel={item.new_cancel}
                            cancelable={item.receiver_cancel}
                            cancelable2={{
                                sender: item.sender_cancel,
                                receiver: item.receiver_cancel,
                            }}
                            blockTime={convertUTCDateToLocalDate(new Date(item.block_date))}
                            tx={item.tx}
                        />
                    </>
                ) : null}
            </Container>
        </>
    );
};

export default StreamingDetailsScreen;
