import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, megaethTestnet, optimism, polygon, sepolia } from 'wagmi/chains'


export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, megaethTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
