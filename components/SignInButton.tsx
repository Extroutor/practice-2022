import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "universal-cookie";
import {ADDRESS_UPDATE, EXTENSION_UPDATE, UPDATE_USER_IDENTIFIER} from "../store/constrains/userInfo";
// @ts-ignore
import {signInHandler, signMessageHandler} from "../helper/signInHandler";
import {
    Connector,
    useConnect, useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useProvider,
    useSigner,
    useSignMessage
} from "wagmi";
import {disconnect} from "@wagmi/core";
import {nicknameContractABI, nicknameContractAddress} from "../blockChain/constrains";

type props = {
    isSign: boolean,
    setIsSign: any
};

// @ts-ignore
const SignInButton = ({isSign, setIsSign}: props) => {
    const dispatch = useDispatch();
    const {address} = useSelector((state: { user: any }) => state.user);
    const cookie = useMemo(() => new Cookie(), []);
    const {connectors, connectAsync} = useConnect()
    const [addr, setAddr] = useState()
    const {signMessageAsync} = useSignMessage()
    const [filteredConnectors, setFilteredConnectors] = useState([Connector])

    useEffect(() => {
        const addressCookie = cookie.get("userAddress");
        const nicknameCookie = cookie.get("nickname");

        dispatch({type: ADDRESS_UPDATE, payload: addressCookie});
        if (nicknameCookie) {
            dispatch({type: UPDATE_USER_IDENTIFIER, payload: nicknameCookie});
        }
    }, [address]);

    useEffect(() => {
        let uagent = navigator.userAgent.toLowerCase();
        if ((uagent.search("windows") > -1) || (uagent.search("macintosh") > -1) || (uagent.search("linux") > -1)) {
            // @ts-ignore
            setFilteredConnectors(connectors)

        } else {
            // @ts-ignore
            setFilteredConnectors(connectors.filter((item) =>
                (item.id !== 'metaMask') && (item.id !== 'injected')))
        }
    }, [])

    const {data: signer} = useSigner()
    const provider = useProvider()

    const handleWalletConnect = async (connector: any) => {
        await disconnect().then(async () => {
            await signInHandler(
                dispatch,
                provider,
                signer,
                connector,
                connectAsync,
                setAddr,
            ).then(() => {
                setIsSign(true)
            })
            dispatch({type: EXTENSION_UPDATE, payload: connector})
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleSignMessage = async () => {
        await signMessageHandler(
            dispatch,
            provider,
            addr,
            signMessageAsync,
        )
    }

    if (isSign) {
        return <button
            className="warning_button"
            onClick={handleSignMessage}
        >
            Sign message
        </button>
    }

    return (
        <div
            style={{display: 'flex', flexDirection: "row", flexWrap: 'wrap', width: '250px', justifyContent: "center"}}>
            {filteredConnectors.map((connector, index): any => {
                return <button
                    // @ts-ignore
                    // key={connector.id}
                    key={index}
                    className="warning_button"
                    onClick={() => handleWalletConnect(connector)}
                >
                    {connector.name}
                </button>
            })}
        </div>
    )
}

export default SignInButton;
