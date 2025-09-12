'use client';

import { useAccount, useBalance } from "wagmi";

export default function AccountInfo() {
  const account = useAccount();
  
  const { data: balance } = useBalance({
    address: account.address,
  });

  if (!account.isConnected) {
    return null;
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold text-lg mb-3">🔗 账户信息</h3>
      
      <div className="space-y-2">
        <div>
          <span className="font-semibold">账户地址:</span>
          <p className="text-sm text-gray-600 font-mono break-all">
            {account.address}
          </p>
        </div>

        <div>
          <span className="font-semibold">账户余额:</span>
          <p className="text-sm text-gray-600 font-mono break-all">
            {balance?.formatted} {balance?.symbol}
          </p>
        </div>
        
        <div>
          <span className="font-semibold">链 ID:</span>
          <p className="text-sm text-gray-600">
            {account.chainId}
          </p>
        </div>
        
        <div>
          <span className="font-semibold">连接状态:</span>
          <p className="text-sm text-green-600">
            {account.status}
          </p>
        </div>
        
        {account.connector && (
          <div>
            <span className="font-semibold">钱包类型:</span>
            <p className="text-sm text-gray-600">
              {account.connector.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
