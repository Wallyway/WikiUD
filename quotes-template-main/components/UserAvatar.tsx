import { AvatarProps } from '@radix-ui/react-avatar'
import { Icons } from '../components/icons'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import Image from 'next/image'

interface UserAvatarProps extends AvatarProps {
  user: { image?: string | null; name?: string | null }
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          {Icons?.user && <Icons.user className="h-4 w-4" />}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
