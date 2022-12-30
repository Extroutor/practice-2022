import type {AppProps} from "next/app";
import store from "../store";
import {Provider} from "react-redux";
import {chain, WagmiConfig} from "wagmi";
import "../styles/custom.scss";
import "../styles/streaming.scss";
import "../styles/page_404.scss";
import "../styles/streamingDetails.scss";
import "../styles/extension.scss";

import Head from "next/head";
import {wagmiClient} from "../wagmiConfig";
import {Web3Modal} from "@web3modal/react";
import {EthereumClient} from "@web3modal/ethereum";

function MyApp({Component, pageProps}: AppProps) {
    const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];
    const ethereumClient = new EthereumClient(wagmiClient, chains);

    return (
        <Provider store={store}>
            <WagmiConfig client={wagmiClient}>
                <Component {...pageProps} />
            </WagmiConfig>
            <Web3Modal
                projectId="d9210d7f507ad22b39b14475b3c9797e"
                theme="dark"
                accentColor="default"
                ethereumClient={ethereumClient}
            />
        </Provider>
    );
}

export default MyApp;
