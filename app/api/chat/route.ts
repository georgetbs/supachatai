import 'server-only'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth({ cookieStore }))?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  const originalMessages = [...messages];

  const apiMessages = [
    {
      role: 'system',
      content: `\
      You are a helpful assistant for Georgian people.
      When a user makes a request, you try your best to help the user.
      
      The user does not have Georgian symbols, so write your response in the transliterated Latin alphabet. Here are examples:
      უდაბნო -> udabno
      ქარი -> k'ari
      ჩაი -> ch'ai
      ცხენი -> tskheni
      
      But when you do coding tasks, please use English.`
    },
    ...messages.map((msg: { role: string; content: string }) => ({
      ...msg,
      content: msg.role !== 'system' ? transliterateGeorgian(msg.content) : msg.content
    }))
  ];

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: apiMessages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...originalMessages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await supabase.from('chats').upsert({ id, payload }).throwOnError()
    }
  })

  type GeorgianToLatinMap = {
    [key: string]: string;
  };

  function transliterateGeorgian(content: string): string {
    const georgianToLatin: GeorgianToLatinMap = {
      'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e',
      'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k',
      'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p',
      'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u',
      'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q', 'შ': 'sh',
      'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'tch',
      'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
    };
    return content.split('').map(char => georgianToLatin[char] || char).join('');
  }

  return new StreamingTextResponse(stream)
}
