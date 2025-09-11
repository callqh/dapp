'use client';

import { injected, useAccount, useConnect } from "wagmi";
import { Button } from "./ui/button";


export default function WagmiHooks() {

  const {connect,data}  = useConnect();
  const account = useAccount();

  const handleConnect = async () => {
    await connect({connector:injected()});
  };
  console.log("📌 >>> WagmiHooks >>> account:", account)
  return <div>
    <Button onClick={handleConnect}>Connect Wallet</Button>
  </div>;
}
