'use client';
import { useRouter,usePathname } from 'next/navigation';
import { Button } from './ui/button';


const tabs = [
  {
    title: 'RainbowKit',
    url: '/',
  },
  {
    title: 'Wagmi',
    url: '/wagmi',
  },
  {
    title: 'Viem',
    url: '/viem',
  }
];

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className='w-full flex justify-end items-center p-3 mt-1 border rounded-2xl mb-2'>
      {/* tabs block */}
      <div>
        {tabs.map((tab) => (
          <Button
            key={tab.title}
            variant='link'
            className={`mr-3 ${tab.url === pathname ? 'text-blue-500' : ''}`}
            onClick={() => handleClick(tab.url)}
          >
            {tab.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Header;
