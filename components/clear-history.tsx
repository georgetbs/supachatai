'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { ServerActionResult } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { IconSpinner } from '@/components/ui/icons'

interface ClearHistoryProps {
  clearChats: () => ServerActionResult<void>
}

export function ClearHistory({ clearChats }: ClearHistoryProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" disabled={isPending}>
          {isPending && <IconSpinner className="mr-2" />}
          გაასუფთავეთ ისტორია
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ნამდვილად დარწმუნებული ხართ?</AlertDialogTitle>
          <AlertDialogDescription>
          ეს სამუდამოდ წაშლის თქვენს ჩეთის ისტორიასა და მონაცემებს ჩვენი სერვერებიდან.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>გაუქმება</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className=' bg-red-600 hover:bg-red-700 dark:text-red-100'
            onClick={event => {
              event.preventDefault()
              startTransition(async () => {
                const result = await clearChats()

                if (result && 'error' in result) {
                  toast.error(result.error)
                  return
                }

                setOpen(false)
                router.push('/')
              })
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            წაშლა
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
