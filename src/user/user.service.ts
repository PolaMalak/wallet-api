import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UserResponse } from "./response";
import { WalletService } from "../wallet/wallet.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService
  ) {}

  /**
   * Creates a new user with a hashed password and initializes their wallet.
   * @param dto - Data transfer object containing user creation details (email, name, password).
   * @returns A promise resolving to a UserResponse object.
   */
  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    await this.walletService.initializeWallet(user.id);
    return new UserResponse(user);
  }

  /**
   * Finds a user by their email address.
   * @param email - The email of the user to find.
   * @returns A promise resolving to the found user or null if not found.
   */
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user to find.
   * @returns A promise resolving to the found user or null if not found.
   */
  async findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Validates a user by comparing the provided password with the stored hashed password.
   * @param email - The user's email.
   * @param password - The plaintext password to validate.
   * @returns The user object if validation succeeds, null otherwise.
   */
  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  /**
   * Retrieves the user's profile by their ID.
   * @param userId - The ID of the user whose profile is being retrieved.
   * @returns A promise resolving to a UserResponse object or throws a NotFoundException.
   */
  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(`User with id ${userId} was not found`);

    return new UserResponse(user);
  }
}
