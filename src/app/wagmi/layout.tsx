'use client';
import { createConfig, http, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, megaethTestnet } from 'wagmi/chains';

const queryClient = new QueryClient();

 const config = createConfig({
    chains: [mainnet, megaethTestnet],
    transports: {
      [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
      [megaethTestnet.id]: http(megaethTestnet.rpcUrls.default.http[0]),
    },
    ssr: true,
  });


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <WagmiProvider config={config}> 
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
     </WagmiProvider>
  );
}
