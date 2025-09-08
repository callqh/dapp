"use client";
import { LoadingText } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

export default ()=>{
  const [address, setAddress] = useState<Address|undefined>(undefined);
  const account = useAccount();
  const {data: balanceData,isLoading} = useBalance({
    // address: account.address,
    query: {
      enabled: !!account.address,
    },
  });

  const {data: balanceData2,isLoading:isLoading2,refetch} = useBalance({
    address: address,
    query: {
      enabled: false,
    },
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value as Address);
  };

  return (
    <div>
      <div>
        <h1 className="font-bold">Current Account Address:</h1> <p className="text-gray-500 text-[12px]">{account.address}</p>
        <h1 className="font-bold">Current Account ChainId:</h1> <p className="text-gray-500 text-[12px]">{account.chainId}</p>
        <br></br>
        <h1 className="font-bold">Balance:</h1> <LoadingText loading={isLoading} text={balanceData?.formatted} />
        {/* get the balance of account*/}
        <div>
          <h1 className="font-bold">Get the Balance of Account:</h1>
          <div className="flex gap-1">
            <Input placeholder="Please enter the account address" onChange={handleAddressChange}></Input>
            <Button onClick={()=>refetch()}>Get</Button>
          </div>
          <div>
            <LoadingText label="Formatted"   loading={isLoading2} text={balanceData2?.formatted} />
            <LoadingText label="Symbol" loading={isLoading2} text={balanceData2?.symbol} />
            <LoadingText label="Decimals" loading={isLoading2} text={balanceData2?.decimals} />
            <LoadingText label="Value" loading={isLoading2} text={balanceData2?.value} />
          </div>
        </div>
      </div>
    </div>
  );
}
