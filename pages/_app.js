import Head from "next/head"
import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit"

const APP_ID = 'uQPL8J0ugGNNWB5XolYRNbn00Oe5CHtBIF8sTctQ'
const SERVER_URL = 'https://9oefjqqytuwg.usemoralis.com:2053/server'

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Web3 fan</title>
                <meta name="description" content="Subscription service for content creators" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

                <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                    <NotificationProvider>
                        <Component {...pageProps} />
                    </NotificationProvider>
                </MoralisProvider>

        </div>
    )
}

export default MyApp