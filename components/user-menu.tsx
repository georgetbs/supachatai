'use client'

import Image from 'next/image'
import { type Session } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconExternalLink } from '@/components/ui/icons'

export interface UserMenuProps {
  user: Session['user']
}



export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
  <Button variant="ghost" className="flex items-center justify-center w-full">
    {user?.user_metadata.avatar_url ? (
      <Image
        height={60}
        width={60}
        className="h-6 w-6 select-none rounded-full text-center ring-1 ring-zinc-100/10 transition-opacity duration-300 hover:opacity-80"
        src={user?.user_metadata.avatar_url ? `${user.user_metadata.avatar_url}&s=60` : ''}
        alt={user.user_metadata.name ?? 'Avatar'}
      />
    ) : null}
    <span className="flex items-center justify-center py-4 px-2 w-full">{user?.user_metadata.name ?? '⚙️'}</span>
  </Button>
</DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={8} align="start" className="w-[250px] px-4">
          <DropdownMenuItem className="flex-col">
            <div className=" text-xs font-medium">
              {user?.user_metadata.name}
            </div>
            <div className="cursor-pointer text-xs text-zinc-600 dark:text-zinc-300">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}  className="cursor-pointer flex-col text-xs">
            გასვლა
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
