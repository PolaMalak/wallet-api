import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { WalletModule } from "./wallet/wallet.module";
import { TransactionModule } from "./transaction/transaction.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    WalletModule,
    TransactionModule,
    UserModule,
  ],
})
export class AppModule {}
