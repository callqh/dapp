'use client';
import { megaethTestnet } from "wagmi/chains";
import { injected, useAccount, useConnect, useReadContract } from "wagmi";
import { Button } from "./ui/button";
import AccountInfo from "./AccountInfo";
import TransferForm from "./TransferForm";
import ContractDebugger from "./ContractDebugger";
import ContractTransfer from "./ContractTransfer";

export default function WagmiHooks() {
  const { connect, isPending } = useConnect();
  // useAccount连接之后可以拿到链接的状态，useConnect需要每次链接之后才可以拿到
  const account = useAccount();

  const handleConnect = async () => {
    await connect({ connector: injected() });
  };

  return (
    <div className="p-4 space-y-4">
      {/* 钱包连接按钮 */}
      <div>
        <Button 
          onClick={handleConnect} 
          disabled={isPending || account.isConnected}
        >
          {isPending ? 'Connecting...' : account.isConnected ? 'Connected' : 'Connect Wallet'}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-0.5">
          {/* 账户信息组件 */}
          <AccountInfo />
          
          {/* 转账功能组件 */}
          <TransferForm />

            {/* 合约调试器 */}
            <ContractDebugger />

            <ContractTransfer />
      </div>

    </div>
  );
}
