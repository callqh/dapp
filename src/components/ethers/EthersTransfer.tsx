'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ContractTransfer from './ContractTransfer';

import type { TransactionReceipt } from 'ethers';

interface EthersTransferProps {
  onGetBalance: (address?: string) => void;
  onTransfer: (to: string, amount: string) => void;
  onContractTransfer?: (contractAddress: string, to: string, amount: string) => void;
  balance: string;
  currentAddress?: string;
  isListening: boolean;
  transferEvents: TransactionReceipt | null;
  contractBalance?: string;
  onGetContractBalance?: (contractAddress: string) => void;
}

export default function EthersTransfer({
  onGetBalance,
  onTransfer,
  onContractTransfer,
  balance,
  isListening,
  transferEvents,
  currentAddress,
  contractBalance,
  onGetContractBalance
}: EthersTransferProps) {
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  
  const transferToId = useId();
  const transferAmountId = useId();

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
          <Button onClick={()=>onGetBalance()} className="sm:w-auto w-full">
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

      {/* 合约转账组件 */}
      {onContractTransfer && onGetContractBalance && (
        <ContractTransfer
          onContractTransfer={onContractTransfer}
          onGetContractBalance={onGetContractBalance}
          contractBalance={contractBalance}
          currentAddress={currentAddress}
          isListening={isListening}
        />
      )}

      {/* 事件监听区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">转账事件监听</h2>
        </div>

        {/* 事件列表 */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isListening ? (
            <p className="text-gray-600">等待转账回执...</p>
          ) : transferEvents ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <p className="font-semibold text-green-800 dark:text-green-200">转账成功!</p>
              <div className="mt-2 text-sm space-y-1">
                <p><span className="font-medium">交易哈希:</span> {transferEvents.hash}</p>
                <p><span className="font-medium">区块号:</span> {transferEvents.blockNumber}</p>
                <p><span className="font-medium">Gas 使用:</span> {transferEvents.gasUsed.toString()}</p>
                <p><span className="font-medium">状态:</span> {transferEvents.status === 1 ? '成功' : '失败'}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">暂无转账记录</p>
          )}
        </div>
      </div>
    </div>
  );
}
