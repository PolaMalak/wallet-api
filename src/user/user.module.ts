import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";
import { WalletModule } from "src/wallet/wallet.module";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
  imports: [WalletModule],
})
export class UserModule {}
