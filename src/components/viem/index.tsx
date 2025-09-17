'use client';
import { createPublicClient, createWalletClient, custom, formatEther, getContract, http, parseEther } from 'viem';
import { megaethTestnet } from 'viem/chains';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { useState, useId, useEffect } from 'react';
import { abi } from '../../lib/abi';
import { CONTRACT_ADDRESS } from '@/components/wagmi/ContractDebugger';
import useMultiWallet from '@/hooks/useMultiWallet';

const CHAIN = megaethTestnet;

export default function ViemWalletClient() {
  const [client, setClient] = useState<ReturnType<typeof createWalletClient>>();
  const [toAddress, setToAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [publicClient, setPublicClient] = useState<ReturnType<typeof createPublicClient>>();
  const [, renderConnectButton] = useMultiWallet()

  // 合约相关状态
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [contractToAddress, setContractToAddress] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [isContractLoading, setIsContractLoading] = useState(false);

  // 使用 useId Hook 生成唯一ID，确保表单元素正确关联
  const toAddressId = useId();
  const amountId = useId();
  const contractToAddressId = useId();
  const contractAmountId = useId();

  async function getBalance(walletClient: ReturnType<typeof createWalletClient>) {
    const balance = await publicClient?.getBalance({
      address: walletClient?.account?.address as `0x${string}`,
    });
    balance&&setBalance(formatEther(balance))
  }

  useEffect(()=>{
    // client && getBalance(client)
  },[client])

  async function handleConnect(provider: any) {
    let account = provider.provider.selectedAddress as `0x${string}`
    // okx中不包含selectedAddress，需要通过eth_requestAccounts获取
    if(!account){
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      account = accounts[0] as `0x${string}`
    }
    try{
      setConnecting(true)
      
      // 创建公共客户端，用于读取操作
      const publicClient = createPublicClient({
        chain: CHAIN,
        transport: http(), // 使用HTTP transport而不是custom，避免RPC参数问题
      });
      setPublicClient(publicClient)
      
      // 创建钱包客户端，用于签名操作
      const walletClient = createWalletClient({
        account,
        chain: CHAIN,
        transport: custom(provider.provider, {
          key: provider.info.uuid,
          name: provider.info.name,
        })
      });
      setClient(walletClient);
    }catch(error){
     console.error('连接钱包失败:', error);
     alert(`连接钱包失败: ${error}`);
    }finally{
      setConnecting(false)
    }
  }

  async function disconnect() {
    setClient(undefined);
  }

  // 转账处理函数 - 核心逻辑由你来完成
  async function handleTransfer() {
    if (!toAddress || !amount || !client) {
      alert('请填写完整的转账信息');
      return;
    }

    setIsLoading(true);
    try {
      console.log('开始转账...', {
        from: client.account?.address,
        to: toAddress,
        amount: amount,
        chain: CHAIN.name
      });
      const hash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: client.account?.address,
          to: toAddress,
          value: `0x${parseEther(amount).toString(16)}`, // 转换为十六进制
        }],
      });

      // 等待一段时间后更新余额
      setTimeout(async () => {
        try {
          await getBalance(client);
          console.log('余额已更新');
        } catch (error) {
          console.error('更新余额失败:', error);
        }
      }, 3000);

      // 清空表单
      handleClear();

    } catch (error: unknown) {
      console.error('转账失败:', error);

      // 处理不同类型的错误
      let errorMessage = '转账失败，请重试';

      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = '余额不足，无法完成转账';
        } else if (error.message.includes('User rejected')) {
          errorMessage = '用户取消了交易';
        } else if (error.message.includes('gas')) {
          errorMessage = 'Gas费用不足或Gas限制过低';
        } else if (error.message.includes('nonce')) {
          errorMessage = '交易序号错误，请稍后重试';
        } else {
          errorMessage = `转账失败: ${error.message}`;
        }
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // 清空表单
  function handleClear() {
    setToAddress('');
    setAmount('');
  }

  

  async function getContractBalance() {
    if (!client?.account?.address || !publicClient) {
      console.error('钱包未连接或公共客户端未初始化');
      return;
    }

    try {
      const contract = getContract({
        address: CONTRACT_ADDRESS,
        abi,
        client: {
          public: publicClient,
          wallet: client,
        },
      })
      
      // 确保地址格式正确
      const userAddress = client.account.address as `0x${string}`;
      console.log('查询合约余额，用户地址:', userAddress);
      
      const balance = await contract.read.balanceOf([userAddress]);
      console.log('合约余额查询结果:', balance);
      
      setContractBalance(formatEther(balance));
    } catch (error) {
      console.error('获取合约余额失败:', error);
      alert('获取合约余额失败，请检查网络连接和合约地址');
    }
  }

  async function transferToContract() {
    if (!contractToAddress || !contractAmount || !client || !publicClient) {
      alert('请填写完整的转账信息');
      return;
    }

    setIsContractLoading(true);
    try {
      console.log('开始合约转账...', {
        from: client.account?.address,
        to: contractToAddress,
        amount: contractAmount,
        contract: CONTRACT_ADDRESS
      });

      const contract = getContract({
        address: CONTRACT_ADDRESS,
        abi,
        client: {
          public: publicClient,
          wallet: client,
        },
      });

      // 确保地址格式正确
      const toAddress = contractToAddress as `0x${string}`;
      const amount = parseEther(contractAmount);

      console.log('调用合约转账，参数:', { to: toAddress, amount: amount.toString() });

      const hash = await contract.write.transfer([toAddress, amount]);
      console.log('合约转账交易哈希:', hash);

      // 等待一段时间后更新余额
      setTimeout(async () => {
        try {
          await getContractBalance();
          console.log('合约余额已更新');
        } catch (error) {
          console.error('更新合约余额失败:', error);
        }
      }, 3000);

      // 清空表单
      setContractToAddress('');
      setContractAmount('');

      alert(`合约转账成功！交易哈希: ${hash}`);

    } catch (error: unknown) {
      console.error('合约转账失败:', error);

      let errorMessage = '合约转账失败，请重试';

      if (error instanceof Error) {
        if (error.message.includes('insufficient funds') || error.message.includes('ERC20InsufficientBalance')) {
          errorMessage = '代币余额不足，无法完成转账';
        } else if (error.message.includes('User rejected')) {
          errorMessage = '用户取消了交易';
        } else if (error.message.includes('gas')) {
          errorMessage = 'Gas费用不足或Gas限制过低';
        } else if (error.message.includes('nonce')) {
          errorMessage = '交易序号错误，请稍后重试';
        } else {
          errorMessage = `合约转账失败: ${error.message}`;
        }
      }

      alert(errorMessage);
    } finally {
      setIsContractLoading(false);
    }
  }

  return (
    <>
      {renderConnectButton({ connect: { handleConnect, status: !!client?.account ? 'success' : 'isPending' }, disconnect })}
      <div className="mx-auto p-6 grid grid-cols-2 gap-2">
        {/* 账户信息显示卡片 */}
        <Card className="h-[200px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {client?.account ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">地址:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded truncate">
                    {client.account.address}
                  </span>
                </div>
                <div className="flex items-center gap-2" >
                  <span className="font-medium">余额:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {balance || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">类型:</span>
                  <span className="text-sm">{client.account.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">网络:</span>
                  <span className="text-sm">{client?.chain?.name}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">{connecting ? '正在连接钱包...' : '未连接'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 合约余额显示卡片 */}
        <Card className="h-[200px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>合约余额信息</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {client?.account  ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">合约地址:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded truncate">
                    {CONTRACT_ADDRESS}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">代币余额:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {contractBalance || '-'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 获取合约余额的业务逻辑由用户实现
                      console.log('获取合约余额');
                      getContractBalance()
                    }}
                  >
                    刷新余额
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                {connecting ? '正在连接钱包...' : '未连接'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 转账表单卡片 */}
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>转账功能</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* 接收地址输入框 */}
            <div className="space-y-2">
              <label htmlFor={toAddressId} className="text-sm font-medium">
                接收地址
              </label>
              <Input
                id={toAddressId}
                type="text"
                placeholder="请输入接收地址 (0x...)"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* 转账金额输入框 */}
            <div className="space-y-2">
              <label htmlFor={amountId} className="text-sm font-medium">
                转账金额 (ETH)
              </label>
              <Input
                id={amountId}
                type="number"
                placeholder="请输入转账金额"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
                min="0"
              />
            </div>

            {/* 底部区域：按钮和提示信息 */}
            <div className="mt-auto space-y-3">
              {/* 操作按钮 */}
              <div className="flex gap-3">
                <Button
                  onClick={handleTransfer}
                  disabled={!client?.account || !toAddress || !amount || isLoading}
                  className="flex-1"
                >
                  {isLoading ? '转账中...' : '确认转账'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  清空
                </Button>
              </div>

              {/* 提示信息 */}
              {!client?.account && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  ⚠️ 请先连接钱包才能进行转账操作
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 合约转账表单卡片 */}
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>合约转账功能</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* 接收地址输入框 */}
            <div className="space-y-2">
              <label htmlFor={contractToAddressId} className="text-sm font-medium">
                接收地址
              </label>
              <Input
                id={contractToAddressId}
                type="text"
                placeholder="请输入接收地址 (0x...)"
                value={contractToAddress}
                onChange={(e) => setContractToAddress(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* 转账金额输入框 */}
            <div className="space-y-2">
              <label htmlFor={contractAmountId} className="text-sm font-medium">
                转账金额 (代币)
              </label>
              <Input
                id={contractAmountId}
                type="number"
                placeholder="请输入转账金额"
                value={contractAmount}
                onChange={(e) => setContractAmount(e.target.value)}
                step="0.001"
                min="0"
              />
            </div>

            {/* 底部区域：按钮和提示信息 */}
            <div className="mt-auto space-y-3">
              {/* 操作按钮 */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    // 合约转账的业务逻辑由用户实现
                    console.log('合约转账', {
                      to: contractToAddress,
                      amount: contractAmount
                    });
                    transferToContract();
                  }}
                  disabled={!client?.account || !contractToAddress || !contractAmount || isContractLoading}
                  className="flex-1"
                >
                  {isContractLoading ? '转账中...' : '确认合约转账'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setContractToAddress('');
                    setContractAmount('');
                  }}
                  disabled={isContractLoading}
                >
                  清空
                </Button>
              </div>

              {/* 提示信息 */}
              {!client?.account && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  ⚠️ 请先连接钱包才能进行合约转账操作
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
