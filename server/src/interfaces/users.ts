export interface RegisterUserReqBody {
  username: string;
  password: string;
}

export interface LoginUserReqBody {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  points: number;
  level: number;
  readable_font: boolean;
}

export interface FormattedUser {}
