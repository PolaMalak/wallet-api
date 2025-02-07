import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { RegisterDto, LoginDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const userExist = await this.userService.findUserByEmail(dto.email);
    if (userExist) throw new BadRequestException("This email already exist");
    const user = await this.userService.createUser(dto);
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.validateUser(dto.email, dto.password);
    if (!user) throw new BadRequestException("Invalid credentials");

    return { access_token: this.jwtService.sign({ userId: user.id }) };
  }
}
