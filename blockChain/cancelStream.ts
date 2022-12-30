import axios from "axios";
import {ethers} from "ethers";
import Cookies from "universal-cookie";
import {streamData} from "../store/actions/userInfo";
import {contractAddress, contractABI, daiAddress} from "./constrains";
import {prepareWriteContract, watchContractEvent, writeContract} from "@wagmi/core";
import {getProvider} from '@wagmi/core'

const cancelStream = async (
    streamId: number,
    addressTo: string,
    addressFrom: string,
    setLoading: Function,
    socket: any,
    totalAmount: number,
    dispatch: Function
) => {
    try {
        setLoading(true);
        let contractConfig
        await prepareWriteContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'cancelStream',
            args: [
                streamId
            ],
        }).then((value) => {
            contractConfig = value
        }).catch((err) => {
            console.log(err)
        })

        console.log('Конфиг контракта', contractConfig)

        // @ts-ignore
        const tx = await writeContract(contractConfig)
        console.log('Написание контракта, tx = ', tx)

        const providerr = getProvider()
        console.log('provider', providerr)

        let timer = setInterval(async () => {
            const receipt = await providerr.getTransactionReceipt(tx.hash);
            console.log("receipt", receipt)
            if (receipt && receipt.status === 1) {
                watchContractEvent({
                        address: contractAddress,
                        abi: contractABI,
                        eventName: 'CancelStream'
                    }, (
                        streamIdTx,
                        sender,
                        recipient,
                        senderBalance,
                        recipientBalance
                    ) => {
                        const value = recipientBalance._hex / 10 ** 18 / totalAmount;
                        const cookie = new Cookies();
                        const token = cookie.get("token");

                        console.log('cancelationValue', value)

                        axios
                            .put(
                                "/api/cancel_stream",
                                {
                                    address_to: addressTo,
                                    id: streamId,
                                    cancelationValue: value,
                                    address_from: addressFrom,
                                    cancel_date: new Date(Date.now()).toLocaleString("en-GB"),
                                },
                                {
                                    headers: {authorization: `bearer ${token}`, "Content-Type": "application/json"},
                                }
                            ).then((res) => {
                            setLoading(false);
                            socket.emit("canceled", streamId);
                            dispatch(streamData());
                        }).catch((err) => {
                            setLoading(false);
                        });
                    }
                );
                clearInterval(timer);
            }
        }, 1000);
    } catch (err) {
        setLoading(false);
    }
};

export default cancelStream;
