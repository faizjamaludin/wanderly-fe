export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
