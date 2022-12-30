import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import socketIOClient from "socket.io-client";
import Link from "next/link";
import {CycloneSymbol} from "./icons/CycloneSymbol";
import {
    SET_SOCKET,
    NEW_SOCKET_STREAM,
    WITHDRAW_SOCKET_STREAM,
    CANCEL_SOCKET_STREAM,
} from "../store/constrains/userInfo";
import {updateFee} from "../store/actions/userInfo";
import {signInHandler} from "../helper/signInHandler";
import UserInformation from "./UserInformation";
import st from './../styles/header.module.scss'
import {VscMenu} from "react-icons/vsc";
import {AiOutlineClose} from "react-icons/ai";
import {useConnect, useProvider, useSigner} from "wagmi";

type props = {
    active?: string;
};

const Header = ({active}: props) => {
    const {address} = useSelector((state: { user: any }) => state.user);
    const {socket: oldSocket} = useSelector((state: { socket: any }) => state.socket);
    const dispatch = useDispatch();
    let [activeMenu, setActiveMenu] = useState(false)
    const {connectors, connectAsync} = useConnect()

    useEffect(() => {
        if (address) {
            const socket = socketIOClient();
            if (oldSocket) oldSocket.close();
            dispatch({type: SET_SOCKET, payload: socket});

            socket.on(`newReceive:${address}`, (data: any) => {
                dispatch({type: NEW_SOCKET_STREAM, payload: data});
            });

            socket.on(`newWithdrawal:${address}`, (data: any) => {
                console.log(data);
                dispatch({type: WITHDRAW_SOCKET_STREAM, payload: data});
            });

            socket.on(`newCanceled:${address}`, (data: any) => {
                dispatch({type: CANCEL_SOCKET_STREAM, payload: data});
            });
        }
        return () => oldSocket?.close();
    }, [address, dispatch]);

    useEffect(() => {
        dispatch(updateFee());
    }, [dispatch]);
    // const {data: signer} = useSigner()
    // const provider = useProvider()
    // const handelAccountChanged = async () => {
    //     await signInHandler(dispatch, provider, signer, connector, connectAsync);
    // };

    // useEffect(() => {
    //     //@ts-ignore
    //
    //     if (global.ethereum) {
    //         //@ts-ignore
    //         global.ethereum.removeListener("accountsChanged", handelAccountChanged);
    //         //@ts-ignore
    //         global.ethereum.on("accountsChanged", handelAccountChanged);
    //         // @ts-ignore
    //         // global.ethereum.on("chainChanged", () => {
    //         //   signinHanlder();
    //         // });
    //         // @ts-ignore
    //         global.ethereum.on("disconnected", () => {
    //             // @ts-ignore
    //             global.ethereum.removeListener("accountsChanged", handelAccountChanged);
    //         });
    //     }
    // }, []);

    // @ts-ignore
    return (
        <div className={st.header}>
            <div className={st.header_wrapper}>
                <Link href="/">
                    <div className={st.logo}>
                        <CycloneSymbol
                            height={(115.52 * 30) / 100}
                            width={(259.3 * 30) / 100}
                            fill="white"
                            className="mx-2 mb-1"
                        />
                    </div>
                </Link>
                <div className={st.header_nav}>
                    <div
                        className={active === "FAQ" ? st.text_nav_white : st.text_nav_gray}
                    >
                        <Link href="/faq">
                            <div className={st.header_nav_content}>FAQ</div>
                        </Link>
                    </div>

                    <div
                        className={active === "user manual" ? st.text_nav_white : st.text_nav_gray}
                    >
                        <Link href="/manual">
                            <div className={st.header_nav_content}>User Manual</div>
                        </Link>
                    </div>

                    <div
                        className={active === "streams" ? st.text_nav_white : st.text_nav_gray}
                    >
                        <Link href="/streams">
                            <div className={st.header_nav_content}>Streams</div>
                        </Link>
                    </div>
                </div>
                <div className={st.burger_wrap}>
                    {activeMenu
                        ?
                        <AiOutlineClose
                            className={st.close}
                            onClick={() => setActiveMenu(!activeMenu)}
                        />
                        :
                        <VscMenu
                            className={st.burger}
                            onClick={() => setActiveMenu(!activeMenu)}
                        />
                    }
                </div>
                {address
                    ?
                    <div className='user_info'>
                        <UserInformation/>
                    </div>
                    :
                    <></>
                }


            </div>
            <MenuBurger
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
            />
        </div>
    );
};

type props2 = {
    activeMenu?: boolean;
    setActiveMenu: Function
};

const MenuBurger = ({activeMenu, setActiveMenu}: props2) => {
    return (
        <div
            className={activeMenu ? st.active_menu : st.menu}
            onClick={() => setActiveMenu(false)}>
            <div className={st.menu__wrap}>
                <ul className={st.ul}>
                    <Link href='/'>
                        <li className={st.li}>Main</li>
                    </Link>
                    <Link href='/faq'>
                        <li className={st.li}> FAQ</li>
                    </Link>
                    <Link href='/manual'>
                        <li className={st.li}> User manual</li>
                    </Link>
                    <Link href='/streams'>
                        <li className={st.li}> Streams</li>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default Header;
