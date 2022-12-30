import {getAddressByNickname} from "../blockChain/nickname";

export const searchNickname = async (name: string) => {
    if (name === "") {
        return "";
    } else {
        const res = await getAddressByNickname(name);
        if (res === '0x0000000000000000000000000000000000000000') {
            return "";
        } else {
            return 2
        }
    }
};
