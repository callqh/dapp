'use client';
import { useContext, useEffect, useState } from "react"
import { Context } from "./layout"
import EthersTransfer from "@/components/ethers/EthersTransfer"
import { parseUnits, formatEther, isAddress, BaseContract } from "ethers";
import type { TransactionReceipt } from "ethers";
import { abi } from "@/lib/abi";
import { toast } from "sonner"

export default function EthersPage() {
  const { provider, signer } = useContext(Context)
  const [balance, setBalance] = useState('')
  const [contract, setContract] = useState<BaseContract | null>(null)
  const [contractBalance, setContractBalance] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string | undefined>('')
  const [transferEvents, setTransferEvents] = useState<TransactionReceipt | null>(null)

  // 获取账户余额的处理函数
  const handleGetBalance = async () => {
    // 检查 provider 是否存在
    if (!provider) {
      console.error("Provider 未初始化，请先连接钱包")
      setBalance("请先连接钱包")
      return
    }
    try {
      const address = await signer?.getAddress() as string;
      // 获取余额
      const balanceWei = await provider.getBalance(address)
      console.log("余额 (Wei):", balanceWei.toString())
      // 将wei转换为ether并设置余额
      const balanceEth = formatEther(balanceWei)
      console.log("余额 (ETH):", balanceEth)
      setBalance(balanceEth)
      
    } catch (error: any) {
      console.error("获取余额失败:", error)
    }
  }

  // 转账处理函数
  const handleTransfer = async (to: string, amount: string) => {
    if (!signer) return console.error("signer is null")
    try {
      setIsListening(true)
      const res = await signer.sendTransaction({
        to,
        value: parseUnits(amount, 18),
      })
      if (res?.hash) {
        const receipt = await provider?.waitForTransaction(res.hash)
        if (receipt) {
          setTransferEvents(receipt)
          console.log("receipt:", receipt)
        }
      }
    } catch (error) {
      console.error("转账失败:", error)
    } finally {
      setIsListening(false)
    }
  }

  // 合约余额查询处理函数
  const handleGetContractBalance = async (contractAddress: string) => {
    console.log("查询合约余额:", contractAddress,signer,provider)
    if (!signer||!provider) return toast("请先连接钱包")
    // 这里你可以实现合约余额查询的逻辑
    const contract = new BaseContract(contractAddress, abi, signer)
    setContract(contract)
    const balance = await contract.balanceOf(currentAddress)
    // 示例：使用 ERC20 合约的 balanceOf 方法
    setContractBalance(formatEther(balance))
  }

  // 合约转账处理函数
  const handleContractTransfer = async (contractAddress: string, to: string, amount: string) => {
    console.log("合约转账:", { contractAddress, to, amount })
    // 这里你可以实现合约转账的逻辑
    // 示例：使用 ERC20 合约的 transfer 方法
    if (!signer) return console.error("signer is null")
    
    try {
      setIsListening(true)
      // 在这里添加你的合约转账逻辑
      console.log("开始合约转账...")
      await contract?.transfer(to, parseUnits(amount, 18))
    } catch (error) {
      console.error("合约转账失败:", error)
    } finally {
      setIsListening(false)
    }
  }

  useEffect(() => {
    (async () => {
      const address = await signer?.getAddress()
      setCurrentAddress(address)
    })()
  }, [signer])

  useEffect(()=>{
    if (!contract) return
    contract.on("Transfer", (from, to, amount) => {
      console.log("Transfer event:", { from, to, amount })
      toast("Transfer event:", { 
        description: `from: ${from}, to: ${to}, amount: ${amount}`,
        duration: 5000,
      })
    })
    return () => {
      contract.off("Transfer")
    }
  },[contract])

  return (
     <EthersTransfer
      currentAddress={currentAddress}
      onGetBalance={handleGetBalance}
      onTransfer={handleTransfer}
      onContractTransfer={handleContractTransfer}
      onGetContractBalance={handleGetContractBalance}
      balance={balance}
      contractBalance={contractBalance}
      isListening={isListening}
      transferEvents={transferEvents}
    />
  )
}
