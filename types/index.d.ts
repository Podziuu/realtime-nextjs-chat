export interface IUser {
  _id: string;
  username: string;
}

export interface IMessage {
  user: string;
  message: string;
  timestamp?: Date;
}

export interface IToken {
  userId: string;
  iat: number;
  exp: number;
}
