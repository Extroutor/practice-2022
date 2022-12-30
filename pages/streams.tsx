import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {receiveData, streamData, updateFee} from "../store/actions/userInfo";
import {Button} from "react-bootstrap";
import SignInButton from "../components/SignInButton";
import StreamingLists from "../components/streamingListComponents/StreamingLists";
import StartStreamModal from "../components/streamingListComponents/SendMoneyFormModal";
import RequestingStreamModal from "../components/streamingListComponents/SendMoneyFormModal";
import {StartStreamBitSymbol} from "../components/icons/StartStream";
import Header from "../components/Header";
import Head from "next/head";
import UserInformation from "../components/UserInformation";
import CurrencyBuyModal from "../components/streamingListComponents/CurrancyBuyModal";

const StreamingScreen = () => {
    const [showModal, setShowModal] = useState(false);
    const [showRequestModal, setRequestShowModal] = useState(false);
    const [connecting, setConnecting] = useState()
    const dispatch = useDispatch();
    const {address} = useSelector((state: { user: any }) => state.user);

    const {
        data: receivingData,
        loading: receiveLoading,
        error: receiveErr,
    } = useSelector((state: { receive: any }) => state.receive);

    const {
        data: streamingData,
        loading: streamLoading,
        error: streamErr,
    } = useSelector((state: any) => state.stream);

    useEffect(() => {
        if (
            address &&
            (streamingData.length === 0 ||
                (streamingData[0] && streamingData[0].address_from !== address))
        ) {
            dispatch(streamData());
        }
        if (
            address &&
            (receivingData.length === 0 || (receivingData[0] && receivingData[0].address_to !== address))
        ) {
            dispatch(receiveData());
        }
    }, [address, dispatch]);

    useEffect(() => {
        dispatch(updateFee());
    }, [address]);
    return (
        <>
            <Head>
                <title>ctrlX | streams</title>
            </Head>
            <Header active="streams"/>
            <div className="max-container">
                <div>
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
                    ) : (
                        <div>
                            <div className='user_info_mobile'>
                                <UserInformation/>
                            </div>
                            <div className='button__wrapper'>
                                <Button
                                    className="send-button"
                                    onClick={() => {
                                        //@ts-ignore
                                        const y = window.top.outerHeight / 2 + window.top.screenY - 500 / 1.5;
                                        //@ts-ignore
                                        const x = window.top.outerWidth / 2 + window.top.screenX - 500 / 2;
                                        window.open(
                                            "https://exchange.mercuryo.io",
                                            "newwindow",
                                            `width=500,height=500,top=${y},left=${x}, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,`
                                        );
                                    }}
                                >
                                    <StartStreamBitSymbol
                                        fill="white"
                                        height={20}
                                        width={20}
                                        className="mx-2"
                                    />
                                    <div>Buy/Sell Cryptocurrency</div>
                                </Button>
                                <Button
                                    className="send-button"
                                    onClick={() => setRequestShowModal(true)}>
                                    <StartStreamBitSymbol
                                        fill="white"
                                        height={20}
                                        width={20}
                                        className="mx-2"
                                    />
                                    <div>Request Stream</div>
                                </Button>
                                <Button
                                    className="send-button"
                                    onClick={() => setShowModal(true)}>
                                    <StartStreamBitSymbol
                                        fill="white"
                                        height={20}
                                        width={20}
                                        className="mx-2"
                                    />
                                    <div>Start stream</div>
                                </Button>
                            </div>
                            <div>
                                <StreamingLists
                                    title="Sending"
                                    data={streamingData}
                                    error={streamErr}
                                    isLoading={streamLoading}
                                    receiving={false}
                                />
                                <StreamingLists
                                    title="Receiving"
                                    data={receivingData}
                                    error={receiveErr}
                                    isLoading={receiveLoading}
                                    receiving={true}
                                />
                                <StartStreamModal show={showModal} setShow={setShowModal}/>
                                <RequestingStreamModal
                                    show={showRequestModal}
                                    setShow={setRequestShowModal}
                                    requesting={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <CurrencyBuyModal/>
            </div>
        </>
    );
};

export default StreamingScreen;
