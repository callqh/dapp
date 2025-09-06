"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConnectButton, useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useState } from 'react';


export default  () => {
  const [transactionHash, setTransactionHash] = useState('');

  const addRecentTranscation = useAddRecentTransaction();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionHash(e.target.value);
  };

  return (
    <>
      <div className='w-full p-1'>
        <ConnectButton chainStatus='icon' accountStatus="avatar" />
        <div className='flex justify-start gap-1 mt-10'>
          <Input style={{width: 400}} onChange={handleInputChange} placeholder='Please enter the transaction hash'/>
          <Button
            onClick={() => {
            addRecentTranscation({
              // transactionhash not accountid
              hash: transactionHash,
              description: transactionHash.slice(0, 10),
            });
          }}>
            Add Recent Transaction
          </Button>
        </div>
      </div>
      <div className='mt-[20px]'>
        <p>
          展示余额=1
        </p>
      </div>

    </>
  );
};
