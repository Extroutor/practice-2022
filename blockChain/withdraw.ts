import axios from "axios";
import {ethers} from "ethers";
import {STREAM_WITHDRAWN_UPDATE} from "../store/constrains/userInfo";
import {contractAddress, contractABI} from "./constrains";
import Cookies from "universal-cookie";
import {prepareWriteContract, watchContractEvent, writeContract} from "@wagmi/core";
import {streamData} from "../store/actions/userInfo";

const withdraw = async (
    streamId: number,
    balance: number,
    setLoading: Function,
    socket: any,
    address: string,
    address_to: string,
    amount: number,
    dispatch: Function,
    setShowModal: Function,
    setVal: Function,
    limit: string,
    setLimit: Function,
    fee: number
) => {
    try {
        setLoading(true);
        console.log("balance", balance)
        console.log("address", address)
        console.log("address_to", address_to)
        console.log("amount", amount)
        console.log("limit", limit)
        console.log("fee", fee)

        const limitBigNumber = BigInt(limit);
        const streamWithdrawn = BigInt(`${balance * 10 ** 18}`);

        console.log("streamWithdrawn", streamWithdrawn)

        const withdrawAmount = streamWithdrawn > limitBigNumber ? limitBigNumber : streamWithdrawn;

        console.log("withdrawAmount", withdrawAmount)
        console.log("${withdrawAmount}", `${withdrawAmount}`)

        let contractConfig
        await prepareWriteContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'withdrawFromStream',
            args: [
                streamId,
                `${withdrawAmount}`
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

        const cookie = new Cookies();
        const token = cookie.get("token");

        watchContractEvent({
            address: contractAddress,
            abi: contractABI,
            eventName: 'WithdrawFromStream'
        }, (
            streamId_data,
            recipient,
            withdrawnValue,
            event
        ) => {
            console.log('В эвенте')
            axios
                .post(
                    `/api/withdrawl`,
                    {
                        address_from: address,
                        id: streamId,
                        address_to,
                        amount: balance,
                    },
                    {headers: {authorization: `bearer ${token}`, "Content-Type": "application/json"}}
                )
                .then((res) => {

                    console.log('Получилось добавить на сервер')

                    socket.emit("withdraw", {address, id: streamId});

                    dispatch({
                        type: STREAM_WITHDRAWN_UPDATE,
                        payload: {
                            id: streamId,
                            withdrawn: (Number(balance) / Number(amount)),
                        },
                    });

                    setLoading(false);
                    setShowModal(false);
                    setVal(0);
                    setLimit("0");
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        });
    } catch (err) {
        console.log(err);
        setLoading(false);
    }
}

export default withdraw;
