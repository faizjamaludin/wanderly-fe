export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
