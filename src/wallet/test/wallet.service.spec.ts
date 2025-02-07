import { Test, TestingModule } from "@nestjs/testing";
import { WalletService } from "../wallet.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Wallet } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";

describe("WalletService", () => {
  let service: WalletService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: PrismaService,
          useValue: {
            wallet: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should initialize a wallet", async () => {
    jest
      .spyOn(prisma.wallet, "create")
      .mockResolvedValue({ id: 1, userId: 1, balance: 0 } as Wallet);

    expect(await service.initializeWallet(1)).toEqual({
      id: 1,
      userId: 1,
      balance: 0,
    });
  });

  it("should charge a wallet", async () => {
    jest
      .spyOn(prisma.wallet, "findUnique")
      .mockResolvedValue({ id: 1, balance: 100 } as Wallet);

    jest
      .spyOn(prisma.wallet, "update")
      .mockResolvedValue({ id: 1, balance: 50 } as Wallet);

    expect(await service.charge(1, { amount: 50 })).toEqual({
      id: 1,
      balance: 50,
    });
  });

  it("should throw bad request if wallet has insufficient balance for charge", async () => {
    jest
      .spyOn(prisma.wallet, "findUnique")
      .mockResolvedValue({ id: 1, balance: 100 } as Wallet);

    await expect(service.charge(1, { amount: 150 })).rejects.toThrow(
      new BadRequestException("Insufficient balance")
    );
  });

  it("should top-up a wallet", async () => {
    jest
      .spyOn(prisma.wallet, "findUnique")
      .mockResolvedValue({ id: 1, balance: 100 } as Wallet);

    jest
      .spyOn(prisma.wallet, "update")
      .mockResolvedValue({ id: 1, balance: 150 } as Wallet);

    expect(await service.topUp(1, { amount: 50 })).toEqual({
      id: 1,
      balance: 150,
    });
  });
});
