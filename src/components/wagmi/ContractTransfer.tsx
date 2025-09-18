'use client';

import { useState, useId } from "react";
import { useAccount,  useReadContract,  useWaitForTransactionReceipt,  useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { abi } from '@/lib/abi'
import { formatEther, parseEther } from "viem";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function TransferForm() {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  
  const toAddressId = useId();
  const amountId = useId();

  const account = useAccount();
  const { writeContract, data:txHash, isPending, error } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })
  
  // 查询任意地址的代币余额
  const { data: targetBalance } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'balanceOf',
    args: [toAddress as `0x${string}`],
    query:{
      enabled: !!txHash && !!toAddress
    }
  });

  const handleTransfer = async () => { 
    writeContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: "transfer",
      args: [toAddress as `0x${string}`, parseEther(amount)],
    });
  };

  const resetForm = () => {
    setToAddress("");
    setAmount("");
  };

  if (!account.isConnected) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-yellow-50">
        <p className="text-yellow-700">🔌 请先连接钱包才能进行转账</p>
      </div>
    );
  }


  return (
    <div className="mt-4 p-4 border rounded-lg bg-blue-50">
      <h3 className="font-bold text-lg mb-3">💸 合约转账功能</h3>
       {isConfirmed && (
          <div className="mt-3 p-3 bg-green-100 rounded">
            <p className="text-sm text-green-700">
              ✅ 转账成功！
              {targetBalance&&<span>目标账户余额：{formatEther(targetBalance)}</span>}
            </p>
          </div>
        )}

        {(error) && (
          <div className="mt-3 p-3 bg-red-100 rounded">
            <p className="text-sm text-red-700">
              ❌ 转账失败: {(error)?.message}
            </p>
          </div>
        )}
      <div className="space-y-4">
        {/* 接收地址输入 */}
        <div>
          <label htmlFor={toAddressId} className="block text-sm font-semibold mb-1">
            接收地址:
          </label>
          <Input
            id={toAddressId}
            placeholder="0x..."
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* 转账金额输入 */}
        <div>
          <label htmlFor={amountId} className="block text-sm font-semibold mb-1">
            转账金额 (ETH):
          </label>
          <Input
            id={amountId}
            type="number"
            step="0.001"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* 转账按钮 */}
        <div className="flex gap-2">
          <Button
            onClick={handleTransfer}
            disabled={isPending}
            className="flex-1"
          >
            转账
          </Button>
          
          <Button
            variant="outline"
            onClick={resetForm}
          >
            重置
          </Button>
        </div>

        {/* 状态显示 */}
        {txHash && (
          <div className="mt-3 p-3 bg-blue-100 rounded">
            <p className="text-sm">
              <span className="font-semibold">交易哈希:</span>
            </p>
            <p className="text-xs font-mono break-all text-blue-700">
              {txHash}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
