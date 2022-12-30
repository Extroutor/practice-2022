import {ethers} from "ethers";
import axios from "axios";
import {streamData} from "../store/actions/userInfo";

import {
  daiAddress,
  daiAbi,
  contractAddress,
  contractABI,
} from "./constrains";

import Cookies from "universal-cookie";
import {prepareWriteContract, writeContract, watchContractEvent, getProvider} from "@wagmi/core";
import {fetchSigner} from '@wagmi/core'


export const startStream = async (
    recipient: string,
    address_from: string,
    daiAmount: number,
    currency: string,
    minute: number,
    hour: number,
    day: number,
    year: number,
    startDateTime: Date | number,
    selectStart: boolean,
    blockRange: number,
    selectBlock: boolean,
    selectCancelSender: boolean,
    selectCancelReceiver: boolean,
    socket: any,
    fee: any,
    dispatch: Function,
    setShow: Function,
    setAmount: Function,
    setAddress: Function,
    setHours: Function,
    setYears: Function,
    setDays: Function,
    setMinutes: Function,
    setLoading: Function,
    setStartDate: Function,
    setStartTime: Function,
    setStartDateTime: Function,
    setSelectCancelSender: Function,
    setSelectCancelReceiver: Function,
    setBlockDateTime: Function,
    setSelectBlock: Function,
    setSelectStart: Function,
    router: any,
) => {
  try {
    setLoading(true);
    console.log('recipient', recipient)

    let dai = ethers.utils.parseUnits(`${daiAmount * (1 + fee)}`, 18);


    console.log('2: dai = ', dai)

    const daiConfig = await prepareWriteContract({
      address: daiAddress,
      abi: daiAbi,
      functionName: 'approve',
      args: [contractAddress, dai],
    })

    const approve = await writeContract(daiConfig)

    console.log('3: approve = ', approve)

    await approve.wait();

    const startTime = Number(Date.now()) + 60000;
    // const startTime = Number(Date.now()) + 10000;

    console.log('4: startTime = ', startTime)

    const stopTime = Math.floor(
        ((selectStart ? Number(startDateTime) : Number(startTime)) +
            60000 * Number(minute) +
            3600000 * Number(hour) +
            86400000 * Number(day) +
            31556926000 * Number(year)) /
        1000
    );

    console.log('5: stopTime = ', stopTime)

    const startStreamTime = selectStart
        ? Math.floor(Number(startDateTime) / 1000)
        : Math.floor(Number(startTime) / 1000);

    console.log('6: startStreamTime = ', startStreamTime)

    let contractConfig
    console.log('recipient', recipient)
    console.log('dai', dai)
    console.log('daiAddress', daiAddress)
    console.log('selectStart', selectStart ? startStreamTime : 0)
    console.log('stopTime', stopTime)
    console.log('selectBlock', selectBlock ? Math.floor(
            Number(startStreamTime) +
            (Number(stopTime) - Number(startStreamTime)) *
            (blockRange / daiAmount)
        )
        : 0)
    console.log('Number(selectCancelSender)', Number(selectCancelSender))
    console.log('Number(selectCancelReceiver)', Number(selectCancelReceiver))

    await prepareWriteContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'createStream',
      args: [
        recipient,
        dai,
        daiAddress,
        selectStart ? startStreamTime : 0,
        stopTime,
        selectBlock
            ? Math.floor(
                Number(startStreamTime) +
                (Number(stopTime) - Number(startStreamTime)) *
                (blockRange / daiAmount)
            )
            : 0,
        Number(selectCancelSender),
        Number(selectCancelReceiver)
      ],
    }).then((value) => {
      contractConfig = value
    }).catch((err) => {
      console.log(err)
    })

    console.log('Конфиг контракта', contractConfig)


    // @ts-ignore
    const tx = await writeContract(contractConfig)

    console.log('7: Написание контракта, tx = ', tx)

    watchContractEvent({
          address: contractAddress,
          abi: contractABI,
          eventName: 'CreateStream'
        }, (
            streamId,
            sender,
            recipient,
            deposit,
            tokenAddress,
            startTime,
            stopTime,
            blockTime,
            senderCancel,
            recipientCancel
        ) => {
          console.log('8: Мы внутри эвента')

          const id = parseInt(streamId._hex);
          const startPoint = parseInt(startTime._hex) * 1000;
          const endPoint = parseInt(stopTime._hex) * 1000;
          const blockPoint = parseInt(blockTime._hex) * 1000;

          const cookie = new Cookies();
          const token = cookie.get("token");

          axios.post(
              "/api/new_stream",
              {
                start: startPoint,
                end: endPoint,
                block: blockPoint,
                id,
                address_from: sender,
                address_to: recipient,
                amount: daiAmount,
                currency,
                tx: tx.hash,
                sender_cancel: senderCancel,
                receiver_cancel: recipientCancel,
              },
              {
                headers: {
                  authorization: `bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
          ).then(async (results) => {
            if (results.status === 201) {
              dispatch(streamData());
              setAddress("");
              setAmount(0);
              setDays(0);
              setMinutes(0);
              setHours(0);
              setYears(0);
              setStartDate(null);
              setStartDateTime(null);
              setStartTime(null);
              setShow(false);
              setSelectCancelSender(true);
              setSelectCancelReceiver(true);
              setBlockDateTime(null);
              setSelectBlock(false);
              setSelectStart(false);
              if (socket) socket.emit("newStream", `${recipient}`);

              setLoading(false);
              if (router.push) router.push("/streams");
            }
          }).catch((err) => {
                setLoading(false);
                console.log(err)
              }
          )
        }
    )
  } catch
      (err) {
    setLoading(false)
  }
}
