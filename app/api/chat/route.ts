// Импорт необходимых зависимостей и библиотек
import 'server-only'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/db_types'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

// Указание, что скрипт выполняется на сервере
export const runtime = 'edge'

// Конфигурация API ключа OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

// Инициализация клиента API OpenAI
const openai = new OpenAIApi(configuration)

// Определение типа для сообщений
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Определение типа для словаря транслитерации
type GeorgianToLatinMap = {
  [key: string]: string;
};

// Функция для транслитерации грузинских символов в латинские
function transliterateGeorgian(content: string): string {
  // Словарь транслитерации
  const georgianToLatin: GeorgianToLatinMap = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e',
    'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k',
    'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p',
    'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u',
    'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q', 'შ': 'sh',
    'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'tch',
    'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
  };

  // Транслитерация каждого символа в строке
  return content.split('').map(char => georgianToLatin[char] || char).join('');
}


// Основная функция для обработки POST запросов
export async function POST(req: Request) {
  // Создание хранилища для кук
  const cookieStore = cookies()
  // Создание клиента для работы с базой данных через Supabase
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
  // Получение тела запроса в формате JSON
  const json = await req.json()
  // Деструктуризация необходимых данных из запроса
  const { messages, previewToken } = json
  // Аутентификация пользователя и получение его ID
  const userId = (await auth({ cookieStore }))?.user.id

  // Проверка авторизации пользователя
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // Переключение API ключа, если передан previewToken
  if (previewToken) {
    configuration.apiKey = previewToken
  }

  // Добавление системного сообщения для настройки поведения модели
  messages.unshift({
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
  });

  // Транслитерация всех сообщений перед отправкой в OpenAI
  messages.forEach((message: Message) => {
    if (message.role !== 'system') {
      message.content = transliterateGeorgian(message.content);
    }
  });

  // Создание чата с помощью API OpenAI
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  // Обработка потока ответов от OpenAI
  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      // Формирование данных чата для сохранения в базу
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
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      // Вставка данных чата в базу данных
      await supabase.from('chats').upsert({ id, payload }).throwOnError()
    }
  })

  // Возврат поточного текстового ответа
  return new StreamingTextResponse(stream)
}
