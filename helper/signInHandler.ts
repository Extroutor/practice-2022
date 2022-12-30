import axios from "axios";
import {updateFee} from "../store/actions/userInfo";
import {
    UPDATE_USER_IDENTIFIER_ADDRESS,
} from "../store/constrains/userInfo";
import Cookie from "universal-cookie";
import {getUserNickName} from "../blockChain/nickname";

export const signInHandler = async (
    dispatch: any,
    provider: any,
    signer: any,
    connector: any,
    connectAsync: Function,
    setAddr: any,
) => {
    // @ts-ignore
    connectAsync({connector}).then(async ({account: account}) => {
        setAddr(account)
    }).catch((err: any) => {
        console.log(err)
    });
}

export const signMessageHandler = async (
    dispatch: any,
    provider: any,
    account: any,
    signMessageAsync: Function,
) => {
    if (provider) {
        const cookie = new Cookie();
        cookie.remove("nickname");
        cookie.remove("token");
        cookie.remove("userAddress");
        try {
            //@ts-ignore
            const {data: nonce_data} = await axios.get(`/api/auth/user/${account}`);
            const nonce = nonce_data.nonce;
            const message = `signing message with one time nonce: ${nonce}`
            const signature = await signMessageAsync({message})

            //@ts-ignore
            const {data: token} = await axios.put("/api/auth/user/signature", {
                signature,
                address: account
            });

            cookie.set("token", token.token, {
                path: "/",
                maxAge: 60 * 60 * 24,
                sameSite: "strict",
                secure: true,
            });

            await dispatch(updateFee());

            cookie.set("userAddress", account, {
                path: "/",
                maxAge: 60 * 60,
                sameSite: "strict",
                secure: true,
            });

            try {
                await getUserNickName(account).then(async () => {
                    let nick = cookie.get('nickname')
                    if (nick) {
                        await dispatch({
                            type: UPDATE_USER_IDENTIFIER_ADDRESS,
                            payload: {nickName: nick, address: account},
                        });
                    } else {
                        await dispatch({
                            type: UPDATE_USER_IDENTIFIER_ADDRESS,
                            payload: {nickName: null, address: account},
                        });
                    }
                })
            } catch (err) {
                console.log(err);
                dispatch({
                    type: UPDATE_USER_IDENTIFIER_ADDRESS,
                    payload: {nickName: null, address: account},
                });
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log('Error with provider')
    }
}
