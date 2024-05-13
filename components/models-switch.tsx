'use client';

import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ModelsSwitch() {
  const router = useRouter();

  const handleSelectModel = (model: string) => {
    // Основываясь на выбранной модели, изменить URL для API запроса
    router.push(`/chat/${model}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-primary bg-background hover:bg-background-light active:bg-background-dark">
          Выбор модели AI
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => handleSelectModel('tota-ge')}>
          Tota-ge (default)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSelectModel('gpt-3.5-turbo')}>
          GPT-3.5-turbo
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSelectModel('gpt-4')}>
          GPT-4
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
