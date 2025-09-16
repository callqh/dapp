'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";

interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo,
  provider: unknown;
}

enum EIP6963Event {
  ANNOUNCE_PROVIDER = "eip6963:announceProvider",
  REQUEST_PROVIDER = "eip6963:requestProvider",
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: EIP6963Event.ANNOUNCE_PROVIDER;
  detail: EIP6963ProviderDetail;
}

export default function useMultiWallet(): [
  Map<string, EIP6963ProviderDetail>,
  ({ connect, disconnect }: { connect: any; disconnect: any }) => ReactElement,
  EIP6963ProviderDetail | null
] {
  const [providers, setProviders] = useState<Map<string, EIP6963ProviderDetail>>(new Map())
  const [currentProvider, setCurrentProvider] = useState<EIP6963ProviderDetail | null>(null)

  const handleAnnounceProvider = useCallback((e: EIP6963AnnounceProviderEvent) => {
    const uuid = e.detail.info.uuid;
    setProviders(prev => {
      const updated = new Map(prev);
      updated.set(uuid, e.detail)
      return updated
    })
  }, []);

  useEffect(() => {
    // 添加事件监听器
    window.addEventListener(EIP6963Event.ANNOUNCE_PROVIDER, handleAnnounceProvider as EventListener);

    // 主动请求钱包提供商宣布自己
    window.dispatchEvent(new Event(EIP6963Event.REQUEST_PROVIDER));

    // 清理函数
    return () => {
      window.removeEventListener(EIP6963Event.ANNOUNCE_PROVIDER, handleAnnounceProvider as EventListener);
    };
  }, [handleAnnounceProvider])

  const renderConnectButton = ({ connect :{
    handleConnect,
    status
  }, disconnect }: { connect: any, disconnect: any }) => {
    return <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>Connect Wallet</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Wallet List</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            Array.from(providers?.values())?.map(provider => {
              return <DropdownMenuItem 
              key={provider.info.uuid} 
              onClick={() =>{
                handleConnect(provider)
                setCurrentProvider(provider)
              }}>
                {provider.info.name}
                </DropdownMenuItem>
            })
          }
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        onClick={() => disconnect()} disabled={status !== 'success'}>
        DisConnect Wallet
      </Button>

    </div>
  }

  return [providers, renderConnectButton, currentProvider]
}
