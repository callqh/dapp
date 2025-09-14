'use client';
import { useContext, useEffect, useState } from "react"
import { Context } from "./layout"
import EthersTransfer from "@/components/EthersTransfer"
import { parseUnits } from "ethers";

export default function EthersPage() {
  const { provider, signer } = useContext(Context)
  const [balance, setBalance] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string | undefined>('')
  const [transferEvents, setTransferEvents] = useState<any>()

  // 获取账户余额的处理函数
  const handleGetBalance = async (address: string) => {
    // 这里你可以实现获取余额的逻辑
    console.log("获取地址余额:", address)
    if (provider) {
      try {
        const balance = await provider.getBalance(address)
        // 将wei转换为ether并设置余额
        setBalance((Number(balance) / 1e18).toFixed(6))
      } catch (error) {
        console.error("获取余额失败:", error)
        setBalance("获取失败")
      }
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
        setTransferEvents(receipt)
        console.log("receipt:", receipt)
      }
    } catch (error) {
      console.error("转账失败:", error)
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

  return (
    <EthersTransfer
      currentAddress={currentAddress}
      onGetBalance={handleGetBalance}
      onTransfer={handleTransfer}
      balance={balance}
      isListening={isListening}
      transferEvents={transferEvents}
    />
  )
}
