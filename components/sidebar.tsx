'use client';

import React, { useState, useEffect } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { IconSidebar, IconClose, IconEdit } from '@/components/ui/icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 728px)');

    const handler = (e: MediaQueryListEvent) => {
      setIsOpen(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    setIsOpen(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={(newOpenValue) => {
      if (!window.matchMedia('(min-width: 728px)').matches || !isOpen) {
        setIsOpen(newOpenValue);
      }
    }}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0" onClick={toggleSidebar}>
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">გადართეთ გვერდითა ზოლი</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        className={`inset-y-0 flex h-auto w-[300px] flex-col p-0 ${isOpen ? '' : 'hidden'}`}
      >
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">ჩეთის ისტორია</SheetTitle>
          <Button onClick={() => setIsOpen(false)} className="absolute top-1 right-4">
            <IconClose className="h-6 w-6" />
            <span className="sr-only">დახურვა</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'absolute left-36 top-1 h-8 w-14 bg-background p-0'
                )}
              >
                <IconEdit />
                <span className="sr-only">ახალი ჩათი</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>ახალი ჩათი</TooltipContent>
          </Tooltip>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
