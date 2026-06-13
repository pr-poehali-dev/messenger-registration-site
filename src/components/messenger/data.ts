export interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  read: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup: boolean;
  members?: number;
  messages: Message[];
  color: string;
}

export const DEMO_CHATS: Chat[] = [
  {
    id: 1,
    name: 'Арина Волкова',
    avatar: 'АВ',
    lastMessage: 'Увидимся на презентации!',
    time: '14:32',
    unread: 3,
    online: true,
    isGroup: false,
    color: 'linear-gradient(135deg, #a855f7, #ec4899)',
    messages: [
      { id: 1, text: 'Привет! Как дела?', time: '14:20', out: false, read: true },
      { id: 2, text: 'Всё отлично, работаю над проектом', time: '14:22', out: true, read: true },
      { id: 3, text: 'О, здорово! Когда будет готово?', time: '14:25', out: false, read: true },
      { id: 4, text: 'Планирую сдать в пятницу', time: '14:28', out: true, read: true },
      { id: 5, text: 'Увидимся на презентации!', time: '14:32', out: false, read: false },
    ],
  },
  {
    id: 2,
    name: 'Команда Pulse',
    avatar: '⚡',
    lastMessage: 'Дизайн готов к ревью',
    time: '13:15',
    unread: 12,
    online: false,
    isGroup: true,
    members: 8,
    color: 'linear-gradient(135deg, #06d6f5, #a855f7)',
    messages: [
      { id: 1, text: 'Всем привет! Начинаем спринт 🚀', time: '09:00', out: false, read: true },
      { id: 2, text: 'Я взял задачи по бэкенду', time: '09:05', out: true, read: true },
      { id: 3, text: 'Дизайн готов к ревью', time: '13:15', out: false, read: false },
    ],
  },
  {
    id: 3,
    name: 'Максим Соколов',
    avatar: 'МС',
    lastMessage: 'Скинь файлы по проекту',
    time: 'Вчера',
    unread: 0,
    online: true,
    isGroup: false,
    color: 'linear-gradient(135deg, #00f5d4, #06d6f5)',
    messages: [
      { id: 1, text: 'Макс, ты посмотрел отчёт?', time: 'Вчера 18:00', out: true, read: true },
      { id: 2, text: 'Да, всё норм. Скинь файлы по проекту', time: 'Вчера 18:30', out: false, read: true },
    ],
  },
  {
    id: 4,
    name: 'Проект Альфа',
    avatar: 'ПА',
    lastMessage: 'Встреча в 15:00',
    time: 'Вчера',
    unread: 0,
    online: false,
    isGroup: true,
    members: 5,
    color: 'linear-gradient(135deg, #f72585, #a855f7)',
    messages: [
      { id: 1, text: 'Коллеги, встреча в 15:00', time: 'Вчера 10:00', out: false, read: true },
      { id: 2, text: 'Буду', time: 'Вчера 10:05', out: true, read: true },
    ],
  },
  {
    id: 5,
    name: 'Юля Петрова',
    avatar: 'ЮП',
    lastMessage: 'Спасибо большое! 🙌',
    time: 'Пн',
    unread: 0,
    online: false,
    isGroup: false,
    color: 'linear-gradient(135deg, #ffd60a, #f72585)',
    messages: [
      { id: 1, text: 'Помогла с документами', time: 'Пн 12:00', out: true, read: true },
      { id: 2, text: 'Спасибо большое! 🙌', time: 'Пн 12:10', out: false, read: true },
    ],
  },
];

export const CONTACTS = [
  { id: 1, name: 'Арина Волкова', phone: '+7 901 234-56-78', online: true, avatar: 'АВ', color: 'linear-gradient(135deg, #a855f7, #ec4899)' },
  { id: 2, name: 'Максим Соколов', phone: '+7 902 345-67-89', online: true, avatar: 'МС', color: 'linear-gradient(135deg, #00f5d4, #06d6f5)' },
  { id: 3, name: 'Юля Петрова', phone: '+7 903 456-78-90', online: false, avatar: 'ЮП', color: 'linear-gradient(135deg, #ffd60a, #f72585)' },
  { id: 4, name: 'Дима Козлов', phone: '+7 904 567-89-01', online: false, avatar: 'ДК', color: 'linear-gradient(135deg, #06d6f5, #a855f7)' },
  { id: 5, name: 'Саша Новикова', phone: '+7 905 678-90-12', online: true, avatar: 'СН', color: 'linear-gradient(135deg, #00f5d4, #a855f7)' },
];
