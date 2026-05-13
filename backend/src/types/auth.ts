export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}
