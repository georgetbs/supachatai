'use client'

import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { IconSidebar, IconClose } from '@/components/ui/icons';

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 728px)');

    const handler = (e: MediaQueryListEvent) => {
      // На широких экранах состояние открытия устанавливается в зависимости от ширины экрана
      setIsOpen(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    // Инициализация состояния на основе начального значения медиазапроса
    setIsOpen(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleSidebar = () => {
    // Переключение видимости панели для всех экранов
    setIsOpen(!isOpen);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(newOpenValue) => {
      // Переключение состояния только на узких экранах или при явном закрытии
      if (!window.matchMedia('(min-width: 728px)').matches || !isOpen) {
        setIsOpen(newOpenValue);
      }
    }}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0" onClick={toggleSidebar}>
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        className={`inset-y-0 flex h-auto w-[300px] flex-col p-0 ${isOpen ? '' : 'hidden'}`}
      >
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Chat History</SheetTitle>
          <Button onClick={() => setIsOpen(false)} className="absolute top-1 right-4">
            <IconClose className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
