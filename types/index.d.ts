export interface User {
    _id: string;
    username: string;
  }
  
export interface Message {
    user: string;
    message: string;
  }