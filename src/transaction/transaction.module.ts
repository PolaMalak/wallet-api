import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaService } from "../prisma/prisma.service";
import { WalletModule } from "src/wallet/wallet.module";

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService],
  imports: [WalletModule],
})
export class TransactionModule {}
