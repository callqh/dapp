'use client'
import { useEffect } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { mainnet } from "viem/chains";
import  ViemWallet  from "@/components/viem/walletClient";

export default function Viem(){



 
  
  return (
    <div className="flex flex-col items-center justify-center">
      <ViemWallet></ViemWallet>
    </div>
  );
}
