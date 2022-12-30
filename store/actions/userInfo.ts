import axios from "axios";
import account from "../../blockChain/accounts";
import getFee from "../../blockChain/fee";
import Cookies from "universal-cookie";
import {
    BALANCE_FAIL,
    BALANCE_LOADING,
    BALANCE_UPDATE,
    RECEIVE_DATA_UPDATE,
    RECEIVE_DATA_FAIL,
    RECEIVE_DATA_LOADING,
    STREAM_DATA_FAIL,
    STREAM_DATA_LOADING,
    STREAM_DATA_UPDATE,
    HISTORY_DETAILS_SUCCESS,
    HISTORY_DETAILS_FAIL,
    HISTORY_DETAILS_LOADING,
    UPDATE_CONTRACT_FEE,
} from "../constrains/userInfo";

export const sendFormInformation = (currency: string, address: any, provider: any) => async (dispatch: any, getState: any) => {
    dispatch({type: BALANCE_LOADING});
    try {
        const balance = await account(currency, address, provider);
        dispatch({type: BALANCE_UPDATE, payload: balance});
    } catch (err) {
        dispatch({type: BALANCE_FAIL});
    }
};

export const receiveData = () => async (dispatch: any, getState: any) => {
    try {
        dispatch({type: RECEIVE_DATA_LOADING});
        const {address} = getState().user;
        const cookie = new Cookies();
        const token = cookie.get("token");

        const {data} = await axios.get(`/api/receiving/${address}`, {
            headers: {authorization: `bearer ${token}`},
        });
        if (data.data) {
            dispatch({type: RECEIVE_DATA_UPDATE, payload: data.data});
        } else {
            throw new Error("database err");
        }
    } catch (err) {
        dispatch({type: RECEIVE_DATA_FAIL});
    }
};

export const streamData = () => async (dispatch: any, getState: any) => {
    try {
        dispatch({type: STREAM_DATA_LOADING});
        const cookie = new Cookies();
        const token = cookie.get("token");
        const {address} = getState().user;
        const {data} = await axios.get(`/api/streaming/${address}`, {
            headers: {authorization: `bearer ${token}`},
        });
        if (data.data) {
            dispatch({type: STREAM_DATA_UPDATE, payload: data.data});
        } else {
            throw new Error("database err");
        }
    } catch (err) {
        dispatch({type: STREAM_DATA_FAIL});
    }
};

export const historyDetails =
    (id: number, addressFrom: string, addressTo: string) => async (dispatch: any) => {
        try {
            dispatch({
                type: HISTORY_DETAILS_LOADING,
                payload: {id},
            });

            const cookie = new Cookies();
            const token = cookie.get("token");
            const {data} = await axios.get(`/api/withdrawl/${id}?from=${addressFrom}&to=${addressTo}`, {
                headers: {authorization: `bearer ${token}`},
            });
            dispatch({
                type: HISTORY_DETAILS_SUCCESS,
                payload: {id, data},
            });
        } catch (err) {
            dispatch({
                type: HISTORY_DETAILS_FAIL,
                payload: {id},
            });
        }
    };

export const updateFee = () => async (dispatch: Function) => {
    const value = await getFee();
    dispatch({type: UPDATE_CONTRACT_FEE, payload: value});
};
