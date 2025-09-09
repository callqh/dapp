'use client';
import { useEffect } from 'react';
import { createConfig, http, injected } from 'wagmi';
import { connect } from 'wagmi/actions';
import { mainnet } from 'wagmi/chains';
import { Button } from './ui/button';

export default () => {
  const config = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    },
    ssr: true,
  });

  async function connectWallet(config: ReturnType<typeof createConfig>) {
    if (!config) return console.warn('config is required');
    console.log('connect wallet');
    const result = await connect(config, { connector: injected() });
    console.log('result', result);
  }

  return (
    <div>
      {/*connect wallet*/}
      <Button>Connect Wallet</Button>
    </div>
  );
};
