'use client';
import { useState } from 'react';
import type { Address } from 'viem';
import { LoadingText } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Wagmi from '@/components/Wagmi';

export default () => {
  const [address, setAddress] = useState<Address | undefined>(undefined);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value as Address);
  };

  return (
    <div>
      <div>
        <Wagmi />
      </div>
    </div>
  );
};
