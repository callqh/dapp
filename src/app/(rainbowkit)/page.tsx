'use client';
import { ConnectButton, useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default () => {
  const [transactionHash, setTransactionHash] = useState('');
  const account = useAccount();

  const addRecentTranscation = useAddRecentTransaction();

  // const {data: balanceData,isLoading} = useBalance({
  //   // address: account.address,
  //   query: {
  //     enabled: !!account.address,
  //   },
  // });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionHash(e.target.value);
  };

  return (
    <div>
      <ConnectButton chainStatus='name' accountStatus='avatar' showBalance={false} />
      <div className='p-2'>
        <h1 className='font-bold'>Current Account Address:</h1>{' '}
        <p className='text-gray-500 text-[12px]'>{account.address}</p>
        <h1 className='font-bold'>Current Account ChainId:</h1>{' '}
        <p className='text-gray-500 text-[12px]'>{account.chainId}</p>
        <br></br>
      </div>
      <div className='flex'>
        <Input
          style={{ width: 400 }}
          onChange={handleInputChange}
          placeholder='Please enter the transaction hash'
        />
        <Button
          onClick={() => {
            addRecentTranscation({
              // transactionhash not accountid
              hash: transactionHash,
              description: transactionHash.slice(0, 10),
            });
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
