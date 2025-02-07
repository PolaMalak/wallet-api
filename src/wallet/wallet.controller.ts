import { Body, Controller, Post, UseGuards, Get } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WalletResponse } from "./response";
import { GetLoggedUserId } from "src/auth/decorator";

@Controller("wallet")
@ApiTags("Wallet")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: WalletResponse,
  })
  async getWalletDetails(
    @GetLoggedUserId() userId: number
  ): Promise<WalletResponse> {
    return await this.walletService.getWalletDetails(userId);
  }
}
