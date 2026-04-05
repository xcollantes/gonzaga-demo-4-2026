// import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  hoverEffect?: boolean;
}

export default function Logo({ className = '', width = 180, height = 40, hoverEffect = false }: LogoProps) {
  // const { currentUser } = useAuth();

  // Redirect to root if not authenticated, dashboard if authenticated
  // const destination = currentUser ? '/dashboard' : '/';

  // <h1 className={`text-2xl font-bold bg-gradient-to-r
  //   from-blue-500 via-purple-500 to-red-500
  //   text-transparent bg-clip-text ${className}`}>
  //   Quantplex.AI
  // </h1>

  return (
    <Link href={"/"} className={"hover:opacity-80 cursor-pointer transition-opacity"}>
      <Image
        src="/quantplex-logo.svg"
        alt="Quantplex.AI"
        width={width}
        height={height}
        className={
          `${className} ${hoverEffect ? 'hover:scale-105 transition-transform duration-300' : ''}`
        } />
    </Link>
  );
}


