import {nicknameContractABI, nicknameContractAddress} from "./constrains";
import Cookie from "universal-cookie";
import {UPDATE_USER_IDENTIFIER} from "../store/constrains/userInfo";
import {readContract, writeContract, prepareWriteContract} from '@wagmi/core'

const cookie = new Cookie();

export const setNickname = async (
    address: string,
    nickname: string,
    setLoading: Function,
    setValAvailable: Function,
    setEditing: Function,
    dispatch: Function,
    setErr: Function,
    setShowModal: Function,
) => {
    try {
        setLoading(true);
        const config = await prepareWriteContract({
            address: nicknameContractAddress,
            abi: nicknameContractABI,
            functionName: 'setNick',
            args: [nickname],
        })
        const data = await writeContract(config)
        console.log('data', data)
        console.log('После writeContract')
        const cookie = new Cookie();
        cookie.set("nickname", nickname, {
            path: "/",
            maxAge: 60 * 60,
            secure: true,
            sameSite: "strict",
        });
        setLoading(false);
        setValAvailable(3);
        setEditing(false);
        dispatch({type: UPDATE_USER_IDENTIFIER, payload: nickname});
        setShowModal(false)
    } catch (err) {
        setLoading(false);
        console.log(err)
        setErr("Error when trying to update the username, please try again later.")
    }
}

export const getNicknameByAddress = async (
    address: string,
    setLoading: Function,
    setErr: Function,
) => {
    try {
        setLoading(true);
        // @ts-ignore
        const nickname = await readContract({
            address: nicknameContractAddress,
            abi: nicknameContractABI,
            functionName: 'addrNick',
            args: [address],
        }).catch((err) => {
            setLoading(false);
            setErr("")
            console.log(err)
            return 1
        })
        if (!nickname) {
            setErr('User doesn\'t have a nickname :(')
            setLoading(false);
            return 2
        }
        setLoading(false);
        return nickname
    } catch (err) {
        setLoading(false);
        setErr("Error when trying to get the username, please try again later.")
        console.log(err)
    }
}

export const getAddressByNickname = async (
    nickname: string,
) => {
    try {
        return await readContract({
            address: nicknameContractAddress,
            abi: nicknameContractABI,
            functionName: 'nickAddr',
            args: [nickname],
        })
    } catch (err) {
        console.log(err)
    }
}

export async function getUserNickName(
    address: string,
) {
    try {
        let nick = await readContract({
            address: nicknameContractAddress,
            abi: nicknameContractABI,
            functionName: 'addrNick',
            args: [address],
        })
        cookie.set("nickname", nick, {
            path: "/",
            maxAge: 60 * 60,
            sameSite: "strict",
            secure: true,
        });
    } catch (err) {
        console.log(err)
    }
}

export const changeNickname = async (
    oldNickname: string,
    newNickName: string,
    setLoading: Function,
    setValAvailable: Function,
    setEditing: Function,
    dispatch: Function,
    setErr: Function,
    setShowModal: Function,
) => {
    try {
        setLoading(true);
        const config = await prepareWriteContract({
            address: nicknameContractAddress,
            abi: nicknameContractABI,
            functionName: 'changeNick',
            args: [oldNickname, newNickName],
        })
        await writeContract(config)
        const cookie = new Cookie();
        cookie.set("nickname", newNickName, {
            path: "/",
            maxAge: 60 * 60,
            secure: true,
            sameSite: "strict",
        });
        setLoading(false);
        setValAvailable(3);
        setEditing(false);
        dispatch({type: UPDATE_USER_IDENTIFIER, payload: newNickName});
        setShowModal(false)
    } catch (err) {
        setLoading(false);
        console.log(err)
        setErr("Error when trying to update the username, please try again later.")
    }
}

