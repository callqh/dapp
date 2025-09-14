'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EthersTransferProps {
  onGetBalance: (address: string) => void;
  onTransfer: (to: string, amount: string) => void;
  balance: string;
  currentAddress?: string;
  isListening: boolean;
  transferEvents: Record<string, any>;
}

export default function EthersTransfer({
  onGetBalance,
  onTransfer,
  balance,
  isListening,
  transferEvents,
  currentAddress
}: EthersTransferProps) {
  const [balanceAddress, setBalanceAddress] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const transferToId = useId();
  const transferAmountId = useId();

  const handleGetBalance = () => {
    if (balanceAddress.trim()) {
      onGetBalance(balanceAddress.trim());
    }
  };

  const handleTransfer = () => {
    if (transferTo.trim() && transferAmount.trim()) {
      onTransfer(transferTo.trim(), transferAmount.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">以太坊转账操作</h1>
      
      {/* 余额查询区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">查询账户余额</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="输入钱包地址 (0x...)"
            value={balanceAddress}
            onChange={(e) => setBalanceAddress(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleGetBalance} className="sm:w-auto w-full">
            查询余额
          </Button>
        </div>
        {balance && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">账户余额:</p>
            <p className="text-lg font-mono font-semibold">{balance} ETH</p>
          </div>
        )}
      </div>

      {/* 转账区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">发送转账</h2>
        <div className="space-y-4">
          <div>
            <p>当前连接地址: {currentAddress}</p>
          </div>
          <div>
            <label htmlFor={transferToId} className="block text-sm font-medium mb-2">接收地址</label>
            <Input
              id={transferToId}
              placeholder="输入接收方钱包地址 (0x...)"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={transferAmountId} className="block text-sm font-medium mb-2">转账金额 (ETH)</label>
            <Input
              id={transferAmountId}
              type="number"
              step="0.001"
              placeholder="输入转账金额"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleTransfer}
            className="w-full"
            disabled={isListening}
          >
            发送转账
          </Button>
        </div>
      </div>

      {/* 事件监听区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">转账事件监听</h2>
        </div>

        {/* 事件列表 */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isListening ? 'waitting for transfer receipt...' : JSON.stringify(transferEvents)}
        </div>
      </div>
    </div>
  );
}
