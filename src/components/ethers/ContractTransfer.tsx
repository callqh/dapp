'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContractTransferProps {
  onContractTransfer: (contractAddress: string, to: string, amount: string) => void;
  onGetContractBalance: (contractAddress: string) => void;
  contractBalance?: string;
  currentAddress?: string;
  isListening: boolean;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function ContractTransfer({
  onContractTransfer,
  onGetContractBalance,
  contractBalance,
  currentAddress,
  isListening
}: ContractTransferProps) {
  // 合约转账相关状态
  const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESS);
  const [contractTransferTo, setContractTransferTo] = useState('');
  const [contractTransferAmount, setContractTransferAmount] = useState('');
  
  const contractAddressId = useId();
  const contractTransferToId = useId();
  const contractTransferAmountId = useId();

  const handleContractTransfer = () => {
    if (contractAddress.trim() && contractTransferTo.trim() && contractTransferAmount.trim()) {
      onContractTransfer(contractAddress.trim(), contractTransferTo.trim(), contractTransferAmount.trim());
    }
  };

  const handleGetContractBalance = () => {
    if (contractAddress.trim()) {
      onGetContractBalance(contractAddress.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">ERC20 代币转账</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">当前连接地址: {currentAddress}</p>
        </div>
        
        {/* 合约地址输入 */}
        <div>
          <label htmlFor={contractAddressId} className="block text-sm font-medium mb-2">合约地址</label>
          <div className="flex gap-2">
            <Input
              id={contractAddressId}
              placeholder="输入 ERC20 合约地址 (0x...)"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value as `0x${string}`)}
              className="flex-1"
            />
            <Button 
              onClick={handleGetContractBalance}
              variant="outline"
              disabled={!contractAddress || isListening}
            >
              查询余额
            </Button>
          </div>
          {contractBalance && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-300">代币余额:</p>
              <p className="text-lg font-mono font-semibold">{contractBalance}</p>
            </div>
          )}
        </div>

        {/* 接收地址输入 */}
        <div>
          <label htmlFor={contractTransferToId} className="block text-sm font-medium mb-2">接收地址</label>
          <Input
            id={contractTransferToId}
            placeholder="输入接收方钱包地址 (0x...)"
            value={contractTransferTo}
            onChange={(e) => setContractTransferTo(e.target.value)}
          />
        </div>

        {/* 转账金额输入 */}
        <div>
          <label htmlFor={contractTransferAmountId} className="block text-sm font-medium mb-2">转账金额</label>
          <Input
            id={contractTransferAmountId}
            type="number"
            step="0.000001"
            placeholder="输入转账金额"
            value={contractTransferAmount}
            onChange={(e) => setContractTransferAmount(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleContractTransfer}
          className="w-full"
          disabled={isListening || !contractAddress || !contractTransferTo || !contractTransferAmount.trim()}
        >
          {isListening ? '处理中...' : '发送代币转账'}
        </Button>
      </div>
    </div>
  );
}
