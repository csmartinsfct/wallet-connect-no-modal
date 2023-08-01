import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import useInitialization from '@/hooks/useInitialization'
import useWalletConnectEventsManager from '@/hooks/useWalletConnectEventsManager'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { AppProps } from 'next/app'
import '../../public/main.css'
import { useWeb3Modal, Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

const { chains, publicClient } = configureChains(
  [mainnet],
  [w3mProvider({ projectId }), publicProvider()]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors: w3mConnectors({ projectId, chains })
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function App({ Component, pageProps }: AppProps) {
  const { open } = useWeb3Modal()

  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization()

  // Step 2 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager(initialized)

  // render app
  return (
    <NextUIProvider theme={createTheme({ type: 'dark' })}>
      <WagmiConfig config={wagmiConfig}>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        <Layout initialized={initialized}>
          <button style={{ background: '#000000' }} onClick={open}>
            OPEN MODAL
          </button>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
      <Modal />
    </NextUIProvider>
  )
}
