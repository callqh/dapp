"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';

export default ()=>{
  const [transactionHash, setTransactionHash] = useState('');

  const addRecentTranscation = useAddRecentTransaction();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionHash(e.target.value);
  };

  return <>
      <div className='flex justify-center gap-1 '>
        <Input style={{width: 400}} onChange={handleInputChange} placeholder='Please enter the transaction hash'/>
        <Button
          onClick={() => {
          addRecentTranscation({
            // transactionhash not accountid
            hash: transactionHash,
            description: transactionHash.slice(0, 10),
          });
        }}>
          Add
        </Button>
      </div>
  </>
}
