import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconSeparator,
  IconEdit
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { cookies } from 'next/headers'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink } from '@/components/external-link'

export async function Header() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })


    return (
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
    <div className="flex items-center mx-2 justify-center text-primary h-full">
  {session?.user ? (
    <Sidebar>
      <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
        {/* @ts-ignore */}
        <SidebarList userId={session?.user?.id} />
      </React.Suspense>
      <SidebarFooter>
        <ThemeToggle />
        <ClearHistory clearChats={clearChats} />
      </SidebarFooter>
    </Sidebar>
  ) : null}
  <IconSeparator className="h-6 w-6 mx-1 text-muted-foreground/50" />
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        href="/"
        className={cn(
          buttonVariants({ size: 'sm', variant: 'outline' }),
          'bg-background mx-1 px-4 rounded-full text-primary'
        )}
      >
        <IconEdit />
        <span className="sr-only">ახალი ჩათი</span>
      </Link>
    </TooltipTrigger>
    <TooltipContent>ახალი ჩათი</TooltipContent>
  </Tooltip>
</div>

        

    
      
      <div className="flex items-center">
      <h1 className="px-5 text-xl font-semibold text-primary text-center">
      <ExternalLink href="https://tota.ge">Tota.ge</ExternalLink>
        </h1>
     
        <IconSeparator className="mx-1 h-6 w-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in">შესვლა</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
