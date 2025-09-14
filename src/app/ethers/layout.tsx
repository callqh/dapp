'use client'
import {ethers, BrowserProvider} from 'ethers'
import { useEffect, useState,createContext } from 'react'

export const Context = createContext({provider: null as BrowserProvider | null,signer: null as ethers.Signer | null})

export default function EthersLayout({children}: {children: React.ReactNode}) {
  const [provider,setProvider] = useState<BrowserProvider | null>(null)
  const [signer,setSigner] = useState<ethers.Signer | null>(null)
  useEffect(()=>{
    (async () => {
      if(window && window.ethereum){
        const provider = new BrowserProvider(window.ethereum)
        setProvider(provider)
        const signer = await provider.getSigner()
        setSigner(signer)
      }
    })()
  },[])
    return (
        <div>
          <Context value={{provider,signer}}>
            {children}
          </Context>
        </div>
    )
}

