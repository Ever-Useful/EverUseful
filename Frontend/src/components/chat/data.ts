export interface Message {
  id: string;
  sender: 'me' | 'them';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
  unreadCount: number;
}

// This is the mock data for your connections
export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Jane Doe',
    avatar: 'https://via.placeholder.com/150',
    unreadCount: 2,
    messages: [
      { id: 'm1', sender: 'them', content: 'Hey, how are you?', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'me', content: 'I am good, thanks for asking!', timestamp: '10:01 AM' },
      { id: 'm3', sender: 'them', content: 'Great! Do you have a moment to discuss the project?', timestamp: '10:02 AM' },
      { id: 'm4', sender: 'them', content: 'There are a few updates I wanted to share.', timestamp: '10:02 AM' },
    ],
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'https://via.placeholder.com/150',
    unreadCount: 0,
    messages: [
      { id: 'm5', sender: 'me', content: 'Hi John, did you get the files I sent yesterday?', timestamp: 'Yesterday' },
      { id: 'm6', sender: 'them', content: 'Yes, I did. I will review them today.', timestamp: 'Yesterday' },
    ],
  },
  {
    id: '3',
    name: 'Peter Jones',
    avatar: 'https://via.placeholder.com/150',
    unreadCount: 0,
    messages: [
        { id: 'm7', sender: 'them', content: 'Thanks for the meeting earlier.', timestamp: 'Monday' },
    ],
  },
];