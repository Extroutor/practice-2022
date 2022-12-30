import {chain, configureChains, createClient} from "wagmi";
import {WalletConnectConnector} from "wagmi/connectors/walletConnect";
import {MetaMaskConnector} from "wagmi/connectors/metaMask";
import {publicProvider} from "wagmi/providers/public";
import {CoinbaseWalletConnector} from "wagmi/connectors/coinbaseWallet";
import {InjectedConnector} from "wagmi/connectors/injected";
import {infuraProvider} from "@wagmi/core/dist/providers/infura";
import {modalConnectors, walletConnectProvider} from "@web3modal/ethereum";

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const {provider, webSocketProvider} = configureChains([chain.polygon], [
    walletConnectProvider({projectId: "d9210d7f507ad22b39b14475b3c9797e"}),
    // publicProvider(),
]);

export const wagmiClient = createClient({
    // autoConnect: false,
    // // connectors: modalConnectors({appName: "web3Modal", chains}),
    // connectors:
    //     modalConnectors({ appName: "web3Modal", chains }),
    // //     [
    // //     new WalletConnectConnector({chains, options: {qrcode: true}}),
    // //     new MetaMaskConnector({chains, options: {
    // //         shimDisconnect:true,
    // //             UNSTABLE_shimOnConnectSelectAccount: true
    // //         }}),
    // //     // @ts-ignore
    // //     new CoinbaseWalletConnector({chains}),
    // //     new InjectedConnector({chains, options: { name: 'Injected'}}),
    // // ],
    // provider,
    // webSocketProvider
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({chains}),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'wagmi',
            },
        }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
});
