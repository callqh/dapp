'use client';
import { createConfig, http, injected } from 'wagmi';
import { connect, getBalance } from 'wagmi/actions';
import { mainnet, megaethTestnet } from 'wagmi/chains';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export default () => {
  const [accountBalance, setAccountBalance] = useState<Awaited<ReturnType<typeof getBalance>> | undefined>();

  const config = createConfig({
    chains: [mainnet, megaethTestnet],
    transports: {
      [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
      [megaethTestnet.id]: http(megaethTestnet.rpcUrls.default.http[0]),
    },
    ssr: true,
  });
  const { mutate,data,isPending } = useMutation({
    mutationFn: connectWallet,
    onError: (error) => {
      alert(error);
    }
  })
  console.log(data)

  async function getBalanceOf(address?: Parameters<typeof getBalance>[1]['address']){
    if (!address) return console.warn('config is required');
    console.log('get balance');
    const result = await getBalance(config,{address, chainId:megaethTestnet.id});
    console.log('get balance',result);
    setAccountBalance(result)
    return result
  }

  async function connectWallet() {
    if (!config) return console.warn('config is required');
    console.log('connect wallet');
    const result = await connect(config, { connector: injected(),chainId:megaethTestnet.id });
    return result
  }

  return (
    <div>
      {/*connect wallet*/}
      <div className='text-gray-500 mb-1'>
          <p>{data?.accounts[0]}</p>
          <p>{accountBalance?.decimals}</p>
          <p>{accountBalance?.value}</p>
          <p>{accountBalance?.formatted}</p>
          <p>{accountBalance?.symbol}</p>
      </div>
      <Button className='mr-1' disabled={isPending} onClick={() => mutate()}>Connect Wallet{isPending ? '...' : ''}</Button>
      <Button disabled={!data} onClick={() => getBalanceOf(data?.accounts[0])}>Get balance</Button>
    </div>
  );
};
