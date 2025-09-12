'use client';

import { useAccount, useReadContract } from "wagmi";
import { megaethTestnet } from "wagmi/chains";
import {abi} from './abi';
import { useState } from "react";
import { formatEther } from "viem";

export const CONTRACT_ADDRESS = '0x10Cbb82ec61E8FA0766b3976092878EfEd55C516' as `0x${string}`;

export default function ContractDebugger() {
  const [customAddress, ] = useState<string>(CONTRACT_ADDRESS);
  const account = useAccount();


  // 读取合约余额函数
  const { data, error, isLoading } = useReadContract({
    abi,
    address: customAddress as `0x${string}`,
    args: ['0x80847598cfDB6F7836542ee6278175cc217D10b5' as `0x${string}`],
    functionName: 'balanceOf',
    chainId: megaethTestnet.id,
    query:{
      enabled: !!account.address && !!customAddress
    }
  });

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold text-lg mb-3">🔧 合约调试器</h3>
      
      <div className="space-y-4">
        {/* 合约地址输入 */}
        <div>
            合约地址: <span className="text-blue-500">{ customAddress }</span>
        </div>

        {/* 网络信息 */}
        <div className="p-3 bg-blue-100 rounded">
          <h4 className="font-semibold text-sm mb-2">🌐 网络信息</h4>
          <div className="text-xs space-y-1">
            <p><span className="font-semibold">当前网络:</span> {account.chainId}</p>
            <p><span className="font-semibold">目标网络:</span> {megaethTestnet.id} (MegETH Testnet)</p>
            <p><span className="font-semibold">网络匹配:</span> 
              <span className={account.chainId === megaethTestnet.id ? 'text-green-600' : 'text-red-600'}>
                {account.chainId === megaethTestnet.id ? '✅ 匹配' : '❌ 不匹配'}
              </span>
            </p>
          </div>
        </div>

        {/* 合约检查结果 */}
          <div className={`p-3 rounded bg-green-100`}>
            <h4 className="font-semibold text-sm mb-2">📋 合约调用结果</h4>
            {isLoading ? 
            <div>
              <p className="text-gray-500">正在调用合约...</p>
            </div>
            :
            <div className="text-xs space-y-1">
             {
              error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                <>
                {
                  data && (
                    <>
                      <p className="text-gray-500">✅ 调用成功</p>
                      <p className="text-gray-500">结果：{formatEther(data)}</p>
                    </>
                  )
                }
                </>
              )
             }
            </div>}
          </div>
      </div>
    </div>
  );
}
