import { ethers } from "ethers";
import {contractABI, contractAddress, nicknameContractABI, nicknameContractAddress} from "./constrains";
import {readContract} from "@wagmi/core";

const getBalance = async (
    streamId: number,
    address: string,
    amount: number,
    setLimit: Function
) => {
  //@ts-ignore
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  //Разворачиваем контракт с кодом
  // const contractStream = new ethers.Contract(
  //   contractAddress,
  //   contractABI,
  //   provider
  // );
  // const balance = await contractStream.balanceOf(streamId, address);
  let balance = await readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [streamId, address],
  })
  // const limit = BigInt(amount * 10 ** 18) - BigInt(balance._hex);
  // @ts-ignore
  const limit = BigInt(balance._hex);
  setLimit(limit);
  console.log("limit", limit)
  console.log("balance", balance)
};

export default getBalance;

