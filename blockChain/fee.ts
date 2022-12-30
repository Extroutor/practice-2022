import { ethers } from "ethers";
import {contractABI, contractAddress} from "./constrains";
import {readContract} from "@wagmi/core";

const getFee = async () => {
  try {
    const fee = await readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'fee',
    })
    // @ts-ignore
    return Number(fee._hex) / 10 ** 4;
  } catch (err) {
    console.log(err);
  }
};

export default getFee;
