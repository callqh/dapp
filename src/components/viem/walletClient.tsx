'use client';
import { createPublicClient, createWalletClient, custom, formatEther, getContract, http, parseEther } from 'viem';
import { mainnet, megaethTestnet } from 'viem/chains';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { useEffect, useState, useId } from 'react';
import { abi } from '../abi';
import { CONTRACT_ADDRESS } from '../ContractDebugger';


const CHAIN = megaethTestnet;

export default function ViemWalletClient() {
  const [client, setClient] = useState<ReturnType<typeof createWalletClient>>();
  const [toAddress, setToAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 合约相关状态
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [contractToAddress, setContractToAddress] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [isContractLoading, setIsContractLoading] = useState(false);

  const viemClient = createPublicClient({
    chain: CHAIN,
    transport: http(),
  });

  // 使用 useId Hook 生成唯一ID，确保表单元素正确关联
  const toAddressId = useId();
  const amountId = useId();
  const contractToAddressId = useId();
  const contractAmountId = useId();

  async function getBalance(walletClient: ReturnType<typeof createWalletClient>) {
    const balance = await viemClient.getBalance({
      address: walletClient?.account?.address as `0x${string}`,
    });
    setBalance(formatEther(balance))
  }

  async function connectWallet() {
    const [address] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const walletClient = createWalletClient({
      account: address as `0x${string}`,
      chain: CHAIN,
      // transport: http(),
      transport: custom(window.ethereum)
    });
    await getBalance(walletClient);
    setClient(() => walletClient);
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

      // const hash = await client.sendTransaction({
      //   to: toAddress as `0x${string}`,
      //   value: parseEther(amount),
      // });
      // 使用 wallet_sendTransaction 而不是 eth_sendTransaction
      // 这与 wagmi 使用相同的方法
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

  useEffect(() => {
    connectWallet();
  }, [])

  const contract = getContract({
    address: CONTRACT_ADDRESS,
    abi,
    client: {
      public: viemClient,
      wallet: client,
    },
  })

  async function getContractBalance(){
   const balance = await contract.read.balanceOf([client?.account?.address as `0x${string}`])
   setContractBalance(formatEther(balance))
  }

  async function transferToContract(){
      const hash = await contract.write.transfer([contractToAddress,parseEther(contractAmount)])
  }

  return (
    <div className="mx-auto p-6 space-y-6 grid grid-cols-2 gap-1">
      <div>

        {/* 账户信息显示卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent>
            {client?.account ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">地址:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {client.account.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                <p className="text-gray-500">正在连接钱包...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 转账表单卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>转账功能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4">
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
          </CardContent>
        </Card>
      </div>
      <div>
        {/* 合约余额显示卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>合约余额信息</CardTitle>
          </CardHeader>
          <CardContent>
            {client?.account ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">合约地址:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
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
                <p className="text-gray-500">请先连接钱包</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 合约转账表单卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>合约转账功能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4">
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
          </CardContent>
        </Card>
      </div>

      {/* 调试按钮 */}
      {/* <div className="text-center">
        <Button variant="outline" onClick={() => console.log('Client info:', client)}>
          获取地址信息
        </Button>
      </div> */}
    </div>
  )
}
