import { ethers } from "ethers";
import { coins } from "../constants/contracts";

const getAccount = async (currency: string, address: any, provider: any) => {
  const balance = await provider.getBalance(address);
  const balanceNumber = ethers.utils.formatEther(balance);
  const daiContract = new ethers.Contract(
      //@ts-ignore
      coins[currency].address,
      //@ts-ignore
      coins[currency].ABI,
      provider
  );
  const balanceDAI = await daiContract.balanceOf(address);
  const DAINumber = ethers.utils.formatEther(balanceDAI);
  return { [currency]: Number(DAINumber), ETH: Number(balanceNumber) };
};

export default getAccount;
