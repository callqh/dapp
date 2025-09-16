'use client';
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "../ui/button";
import AccountInfo from "../AccountInfo";
import TransferForm from "./TransferForm";
import ContractDebugger from "./ContractDebugger";
import ContractTransfer from "./ContractTransfer";
import useMultiWallet from "@/hooks/useMultiWallet";

export default function WagmiHooks() {
  const { connect, status } = useConnect();
  const { disconnect } = useDisconnect()
  const [, renderConnectButton] = useMultiWallet()

  const handleConnect = async (provider: any) => {
     await connect({
      connector: injected(
        {
          target() {
            return provider;
          },
        }
      )
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* 钱包连接按钮 */}
      <div className="flex gap-2">
        {renderConnectButton({ connect: {handleConnect,status}, disconnect })}
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
