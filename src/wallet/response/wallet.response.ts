import { ApiProperty } from "@nestjs/swagger";
import { Wallet } from "@prisma/client";

export class WalletResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  balance: number;
  constructor(wallet: Wallet) {
    this.id = wallet.id;
    this.balance = wallet.balance;
  }
}
