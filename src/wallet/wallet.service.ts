import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TopUpDto, ChargeDto } from "./dto";
import { WalletResponse } from "./response";
import { Wallet } from "@prisma/client";

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  /**
   * Initializes a wallet for a newly created user.
   * @param userId - The ID of the user for whom the wallet is being initialized.
   * @returns A promise resolving to the created wallet.
   */
  async initializeWallet(userId: number): Promise<Wallet> {
    return this.prisma.wallet.create({
      data: { userId, balance: 0 },
    });
  }

  /**
   * Retrieves a user's wallet details.
   * @param userId - The ID of the user whose wallet is being retrieved.
   * @returns A promise resolving to wallet response or throws a NotFoundException if not found.
   */
  async getWalletDetails(userId: number): Promise<WalletResponse> {
    const wallet = await this.getWalletOrFail(userId);
    return new WalletResponse(wallet);
  }

  /**
   * Retrieves a wallet by userid or fail.
   * @param userId - The ID of the user whose wallet is being retrieved.
   * @returns A promise resolving to the wallet or throws a NotFoundException if not found.
   */
  private async getWalletOrFail(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");
    return wallet;
  }

  /**
   * Charges a user's wallet by adding a specified amount.
   * @param userId - The ID of the user whose wallet is being top-up.
   * @param amount - The amount to be added.
   * @returns A promise resolving to the updated wallet.
   * @throws NotFoundException if the wallet does not exist.
   */
  async topUp(userId: number, { amount }: { amount: number }): Promise<Wallet> {
    const wallet = await this.getWalletOrFail(userId);
    return this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance + amount },
    });
  }

  /**
   * Deducts an amount from a user's wallet (charge functionality).
   * @param userId - The ID of the user whose wallet is being charged.
   * @param amount - The amount to be deducted.
   * @returns A promise resolving to the updated wallet.
   * @throws NotFoundException if the wallet does not exist.
   * @throws BadRequestException if the balance is insufficient.
   */
  async charge(
    userId: number,
    { amount }: { amount: number }
  ): Promise<Wallet> {
    const wallet = await this.getWalletOrFail(userId);
    if (wallet.balance < amount) {
      throw new BadRequestException("Insufficient balance");
    }

    return this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - amount },
    });
  }
}
