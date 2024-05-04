import { type Message } from 'ai'

// Определение интерфейса Chat
export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

// Определение типа для результатов серверных действий
export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>;

// Функция для фильтрации сообщений с ролью 'system' из массива сообщений в чате
export function filterSystemMessages(chat: Chat): Chat {
  const filteredMessages = chat.messages.filter(message => message.role !== 'system');
  return {
    ...chat,
    messages: filteredMessages
  };
}
