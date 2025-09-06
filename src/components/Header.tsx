"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const router = useRouter()
  const tabs = [
    {
      title: 'RainbowKit',
      url: '/rainbowkit'
    },
    {
      title: 'Wagmi',
      url: '/wagmi'
    },
  ]

  const handleClick = (url:string)=>{
    router.push(url)
  }
  return (
    <div className='w-full flex justify-end items-center p-3 mt-1 border '>
      {/* tabs block */}
      <div>
        {
          tabs.map(tab =>
            <Button
              variant='link'
              className='mr-3'
              onClick={()=>handleClick(tab.url)}>{ tab.title }
            </Button>
          )
        }
      </div>
      {/* connectbutton block*/}
      <ConnectButton chainStatus='name' accountStatus="avatar" showBalance={false} />
    </div>
  );
};

export default Header;
