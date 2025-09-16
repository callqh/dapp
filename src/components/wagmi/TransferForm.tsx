'use client';

import { useState, useId } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress } from "viem";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function TransferForm() {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const toAddressId = useId();
  const amountId = useId();

  const account = useAccount();
  const { sendTransaction, data: txHash, isPending, error } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: txError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleTransfer = async () => {
    if (!isAddress(toAddress)) {
      alert("请输入有效的地址");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("请输入有效的转账金额");
      return;
    }

    try {
      setIsLoading(true);
      await sendTransaction({
        to: toAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("转账失败:", err);
    } finally {
      setIsLoading(false);
    }
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
      <h3 className="font-bold text-lg mb-3">💸 转账功能</h3>
      
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
            disabled={isPending || isLoading || isConfirming || !toAddress || !amount}
            className="flex-1"
          >
            {isPending || isLoading
              ? "发送中..."
              : isConfirming
              ? "确认中..."
              : "发送转账"}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isPending || isLoading || isConfirming}
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

        {isConfirming && (
          <div className="mt-3 p-3 bg-yellow-100 rounded">
            <p className="text-sm text-yellow-700">
              ⏳ 等待交易确认...
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-3 p-3 bg-green-100 rounded">
            <p className="text-sm text-green-700">
              ✅ 转账成功！
            </p>
          </div>
        )}

        {(error || txError) && (
          <div className="mt-3 p-3 bg-red-100 rounded">
            <p className="text-sm text-red-700">
              ❌ 转账失败: {(error || txError)?.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
