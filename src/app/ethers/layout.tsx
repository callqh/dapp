'use client'
import useMultiWallet from '@/hooks/useMultiWallet'
import { ethers, BrowserProvider } from 'ethers'
import {  useState, createContext } from 'react'

export const Context = createContext({ provider: null as BrowserProvider | null, signer: null as ethers.Signer | null })

export default function EthersLayout({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [, renderConnectButton] = useMultiWallet()

  const handleConnect = async (e: any) => {
    const provider = new BrowserProvider(e.provider, +e.provider.chainId)
    setProvider(provider)
    const signer = await provider.getSigner()
    setSigner(signer)
  }

  return (
    <div>
      <Context.Provider value={{ provider, signer }}>
        {renderConnectButton({ connect: { handleConnect }, disconnect: () => { } })}
        {children}
      </Context.Provider>
    </div>
  )
}

