import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface UserAvatarProps {
  linkToProfile?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ linkToProfile = true, size = 'md' }: UserAvatarProps) {
  const { currentUser } = useAuth();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  const avatar = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={currentUser?.photoURL || ''} alt="Profile" />
      <AvatarFallback className="bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)]">
        {currentUser?.displayName
          ? currentUser.displayName.charAt(0).toUpperCase()
          : currentUser?.email
            ? currentUser.email.charAt(0).toUpperCase()
            : 'U'}
      </AvatarFallback>
    </Avatar>
  );

  if (linkToProfile && currentUser) {
    return (
      <Link href="/profile" className="flex items-center">
        {avatar}
      </Link>
    );
  }

  return avatar;
}