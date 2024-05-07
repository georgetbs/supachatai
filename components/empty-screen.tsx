import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  { heading: 'პროგრამული კოდის განხილვა', message: 'გთხოვთ, გაუკეთოთ კოდრივიუ ამ Python კოდს და მომაწოდოთ შენიშვნები:' },
{ heading: 'ლექსის ანალიზი', message: 'განმარტეთ შოთა რუსთაველის "ვეფხისტყაოსნის" შინაარსი' },
{ heading: 'წერილის რედაქტირება', message: 'გთხოვთ, გააუმჯობესოთ ეს ოფიციალური წერილის პროექტი:' },
{ heading: 'მათემატიკური ამოცანის ამოხსნა', message: 'დამეხმარეთ ამ დიფერენციალური განტოლების ამოხსნაში:' }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <>
    <div className="mx-auto max-w-2xl px-4 align-middle">
    <div className="flex flex-col gap-2 border bg-background p-8 pt-6 sm:rounded-3xl">
        <h1 className="my-2 text-center text-xl font-semibold">
        მოგესალმებით TOTA AI ჩათბოთში! 
        </h1>
        <h1 className="my-2 text-center text-2xl font-semibold">
        როგორ შემიძლია დაგეხმაროთ დღეს?
        </h1>
        </div>
  
      
    
          <div className="fixed inset-x-0 bottom-40 mx-auto grid w-full max-w-2xl grid-cols-2 gap-4 px-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="cursor-pointer space-y-4 rounded-xl border bg-white p-8 pe-6 ps-6 hover:bg-gray-50 dark:bg-zinc-950  dark:hover:bg-zinc-900"
              
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
        </div>
        </>
  )
}
