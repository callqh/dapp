import { Card, CardContent } from '@/components/ui/card';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Providers>
        <div className='flex justify-center mt-3'>
          <Card>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </Providers>
    </div>
  );
}
