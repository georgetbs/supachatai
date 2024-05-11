import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight, IconTota } from '@/components/ui/icons'

const exampleMessages = [
  { heading: 'პროგრამული კოდის განხილვა', message: 'გთხოვთ, გაუკეთოთ კოდრივიუ ამ Python კოდს და მომაწოდოთ შენიშვნები:' },
{ heading: 'ლექსის ანალიზი', message: 'განმარტეთ შოთა რუსთაველის "ვეფხისტყაოსნის" შინაარსი' },
{ heading: 'წერილის რედაქტირება', message: 'გთხოვთ, გააუმჯობესოთ ეს ოფიციალური წერილის პროექტი:' },
{ heading: 'მათემატიკური ამოცანის ამოხსნა', message: 'დამეხმარეთ ამ დიფერენციალური განტოლების ამოხსნაში:' }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <>
    <div className="relative mx-auto max-w-2xl px-4 pt-6">
    <div className="flex flex-col gap-2 sm:rounded-3xl bg-background p-8">
        <div className='flex self-center'>
        <IconTota className='border-2 text-primary rounded-full shadow h-[70px] w-[70px]'/>
        </div>
        <h1 className="mt-2 mb-2 text-xl font-semibold text-center">
        
        </h1>
        <h1 className="mt-2 mb-2 text-2xl font-semibold text-center">
        როგორ შემიძლია დაგეხმაროთ დღეს?
        </h1>
        </div>
  
      
    </div>
          <div className="fixed inset-x-0 bottom-40 mx-auto w-full max-w-2xl px-4 grid grid-cols-2 gap-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="cursor-pointer space-y-4 rounded-xl border p-12 sm:p-8 max-w-screen-sm ps-6 pe-6 hover:bg-gray-50 dark:bg-background dark:hover:bg-zinc-900"

              
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 w-4 h-4 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
        </>
  )
}
