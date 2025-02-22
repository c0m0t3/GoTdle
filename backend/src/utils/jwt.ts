import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export class Jwt {
  constructor(
    private readonly secret: string,
    private readonly options: SignOptions,
  ) {}

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, this.options);
  }

  verifyToken(token: string): JwtToken {
    return jwt.verify(token, this.secret) as JwtToken;
  }
}

type JwtUserData = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

export type JwtToken = JwtUserData & JwtPayload;
