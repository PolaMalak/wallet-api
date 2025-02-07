import { Controller, Get, UseGuards, Body, Post } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateTransactionDto } from "./dto";
import { GetLoggedUserId } from "src/auth/decorator";

@Controller("transactions")
@ApiTags("Transactions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  getTransactions(@GetLoggedUserId() userId: number) {
    return this.transactionService.getTransactions(userId);
  }

  @Post()
  createTransaction(
    @GetLoggedUserId() userId,
    @Body() dto: CreateTransactionDto
  ) {
    return this.transactionService.createTransaction(userId, dto);
  }
}
