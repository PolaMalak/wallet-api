import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "../transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { WalletService } from "../../wallet/wallet.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ETransactionType } from "../enum";
import { Transaction, Wallet } from "@prisma/client";

describe("TransactionService", () => {
  let service: TransactionService;
  let prisma: PrismaService;
  let walletService: WalletService;

  beforeEach(async () => {
    const prismaMock = {
      wallet: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };

    const walletMock = {
      charge: jest.fn(),
      topUp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: WalletService, useValue: walletMock },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
    walletService = module.get<WalletService>(WalletService);
  });

  it("should return transactions for a user", async () => {
    jest
      .spyOn(prisma.wallet, "findUnique")
      .mockResolvedValue({ id: 1 } as Wallet);
    jest
      .spyOn(prisma.transaction, "findMany")
      .mockResolvedValue([{ id: 1, amount: 100 }] as Transaction[]);

    expect(await service.getTransactions(1)).toEqual([{ id: 1, amount: 100 }]);
  });

  it("should throw NotFoundException if wallet not found", async () => {
    jest.spyOn(prisma.wallet, "findUnique").mockResolvedValue(null);
    await expect(service.getTransactions(1)).rejects.toThrow(NotFoundException);
  });

  it("should create a charge transaction", async () => {
    jest.spyOn(walletService, "charge").mockResolvedValue({ id: 1 } as Wallet);
    jest
      .spyOn(prisma.transaction, "create")
      .mockResolvedValue({ id: 1, type: "CHARGE", amount: 100 } as Transaction);

    expect(
      await service.createTransaction(1, {
        amount: 100,
        type: ETransactionType.CHARGE,
      })
    ).toEqual({ id: 1, type: "CHARGE", amount: 100 });
  });

  it("should create a top-up transaction", async () => {
    jest.spyOn(walletService, "topUp").mockResolvedValue({ id: 1 } as Wallet);
    jest
      .spyOn(prisma.transaction, "create")
      .mockResolvedValue({ id: 1, type: "TOP_UP", amount: 100 } as Transaction);

    expect(
      await service.createTransaction(1, {
        amount: 100,
        type: ETransactionType.TOP_UP,
      })
    ).toEqual({ id: 1, type: "TOP_UP", amount: 100 });
  });

  it("should throw NotFoundException if invalid type sent", async () => {
    await expect(
      service.createTransaction(1, {
        amount: 100,
        type: "Invalid Type" as any,
      })
    ).rejects.toThrow(new NotFoundException("Invalid transaction type"));
  });
});
