import { IMessage } from "@/database/message.model";

export interface IUser {
  _id: string;
  username: string;
}

export interface SocketMessage {
  user: string;
  message: string;
  timestamp?: Date;
}

export interface IToken {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface getMessagesProps {
  from: string;
  to: string;
}

export interface getChatUsersProps {
  userId: string;
}

export interface createChatProps {
  username: string;
  userId: string;
  path: string;
}

export interface Chat {
  _id: string;
  username: string;
}

export interface MessageFormProps {
  user: string | null;
  addMessage: React.Dispatch<React.SetStateAction<SocketMessage[]>>
}

export interface MessagePanelProps {
  messageArray: string;
  username: string;
}

export interface NewChatProps {
  currentUser: string;
}

export interface SidebarProps {
  chats: string;
  currentUser: string;
}

export interface ChatWithRecentMessage {
  chatUser: Chat;
  recentMessage: IMessage | null;
}

export interface ConnectedUser {
  _id: string;
  username: string;
}