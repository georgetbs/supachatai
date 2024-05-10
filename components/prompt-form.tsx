import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn,} from '@/lib/utils'
import { Button, buttonVariants  } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'

export interface PromptProps extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string, file: File | null) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [isFileLoading, setIsFileLoading] = React.useState(false)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null
    setFile(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input?.trim() && !file) {
      return
    }
    setIsFileLoading(true) // Установка состояния загрузки файла
    await onSubmit(input, file)
    setInput('')
    setFile(null)
    setIsFileLoading(false) // Сброс состояния загрузки файла после отправки
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background text-primary p-0 sm:left-4'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPlus />
              <span className="sr-only">დაურთეთ ფაილი</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>ფაილი დაერთო {file ? `: ${file.name}` : ''}</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="შეიყვანეთ შეტყობინება"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || isFileLoading || (!input && !file)}
              >
                <IconArrowElbow />
                <span className="sr-only">შეტყობინების გაგზავნა</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>შეტყობინების გაგზავნა</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
