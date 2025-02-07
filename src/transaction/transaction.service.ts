import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTransactionDto } from "./dto";
import { WalletService } from "../wallet/wallet.service";
import { ETransactionType } from "./enum";
import { Wallet } from "@prisma/client";

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService
  ) {}

  /**
   * Retrieves all transactions associated with a user's wallet.
   * @param userId - The ID of the user whose transactions are being retrieved.
   * @returns A promise resolving to an array of transactions.
   * @throws NotFoundException if the user's wallet does not exist.
   */
  async getTransactions(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) throw new NotFoundException("Wallet not found");

    return this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
    });
  }

  /**
   * Creates a transaction for a user's wallet based on the type (CHARGE/TOP_UP).
   * @param userId - The ID of the user performing the transaction.
   * @param dto - Data transfer object containing transaction details (amount, type).
   * @returns A promise resolving to the created transaction.
   * @throws NotFoundException - if the wallet is not found.
   * @throws BadRequestException - if the transaction type is invalid.
   */
  async createTransaction(userId: number, dto: CreateTransactionDto) {
    const { amount, type } = dto;
    let wallet: Wallet;

    if (type === ETransactionType.CHARGE) {
      wallet = await this.walletService.charge(userId, { amount });
    } else if (type === ETransactionType.TOP_UP) {
      wallet = await this.walletService.topUp(userId, { amount });
    } else {
      throw new BadRequestException("Invalid transaction type");
    }

    return this.prisma.transaction.create({
      data: { amount, type, walletId: wallet.id },
    });
  }
}
