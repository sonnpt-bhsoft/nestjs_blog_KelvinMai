import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from 'src/models/user.dto';

@Injectable()
export class AuthService {
  private mockUser = {
    email: 'jokerboy@gmail.com',
    token: 'jwt.token.here',
    username: 'jokerboy',
    bio: "I'm a magician",
    image: null,
  };

  register(credentials: RegisterDTO) {
    return this.mockUser;
  }

  login(credentials: LoginDTO) {
    if (credentials.email === this.mockUser.email) {
      return this.mockUser;
    }
    throw new InternalServerErrorException();
  }
}
