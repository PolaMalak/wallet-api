import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { WalletService } from "../../wallet/wallet.service";
import { UserService } from "../user.service";
import { User } from "@prisma/client";

describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: WalletService,
          useValue: { initializeWallet: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    walletService = module.get<WalletService>(WalletService);
  });

  it("should create a new user", async () => {
    const hashedPassword = await bcrypt.hash("password", 10);
    jest.spyOn(prisma.user, "create").mockResolvedValue({
      id: 1,
      email: "test@test.com",
      name: "Test User",
      password: hashedPassword,
    } as User);
    jest.spyOn(walletService, "initializeWallet").mockResolvedValue({} as any);

    expect(
      await service.createUser({
        email: "test@test.com",
        name: "Test User",
        password: "password",
      })
    ).toEqual(expect.objectContaining({ email: "test@test.com" }));
  });

  it("should return user profile", async () => {
    jest
      .spyOn(prisma.user, "findFirst")
      .mockResolvedValue({ id: 1, email: "test@test.com" } as User);

    expect(await service.getUserProfile(1)).toEqual(
      expect.objectContaining({ email: "test@test.com" })
    );
  });

  it("should throw NotFoundException when user is not found", async () => {
    jest.spyOn(prisma.user, "findFirst").mockResolvedValue(null);

    await expect(service.getUserProfile(1)).rejects.toThrow(NotFoundException);
  });
});
